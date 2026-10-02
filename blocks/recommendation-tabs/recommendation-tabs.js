function isLinkOnlyRow(row) {
  if (row.querySelector('picture, img, h1, h2, h3, h4, h5, h6')) return false;
  const links = [...row.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  const rowText = row.textContent.replace(/\s+/g, '');
  return linkText === rowText;
}

function setActive(tabs, active) {
  tabs.forEach((tab) => {
    if (tab === active) {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'true');
    } else {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  let cards = null;
  let tabsFound = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('picture, img')) {
      if (!cards) {
        cards = document.createElement('div');
        cards.className = 'recommendation-tabs-cards';
        row.before(cards);
      }
      row.classList.add('recommendation-tabs-card');
      cells.forEach((cell) => {
        if (cell.querySelector('picture, img')) cell.classList.add('recommendation-tabs-card-image');
        else cell.classList.add('recommendation-tabs-card-body');
      });
      cards.append(row);
    } else if (!tabsFound && isLinkOnlyRow(row)) {
      tabsFound = true;
      row.classList.add('recommendation-tabs-tabs');
      const links = [...row.querySelectorAll('a')];
      links.forEach((link) => link.classList.add('recommendation-tabs-tab'));
      setActive(links, links[0]);
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          setActive(links, link);
        });
      });
    } else if (row.querySelector('h1, h2, h3, h4, h5, h6')) {
      row.classList.add('recommendation-tabs-title');
    } else {
      row.classList.add('recommendation-tabs-extra');
    }
  });
}
