import {
  createEl,
  getIndex,
} from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const mainEl = doc.querySelector('main');
  const indexObj = await getIndex('/preparedness-events/query-index.json');
  const allEvents = indexObj.getEntries();
  const calendar = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  const eventListEl = createEl('div', {
    class: 'event-list',
  }, '', mainEl);
  calendar.forEach((month) => {
    const monthEl = createEl('div', {
      class: 'month',
    }, `
      <h2>${month}</h2>
    `, eventListEl);
    const eventsEl = createEl('div', {
      class: 'events',
    }, '', monthEl);
    const events = allEvents.filter((evnt) => evnt.month.toLowerCase() === month);
    events.forEach((evnt) => {
      createEl('a', {
        href: evnt.path,
      }, `
        <h3>${evnt.title}</h3>
      `, eventsEl);
    });
  });


  // events.forEach((event) => {
  //   createEl('div', {
  //     class: 'event',
  //   }, `
  //     <div class="preview">  
  //       <h2>${event.title}</h2>
  //     </div>
  //     <a href="${event.path}" class="primary button">
  //       Download
  //     </a>
  //   `, eventListEl);
  // });
}
