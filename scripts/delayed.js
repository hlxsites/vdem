// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { createEl } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const agencyBar = createEl('script', {
  src: 'https://www.developer.virginia.gov/media/developer/resources/branding-bar/brandingbar.php',
  'data-item': 'va_aabrandingbar',
  aaname: 'Virginia Department of Emergency Management',
  aatheme: 'aatheme-black',
  'aaPlacement-id': 'agency-bar',
  defer: true,
}, '', document.head);
