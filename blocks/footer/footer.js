import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = ['facebook', 'twitter', 'x.com', 'youtube', 'instagram', 'linkedin'];

function socialName(a) {
  try {
    const host = new URL(a.href).hostname;
    return SOCIAL.find((s) => host.includes(s)) || '';
  } catch (e) {
    return '';
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (!fragment) {
    block.append(footer);
    return;
  }

  const columns = [];
  let legalList = null;
  let socialList = null;
  fragment.querySelectorAll('ul').forEach((ul) => {
    const prev = ul.previousElementSibling;
    const links = [...ul.querySelectorAll(':scope > li > a')];
    if (prev && /^H[1-6]$/.test(prev.tagName)) {
      columns.push({ heading: prev, list: ul });
    } else if (links.length && links.every((a) => socialName(a))) {
      socialList = ul;
    } else if (!legalList) {
      legalList = ul;
    }
  });

  // back to top
  const up = document.createElement('button');
  up.type = 'button';
  up.className = 'footer-up';
  up.innerHTML = '<span class="footer-up-icon" aria-hidden="true"></span><span class="footer-up-label">Up</span>';
  up.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const target = document.querySelector('header a, header button, main');
    if (target) {
      if (!target.hasAttribute('tabindex') && !/^(A|BUTTON)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  const upWrap = document.createElement('div');
  upWrap.className = 'footer-upper';
  upWrap.append(up);
  footer.append(upWrap);

  if (columns.length) {
    const sitemap = document.createElement('div');
    sitemap.className = 'footer-sitemap';
    columns.forEach(({ heading, list }) => {
      const col = document.createElement('div');
      col.className = 'footer-column';
      col.append(heading, list);
      sitemap.append(col);
    });
    footer.append(sitemap);
  }

  const lower = document.createElement('div');
  lower.className = 'footer-lower';
  if (legalList) {
    legalList.classList.add('footer-legal');
    lower.append(legalList);
  }
  if (socialList) {
    socialList.classList.add('footer-social');
    socialList.querySelectorAll('a').forEach((a) => {
      const label = a.textContent.trim();
      a.setAttribute('aria-label', label);
      a.dataset.network = socialName(a) === 'twitter' ? 'x' : socialName(a);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = '';
    });
    lower.append(socialList);
  }
  footer.append(lower);

  block.append(footer);
}
