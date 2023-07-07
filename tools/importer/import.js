/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

export function createEl(name, attributes = {}, content = '', parentEl = null) {
  const el = document.createElement(name);

  Object.keys(attributes).forEach((key) => {
    el.setAttribute(key, attributes[key]);
  });
  if (content) {
    if (typeof content === 'string') {
      el.innerHTML = content;
    } else {
      el.append(content);
    }
  }
  if (parentEl) {
    parentEl.append(el);
  }
  return el;
}

function createSingleRowBlock(name, contentEl) {
  console.log('Block content', contentEl);
  const blockEl = createEl('table', {}, `
        <th>
          ${name}
        </th>
        <tr>
          <td>
            ${(typeof contentEl === 'string') ? contentEl : contentEl.outerHTML}
          </td>
        </tr>
      `);
  return blockEl;
}

function createMultiRowBlock(name, contentEls) {
  console.log('Multirow Block content', contentEls);
  const blockEl = createEl('table', {}, `
    <th>
      ${name}
    </th>
  `);
  contentEls.forEach((contentEl) => {
    blockEl.append(createEl('tr', {}, `
      <td>
        ${(typeof contentEl === 'string') ? contentEl : contentEl?.outerHTML}
      </td>
    `));
  });
  return blockEl;
}

function createFragment(name, contentEl, supressBlock) {
  console.log('Fragment content', contentEl);
  let blockEl;
  if (supressBlock) {
    blockEl = createEl('body', {}, contentEl.outerHTML);
  } else {
    blockEl = createEl('body', {}, createSingleRowBlock(name, contentEl));
  }
  return createEl('html', {}, blockEl);
}

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const publishTime = document.querySelector('[property="article:published_time"]');
  if (publishTime) {
    meta.PublishTime = publishTime.content;
  }

  const author = document.querySelector('[property="article:author"]');
  if (author) {
    meta.Author = author.content;
  }

  const type = document.querySelector('[property="og:type"]');
  if (type) {
    meta.Type = type.content;
  }
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default {
  /**
   * Apply DOM operations to the provided document and return an array of
   * objects ({ element: HTMLElement, path: string }) to be transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {Array} The { element, path } pairs to be transformed
   */
  transform: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    const fileDefs = [{
      element: main,
      path: WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
    }];

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '.de-mega-menu-container',
      'img[height="1"]',
    ]);

    // Fix Links
    const linkEls = document.querySelectorAll('a');
    linkEls.forEach((link) => {
      const { href } = link;
      if (href.startsWith('/')) {
        link.href = `https://www.vaemergency.gov${href}`;
      }
    });

    const tableEls = document.querySelectorAll('table');
    tableEls.forEach((tableEl) => {
      console.log('Found Table');
      const header = tableEl.createTHead();
      const row = header.insertRow(0);
      const cell = row.insertCell(0);
      cell.innerHTML = 'Table';
    });

    const navMenuEl = document.querySelector('#nav_menu-2');
    if (navMenuEl) {
      console.log('Found Nav Menu');
      const navMenuTitleEl = navMenuEl.querySelector('h4');
      const navMenuFragment = createFragment('NavMenu', navMenuEl, true);
      const navMenuFragmentPath = `/fragments/nav-menus/${WebImporter.FileUtils.sanitizeFilename(navMenuTitleEl.textContent)}`;
      console.log('navMenuFrag: ', navMenuFragment);
      fileDefs.push({
        element: navMenuFragment,
        path: navMenuFragmentPath,
      });
      navMenuEl.remove();
    }

    const ctaEls = document.querySelectorAll('.et_pb_promo');
    ctaEls?.forEach((ctaEl) => {
      console.log('Found a CTA fragment: ', ctaEl.outerHTML);
      const ctaTitleEl = ctaEl.querySelector('h2');
      const ctaTextEl = ctaEl.querySelector('p');
      const ctaLinkEl = ctaEl.querySelector('a');
      const contentEl = document.createElement('div');
      if (ctaTitleEl) { contentEl.append(ctaTitleEl); }
      if (ctaTextEl) { contentEl.append(ctaTextEl); }
      if (ctaLinkEl) { contentEl.append(ctaLinkEl); }
      const ctaFragment = createFragment('CTA', contentEl);
      const ctaPath = `/fragments/cta/${WebImporter.FileUtils.sanitizeFilename(ctaTitleEl.textContent)}`;
      console.log('ctaEl: ', ctaFragment);
      fileDefs.push({
        element: ctaFragment,
        path: ctaPath,
      });
      const fragmentBlockEl = createSingleRowBlock('Fragment', `https://main--vdem--hlxsites.hlx.page${ctaPath}`);
      console.log('fragmentBlockEl', fragmentBlockEl);
      ctaEl.innerHTML = fragmentBlockEl.outerHTML;
    });

    // // Blue Info Title
    // const headerEl = document.querySelector('.et_pb_row_inner.et_pb_row_inner_1_tb_body');
    // if (headerEl) {
    //   const labelHTML = headerEl.querySelector('.dmach-acf-label')?.innerHTML;
    //   const linkHTML = headerEl.querySelector('.linked_list_item')?.innerHTML;
    //   if (labelHTML && linkHTML) {
    //     headerEl.innerHTML = `<strong>${labelHTML} ${linkHTML}</strong>`;
    //   }
    // }

    // Content List Common
    const contentListCommonEls = document.querySelectorAll('.grid-posts.loop-grid');
    contentListCommonEls.forEach((contentListEl) => {
      console.log('Found Content List Common: ');
      const contentEls = contentListEl.querySelectorAll('.grid-item-cont');
      const blockEl = createMultiRowBlock('Content List', contentEls);
      contentListEl.outerHTML = blockEl.outerHTML;
    });

    // Content List Files
    const contentListFilesEls = document.querySelectorAll('.et_pb_de_mach_repeater');
    contentListFilesEls.forEach((contentListEl) => {
      console.log('Found Content List Files: ');
      const contentEls = contentListEl.querySelectorAll('.dmach-grid-item');
      const blockEl = createMultiRowBlock('Content List (Files)', contentEls);
      contentListEl.outerHTML = blockEl.outerHTML;
    });

    // Section Nav
    const sectionNavEl = document.querySelector('.et_pb_section.et_pb_section_1_tb_body.et_pb_with_background.et_section_regular');
    if (sectionNavEl) {
      const contentEl = sectionNavEl.querySelector('div.et_pb_column.et_pb_column_1_2.et_pb_column_0_tb_body.et_pb_css_mix_blend_mode_passthrough');
      const menuListEl = sectionNavEl.querySelector('.et_pb_row--with-menu ul');
      sectionNavEl.outerHTML = createMultiRowBlock('Section Nav', [contentEl, menuListEl]).outerHTML;
      document.querySelector('div.et_pb_section.et_pb_section_3_tb_body.et_pb_with_background.et_section_regular')?.remove();
    }

    // Content List Gallery
    const contentListGalleryEls = document.querySelectorAll('.et_pb_module.et_pb_gallery');
    contentListGalleryEls.forEach((contentListEl) => {
      console.log('Found Content List Gallery: ');
      const contentEls = contentListEl.querySelectorAll('.et_pb_gallery_item');
      const blockEl = createMultiRowBlock('Content List (Gallery)', contentEls);
      contentListEl.outerHTML = blockEl.outerHTML;
      contentListEl.remove(); //For now...
    });

    // Create Header Sections
    const headerEls = document.querySelectorAll('h2');
    headerEls.forEach((headerEl) => {
      if (!headerEl.closest('table')) {
        headerEl.before('---');
      }
    });

    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return fileDefs;
  },
};
