import {
  isDesktop,
  template,
  createEl,
} from '../../scripts/scripts.js';

export default function decorate(blockEl) {
  document.querySelector('header').after(blockEl);
  const contentEl = blockEl.querySelector('div');
  contentEl.classList.add('content-row');
  const menuListEl = blockEl.querySelector('ul');
  const menuRowEl = menuListEl.parentElement.parentElement;
  menuRowEl.classList.add('menu-row');
  const hamburgerRowEl = createEl('div', {
    class: 'hamburger-row',
  }, '');
  const hamburgerEl = createEl('a', {
    class: 'hamburger',
    href: '#',
  }, 'Section Navigation <span>☰</span>', hamburgerRowEl);
  hamburgerEl.addEventListener('click', () => {
    menuRowEl.classList.toggle('show');
  });
  contentEl.after(hamburgerRowEl);
}
