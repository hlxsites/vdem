import {
  createEl,
} from '../../scripts/scripts.js';

function buildGrouping(titleEl) {
  const groupingEl = createEl('div', {
    belongsTo: titleEl.id,
    class: 'grouping',
  }, '');
  while (true) {
    const pEl = titleEl.nextElementSibling;
    if (pEl && (pEl.tagName === 'P' || pEl.tagName === 'UL' || pEl.tagName === 'IMG')) {
      groupingEl.append(pEl);
    } else {
      break;
    }
  }
  return groupingEl;
}

export default function decorate(block) {
  const titleEls = block.querySelectorAll(':is(h1, h2, h3, h4)');
  titleEls.forEach((titleEl) => {
    const groupingEl = buildGrouping(titleEl);
    titleEl.after(groupingEl);
    titleEl.setAttribute('tabindex', 0);
    titleEl.addEventListener('click', () => {
      if (groupingEl.classList.contains('showing')) {
        groupingEl.classList.remove('showing');
        titleEl.classList.remove('showing');
      } else {
        groupingEl.classList.add('showing');
        titleEl.classList.add('showing');
      }
    });
  });
}
