export default function decorate(blockEl) {
  const itemEls = blockEl.querySelectorAll(':scope > div');
  itemEls.forEach((itemEl) => {
    const imageEl = itemEl.querySelector('img');
    if (imageEl) {
      itemEl.classList.add('with-image');
      itemEl.style.backgroundImage = `url(${imageEl.src})`;
      imageEl.remove();
    }
  });
}
