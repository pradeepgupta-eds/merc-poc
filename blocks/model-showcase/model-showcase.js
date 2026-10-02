function classify(row) {
  const cells = [...row.children];
  if (!cells.length) return 'other';
  const hasPicture = cells.some((c) => c.querySelector('picture, img'));
  const hasHeading = cells.some((c) => c.querySelector('h1, h2, h3, h4, h5, h6'));
  const hasLink = cells.some((c) => c.querySelector('a'));
  if (hasPicture) {
    const textCell = cells.find((c) => !c.querySelector('picture, img') && c.textContent.trim());
    if (!textCell) return 'other';
    const extras = textCell.querySelectorAll('p, a, ul, ol');
    return extras.length ? 'vehicle' : 'category';
  }
  if (hasLink && !hasHeading) return 'actions';
  if (hasHeading && hasLink && cells.length > 1) return 'banner';
  if (hasHeading && cells.length === 1 && !hasLink) return 'intro';
  return 'other';
}

function decorateVehicle(row) {
  const cells = [...row.children];
  cells.forEach((cell) => {
    if (cell.querySelector('picture, img')) {
      cell.classList.add('model-showcase-image');
      return;
    }
    cell.classList.add('model-showcase-body');
    const features = document.createElement('div');
    features.className = 'model-showcase-features';
    let plainIndex = 0;
    [...cell.querySelectorAll(':scope > p')].forEach((p) => {
      if (p.querySelector('a')) {
        p.classList.add('model-showcase-cta');
        return;
      }
      plainIndex += 1;
      if (plainIndex === 1) p.classList.add('model-showcase-spec');
      else if (plainIndex === 2) p.classList.add('model-showcase-pincode');
      else {
        p.classList.add('model-showcase-feature');
        features.append(p);
      }
    });
    if (features.children.length) {
      const cta = cell.querySelector(':scope > .model-showcase-cta');
      if (cta) cell.insertBefore(features, cta);
      else cell.append(features);
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  let categories = null;
  let vehicles = null;

  rows.forEach((row) => {
    const type = classify(row);
    row.classList.add('model-showcase-row', `model-showcase-${type}`);
    [...row.children].forEach((cell) => cell.classList.add('model-showcase-cell'));

    if (type === 'category') {
      if (!categories) {
        categories = document.createElement('div');
        categories.className = 'model-showcase-categories';
        row.before(categories);
      }
      categories.append(row);
    } else if (type === 'vehicle') {
      decorateVehicle(row);
      if (!vehicles) {
        vehicles = document.createElement('div');
        vehicles.className = 'model-showcase-vehicles';
        row.before(vehicles);
      }
      vehicles.append(row);
    }
  });
}
