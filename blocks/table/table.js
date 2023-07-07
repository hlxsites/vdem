/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

import {
  createEl,
} from '../../scripts/scripts.js';

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(blockEl) {
  const tableEl = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  tableEl.append(thead, tbody);
  let colspan = 1;
  [...blockEl.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (i) tbody.append(row);
    else thead.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(i);
      if (colspan < i) {
        colspan = i + 1;
      }
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  blockEl.innerHTML = '';
  blockEl.append(tableEl);

  if (blockEl.classList.contains('searchable')) {
    const searchRowEl = document.createElement('tr');
    const searchCellEl = createEl('th', {
      colspan,
    }, '', searchRowEl);
    const inputEl = createEl('input', {
      type: 'text',
      placeholder: 'Search',
    }, '', searchCellEl);
    inputEl.addEventListener('keyup', () => {
      const filter = inputEl.value.toUpperCase();
      const rowEls = tableEl.querySelectorAll('tbody > tr');
      rowEls.forEach((rowEl) => {
        const cellEl = rowEl.querySelector('td');
        if (cellEl) {
          const txtValue = cellEl.textContent || cellEl.innerText;
          if (txtValue.toUpperCase().includes(filter)) {
            rowEl.style.display = 'table-row';
          } else {
            rowEl.style.display = 'none';
          }
        }
      });
    });
    thead.prepend(searchRowEl);
  }
}
