export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'carousel-header';
  const track = document.createElement('ul');
  track.className = 'carousel-track';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hasPicture = !!row.querySelector('picture, img');
    if (cells.length <= 1 && !hasPicture) {
      // title / intro row: keep content in place
      cells.forEach((cell) => header.append(...cell.childNodes));
      if (!cells.length && row.childNodes.length) header.append(...row.childNodes);
      return;
    }
    const li = document.createElement('li');
    li.className = 'carousel-slide';
    cells.forEach((cell) => {
      if (cell.querySelector('picture, img') && !cell.querySelector('h1, h2, h3, h4, h5, h6, p')) {
        cell.className = 'carousel-slide-image';
      } else {
        cell.className = 'carousel-slide-body';
      }
      li.append(cell);
    });
    track.append(li);
  });

  const slides = [...track.children];
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  const goTo = (index) => {
    const slide = slides[index];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  const current = () => {
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    });
    return best;
  };

  const dotButtons = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.append(dot);
    return dot;
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.addEventListener('click', () => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    goTo(atEnd ? 0 : Math.min(current() + 1, slides.length - 1));
  });

  const update = () => {
    const idx = current();
    dotButtons.forEach((dot, i) => {
      if (i === idx) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    next.hidden = atEnd || slides.length < 2;
  };
  track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  viewport.append(track, next);

  if (slides.length > 1) nav.append(dots);

  const parts = [];
  if (header.childNodes.length) parts.push(header);
  parts.push(viewport);
  if (slides.length > 1) parts.push(nav);
  block.replaceChildren(...parts);
  update();
}
