import { createEl } from '../../scripts/scripts.js';

export default function decorate(blockEl) {
  const contentEls = blockEl.querySelectorAll('h1 ~ *');
  createEl('div', {
    class: 'hero-cta',
  }, contentEls, blockEl);
}
