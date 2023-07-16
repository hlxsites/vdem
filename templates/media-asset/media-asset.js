import {
  createEl,
} from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const sectionEl = document.querySelector('.section > div'); // Grab the first section
  sectionEl.classList.add('media-asset-info');
  const headerEl = sectionEl.querySelector('h1');
  const title = headerEl.textContent;
  const fileLinkEl = sectionEl.querySelector('a');
  if (fileLinkEl) { fileLinkEl.remove(); }
  const imageEl = sectionEl.querySelector('img');
  const href = (fileLinkEl) ? fileLinkEl.href : imageEl.src.split('?')[0];
  const ext = href.split('.').pop();
  const actionsEl = createEl('div', {
    class: 'actions',
  }, headerEl, sectionEl);
  actionsEl.append(createEl('a', {
    href,
    download: `${title.replace(/[^a-z0-9]/gi, '_')}.${ext}`,
    class: 'download button',
  }, 'Download File'));
  actionsEl.append(createEl('a', {
    href: '/media-assets',
    class: 'return button',
  }, 'Back to All Assets'));
}
