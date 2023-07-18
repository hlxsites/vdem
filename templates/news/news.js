import {
  createEl, getIndex,
} from '../../scripts/scripts.js';

function getTime(update) {
  let { publishtime } = update;
  if (!publishtime) {
    publishtime = update.lastModified;
  }
  return publishtime ? new Date(publishtime).getTime() : new Date().getTime();
}

export default async function decorate(doc) {
  const mainEl = doc.querySelector('main');
  const updatesListEl = createEl('div', {
    class: 'news-list',
  }, '', mainEl);
  const indexObj = await getIndex('/updates/query-index.json');
  const allUpdates = indexObj.getEntries();
  allUpdates.sort((update1, update2) => getTime(update2) - getTime(update1));
  allUpdates.forEach((update) => {
    const { title } = update;
    const publishtime = getTime(update);
    const { path } = update;
    createEl('div', {
      class: 'news-item',
    }, `
      <h1>${title}</h1>
      <span class="publish-time">${new Date(publishtime)}</span>
      <a href="${path}" class="button primary">Read More</a>
    `, updatesListEl);
  });
}
