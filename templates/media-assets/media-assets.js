import {
  createEl,
  getIndex,
} from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const mainEl = doc.querySelector('main');
  const indexObj = await getIndex();
  const mediaAssets = indexObj.getEntries('/media-assets');
  const mediaListEl = createEl('div', {
    class: 'media-list',
  }, '', mainEl);
  mediaAssets.forEach((mediaAsset) => {
    let imageURL = mediaAsset.image;
    console.log(imageURL)
    if (!imageURL.includes('.') || imageURL.includes('default-meta-image')) {
      imageURL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    }
    createEl('div', {
      class: 'media-asset',
    }, `
      <div class="preview">  
        <img src="${imageURL}"/>
        <h2>${mediaAsset.title}</h2>
      </div>
      <a href="${mediaAsset.path}" class="primary button">
        Download
      </a>
    `, mediaListEl);
  });
}
