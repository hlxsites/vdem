import {
  createEl,
} from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const sectionEl = document.querySelector('.section > div'); // Grab the first section
  sectionEl.classList.add('file-attachment');
  const headerEl = sectionEl.querySelector('h1');
  const title = headerEl.textContent;
  const downloadButtonEl = sectionEl.querySelector('a');
  downloadButtonEl.classList.add('download', 'button');
  downloadButtonEl.setAttribute('title', title);
}
