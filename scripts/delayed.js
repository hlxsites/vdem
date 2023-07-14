// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { createEl } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
createEl('script', {
  src: 'https://www.developer.virginia.gov/media/developer/resources/branding-bar/brandingbar.php',
  'data-item': 'va_aabrandingbar',
  aaname: 'Virginia Department of Emergency Management',
  aatheme: 'aatheme-black',
  'aaPlacement-id': 'agency-bar',
  defer: true,
}, '', document.head);

/* AddSearch */
createEl('link', {
  src: 'https://app.addsearch.com/www/script/v3/1.css?r=0.3323738006632768',
  rel: 'stylesheet',
  type: 'text/css',
}, '', document.head);

createEl('script', {
  src: 'https://addsearch.com/js/?key=3400504effd6c6f22610d3814c93b312',
  type: 'text/javascript',
  id: 'addsearch-settings-js-js',
}, '', document.head);

createEl('script', {
  src: 'https://addsearch.com/searchui/v3/?key=3400504effd6c6f22610d3814c93b312&i=',
  type: 'text/javascript',
  async: true,
}, '', document.head);

/* Google */
createEl('script', {
  src: 'https://www.google-analytics.com/analytics.js',
  type: 'text/javascript',
  async: true,
}, '', document.head);

createEl('script', {
  src: 'https://www.googletagmanager.com/gtag/js?id=G-N8KZTN12K6&l=beehiveDataLayer&cx=c',
  type: 'text/javascript',
  async: true,
}, '', document.head);

createEl('script', {
  src: 'https://www.googletagmanager.com/gtag/js?id=UA-115750224-1&l=beehiveDataLayer',
  type: 'text/javascript',
  async: true,
}, '', document.head);

/* Meta */
createEl('script', {
  src: 'https://connect.facebook.net/signals/config/1404641949861336?v=2.9.111&r=stable',
  type: 'text/javascript',
  async: true,
}, '', document.head);

createEl('script', {
  src: 'https://connect.facebook.net/en_US/fbevents.js',
  type: 'text/javascript',
  async: true,
}, '', document.head);

createEl('script', {}, `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1404641949861336');
  fbq('track', 'PageView');
`, document.head);
