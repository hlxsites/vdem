/* eslint-disable no-labels */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import {
  createEl,
} from '../../scripts/scripts.js';
import {
  loadCSS,
  loadScript,
  getMetadata,
} from '../../scripts/lib-franklin.js';

let searchStartDate;
let searchEndDate;
let allDates;
let feedObj;
let eventsObj;
let catsArr;
let keywordsArr;
let DateTime;

const parser = new DOMParser();

const HEADER_DATE_FORMAT = 'EEE, MMM d, y';
const EVENT_DATE_FORMAT = 'MMM d';
const TIME24_FORMAT = 'HH:mm';

function parseDate(date) {
  return date.split('-');
}

function updateDate(datesObj) {
  allDates = datesObj;
  // eslint-disable-next-line prefer-destructuring, no-multi-assign
  searchStartDate = searchEndDate = datesObj[0];
  document.querySelector('#start-date').value = searchStartDate;

  if (datesObj.length > 1) {
    searchEndDate = datesObj[datesObj.length - 1];
    document.querySelector('#end-date').value = searchEndDate;
    document.querySelector('#end-date').style.display = 'block';
    document.querySelector('#end-date-label').style.display = 'block';
  } else {
    document.querySelector('#end-date').style.display = 'none';
    document.querySelector('#end-date-label').style.display = 'none';
  }
}

function findEvents(props) {
  const foundEventsObj = {};
  for (const i in props.allDates) {
    const currentDate = props.allDates[i];
    const dateArr = parseDate(currentDate);
    const yearObj = eventsObj[dateArr[0]];
    if (yearObj) {
      const monthObj = yearObj[dateArr[1]];
      if (monthObj) {
        const dayObj = monthObj[dateArr[2]];
        if (dayObj) {
          daySearch: for (const currentEventObj in dayObj) {
            const eventObj = dayObj[currentEventObj];
            if (props.keyword && (!eventObj.keywords || (eventObj.keywords
              && !eventObj.keywords.includes(props.keyword)))) {
              continue;
            }
            if (props.category && (!eventObj.categories || (eventObj.categories
              && !eventObj.categories.includes(props.category)))) {
              continue;
            }
            if (!foundEventsObj[currentDate]) {
              foundEventsObj[currentDate] = [];
            }
            if (props.searchTerms) {
              for (const t in props.searchTerms) {
                const term = props.searchTerms[t].toLowerCase();
                if (!eventObj.title.toLowerCase().includes(term)) {
                  continue daySearch;
                }
              }
            }
            foundEventsObj[currentDate].push(eventObj);
          }
        }
      }
    }
  }
  return foundEventsObj;
}

await loadScript('/scripts/add-to-cal.js', {}, () => {
});

function displayEvents(resultsObj) {
  const startDateFormatted = DateTime.fromISO(searchStartDate).toFormat(HEADER_DATE_FORMAT);
  const endDateFormatted = DateTime.fromISO(searchEndDate).toFormat(HEADER_DATE_FORMAT);
  document.querySelector('#event-range').innerText = (startDateFormatted !== endDateFormatted)
    ? `${startDateFormatted} - ${endDateFormatted}` : startDateFormatted;
  const eventListEl = document.querySelector('#event-list');
  eventListEl.innerHTML = '';
  for (const i in resultsObj) {
    for (const j in resultsObj[i]) {
      const eventObj = resultsObj[i][j];
      const {
        title,
        startDate,
        endDate,
        startTime,
        startTime24,
        endTime,
        endTime24,
        description,
        locationInformation,
        contact,
        keywords,
        category,
        type,
        attachments,
      } = eventObj;
      const locationInformationTruncated = (locationInformation) ? `${locationInformation.replace(/(<([^>]+)>)/ig, '').substring(0, 50)}...` : '';
      const startDateDisplay = DateTime.fromISO(startDate).toFormat(EVENT_DATE_FORMAT);
      const endDateDisplay = (endDate && (endDate !== startDate)) ? DateTime.fromISO(endDate).toFormat(EVENT_DATE_FORMAT) : '';
      const endTime24Formatted = (startTime24 && !endTime24)
        ? DateTime.fromISO(startTime24).plus({ hours: 1 }).toFormat(TIME24_FORMAT) : endTime24;
      const eventEl = createEl('div', {
        class: 'event-list-item',
      }, `
      <div class="event-list-item-date-range">
        <span>${startDateDisplay}</span>
        <span>${startTime || ''}</span>
        <span>${endDateDisplay || ''}</span>
        <span>${endTime || ''}</span>
      </div>
      <div class="event-item-basics">
        <h3 class="event-list-item-title">
          ${title}
        </h3>
        <h4>${category || ''}</h4>
        <h4>${locationInformationTruncated}</h4>
      </div>
      <div class="event-item-cal">
        <h4>${type || ''}</h4>
        <add-to-calendar-button
            name="${title}"
            options="'Apple','Google', 'Microsoft365'"
            startDate="${startDate}"
            endDate="${endDate || ''}"
            startTime="${startTime24 || ''}"
            endTime="${endTime24 || endTime24Formatted || ''}"
            timeZone="America/New_York"
            hideBranding="true"
          />
        </div>
    `, eventListEl);
      const dialogEl = createEl('dialog', {
        class: 'event-info-dialog',
      }, `
      <div class="event-info-dialog-content">
        <div class="dialog-header">
          <button class="dialog-close-button button">Close</button>
        </div>
        <h1 class="event-title">${title}</h1>
        <h2>Event Details</h2>
        <div class="event-desc">${description || ''}</div>
        <h2>Location</h2>
        <div class="event-desc">${locationInformation || ''}</div>
        <h2>Contact</h2>
        <div class="event-desc">${contact || ''}</div>
        <h2>Attachments</h2>
        <div class="event-atts"></div>
      </div>
    `, document.querySelector('#calendar-container'));
      const eventAttsEl = dialogEl.querySelector('.event-atts');
      for (const k in attachments) {
        const attachmentPath = attachments[k];
        const filename = attachmentPath.substring(attachmentPath.lastIndexOf('/') + 1);
        createEl('a', {
          download: filename,
          href: attachmentPath,
        }, filename, eventAttsEl);
        createEl('br', {}, '', eventAttsEl);
      }
      dialogEl.querySelector('button').addEventListener('click', () => {
        dialogEl.close();
      });
      dialogEl.addEventListener('click', (event) => {
        if (!event.target.closest('.event-info-dialog-content')) {
          dialogEl.close();
        }
      });

      eventEl.addEventListener('click', () => {
        dialogEl.showModal();
      });
    }
  }
}

export default async function decorate(doc) {
  const assetHost = getMetadata('assethost');
  const feedURL = getMetadata('feedurl');
  const response = await fetch(assetHost + feedURL);
  feedObj = await response.json();
  eventsObj = feedObj.events;
  catsArr = feedObj.categories;
  keywordsArr = feedObj.keywords;

  loadCSS('/styles/calendar.css');

  await loadScript('/scripts/luxon.js', {}, () => {
    // eslint-disable-next-line no-undef
    DateTime = luxon.DateTime;
  });

  const mainEl = doc.querySelector('main');
  createEl('div', {
    id: 'calendar-container',
  }, `<div id="left-col">
        <div id="calendar"></div>
        <div id="search-form">
          <label>Start Date
            <input id="start-date" readonly/>
          </label>  
          <label id="end-date-label">End Date
            <input id="end-date" readonly/>
          </label>  
          <label>Category
            <select id="category">
              <option value="">---</option>
            </select>
          </label>
          <label>Keyword
            <select id="keyword">
              <option value="">---</option>
            </select>
          </label>
          <label id="search-terms-label">Text Search
            <input id="search-terms"/>
          </label>  
          <button id="search-button" class="button">Search</button>
        </div>
      </div>
      <div id="right-col">
        <div id="event-results">
          <h2 id="event-range" class="header"></h2>
          <div id="event-list" class="results"></div>
        </div>
      </div>`, mainEl);

  await loadScript('/scripts/calendar.js', {}, () => {
    const today = new Date().toISOString().substring(0, 10);
    const urlParams = new URLSearchParams(window.location.search);
    const startDateParam = urlParams.get('startdate');
    const endDateParam = urlParams.get('enddate');
    let initDates;
    if (startDateParam) {
      initDates = startDateParam;
      if (endDateParam) {
        initDates = `${startDateParam}:${endDateParam}`;
      }
    } else {
      initDates = today;
    }
    // eslint-disable-next-line no-undef
    const calendar = new VanillaCalendar('#calendar', {
      settings: {
        range: {
          disablePast: true,
        },
        selection: {
          day: 'multiple-ranged',
        },
        visibility: {
          daysOutside: false,
        },
        selected: {
          //dates: [initDates],
          dates: [`${today}:2024-12-31`],
        },
      },
      actions: {
        clickDay(e, self) {
          updateDate(self.selectedDates);
        },
      },
    });
    calendar.init();

    updateDate(calendar.selectedDates);
    displayEvents(findEvents({ allDates }));

    const categoryEl = document.querySelector('#category');
    for (const i in catsArr) {
      createEl('option', {}, catsArr[i], categoryEl);
    }

    const keywordEl = document.querySelector('#keyword');
    for (const i in keywordsArr) {
      createEl('option', {}, keywordsArr[i], keywordEl);
    }

    const searchTermsEl = document.querySelector('#search-terms');
    for (const i in keywordsArr) {
      createEl('option', {}, keywordsArr[i], keywordEl);
    }

    document.querySelector('#search-button').addEventListener('click', () => {
      const category = categoryEl.value;
      const keyword = keywordEl.value;
      const searchTerms = (searchTermsEl.value) ? searchTermsEl.value.split(' ') : '';
      const resultsObj = findEvents({
        allDates,
        category,
        keyword,
        searchTerms,
      });
      displayEvents(resultsObj);
    });
  });
  findEvents({ allDates });
}
