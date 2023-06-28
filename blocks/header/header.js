import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  isDesktop,
  template,
  createEl,
} from '../../scripts/scripts.js';

export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const navResp = await fetch(`${navPath}.plain.html`);

  if (navResp.ok) {
    const html = await navResp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    block.append(nav);

    const subMenuEls = nav.querySelectorAll('ul>li>ul');
    subMenuEls.forEach((subMenuEl) => {
      const menuLinkEl = subMenuEl.closest('li').querySelector('a');
      menuLinkEl.classList.add('expander');
      menuLinkEl.addEventListener('click', (e) => {
        subMenuEl.classList.toggle('visible');
        e.preventDefault();
      });
      const subMenuItemEls = subMenuEl.querySelectorAll('li');
      subMenuItemEls.forEach((subMenuItemEl) => {
        const pictureEl = subMenuItemEl.querySelector('picture');
        const linkEl = subMenuItemEl.querySelector('a');
        const textEl = subMenuItemEl.textContent;
        subMenuItemEl.replaceChildren(pictureEl, linkEl, createEl('p', {}, textEl));
      });
    });

    const hamburgerEl = createEl('a', {
      class: 'hamburger',
      href: '#',
    }, '☰', nav);

    hamburgerEl.addEventListener('click', () => {
      const menuListEl = nav.querySelector('ul');
      menuListEl.classList.toggle('visible');
    });
  }

  const chinEl = createEl('div', {
    class: 'chin',
  }, '', block);

  const statusResp = await fetch('/vest-status.plain.html');
  if (statusResp.ok) {
    const html = await statusResp.text();

    const statusEl = createEl('div', {
      class: 'status',
    }, html, chinEl);
  }

  const searchBarEl = createEl('div', {
    class: 'search',
  }, `
    <form role="search" method="get" action="https://vaemergency.gov">
      <label>
        <span class="screen-reader-text">Search for:</span>
      </label>
      <input type="search" class="addsearch search-field keyboard-outline" placeholder="Search …" value="" name="addsearch" data-addsearch-field="true" autocomplete="off" aria-label="Search field">
    </form>
  `, chinEl);
}
