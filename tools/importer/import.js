/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */


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

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '.de-mega-menu-container',
      '#nav_menu-2',
      'img[height="1"]'
    ]);

    const tableEls = document.querySelectorAll('table');
    tableEls.forEach(tableEl => {
      console.log('Found Table');
      const header = tableEl.createTHead();
      const row = header.insertRow(0);
      const cell = row.insertCell(0);
      cell.innerHTML = 'Table';
    });

    const promoEls = document.querySelectorAll('.et_pb_promo');
    promoEls?.forEach(promoEl => {
      console.log('Found a promo fragment: ', promoEl.outerHTML);
    });


    // create the metadata block and append it to the main element
    createMetadata(main, document);

    const fileDefs = [{
      element: main,
      path: WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
    }];

    return fileDefs;
  },
};