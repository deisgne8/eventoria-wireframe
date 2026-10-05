const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
document.querySelectorAll('.section-index').forEach(label => {
  label.textContent = label.textContent.replace(/^\s*\d+\s*\/\s*/,'');
});
document.querySelectorAll('.placeholder-image, .project-request-panel').forEach((imageSlot, index) => {
  imageSlot.setAttribute('role', 'img');
  imageSlot.setAttribute('aria-label', imageSlot.getAttribute('aria-label') || `Project image ${index + 1}`);
  imageSlot.querySelectorAll('span, b').forEach(label => label.remove());
});
document.querySelectorAll('.footer-bottom').forEach(footer => {
  const removeVersionLabel = node => {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent = child.textContent.replace(/\s*Wireframe\s*\/\s*v1\.0\s*/gi, '');
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        removeVersionLabel(child);
      }
    });
  };
  removeVersionLabel(footer);
  footer.querySelectorAll('span').forEach(span => {
    if (!span.textContent.trim()) span.remove();
  });
});
const proofTitle = document.querySelector('.proof h2');
if (proofTitle) proofTitle.innerHTML = 'From the first<br><span>brief to the final show.</span>';
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
  const linkPage = link.getAttribute('href')?.split('#')[0];
  if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '')) {
    link.setAttribute('aria-current', 'page');
    link.classList.add('is-current');
  }
});
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.classList.toggle('is-open', !open);
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
}));

const services = {
  story: { number: '01', title: 'Give the moment a reason.', copy: 'We begin with the story, the place and the audience, then shape a creative direction that answers what the occasion needs to say.', items: ['Creative strategy & storytelling', 'Audience and occasion insight', 'Story architecture and show narrative'] },
  design: { number: '02', title: 'Make the idea tangible.', copy: 'We translate the story into the experience: spatial, scenic and sculptural design with a clear role in the whole.', items: ['Experience, spatial & scenic design', 'Art sculpture design and build', 'Visual language and guest journey'] },
  show: { number: '03', title: 'Bring the story to life.', copy: 'The show is where the idea moves. We cast, choreograph, rehearse and direct the human and cultural details that make it live.', items: ['Show content, entertainment & costume', 'Artist, cast & performer management', 'Choreography, rehearsals & show direction'] },
  delivery: { number: '04', title: 'Carry it through.', copy: 'Production and live operations turn a strong idea into a reliable night, with event operations, protocol and live delivery held in one view.', items: ['Production and live shows', 'Event operations and protocol', 'On-site delivery and show calling'] }
};
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
  const service = services[tab.dataset.service];
  document.querySelector('#service-panel').innerHTML = `<div class="service-number">${service.number}</div><div><h3>${service.title}</h3><p>${service.copy}</p><ul class="service-list">${service.items.map(item => `<li>${item}</li>`).join('')}</ul></div><div class="service-image placeholder-image"><span>Service image<br>placeholder</span><b>4:3</b></div>`;
}));

document.querySelector('#enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Thanks — your brief is on its way. We’ll be in touch within two working days.';
  event.currentTarget.reset();
});

// GSAP is loaded progressively so the static pages remain usable without JavaScript.
const loadGsap = () => new Promise(resolve => {
  const load = (src, done) => { const script = document.createElement('script'); script.src = src; script.onload = done; script.onerror = () => resolve(null); document.head.appendChild(script); };
  if (window.gsap) return load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', () => resolve(window.gsap));
  load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', () => load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', () => resolve(window.gsap)));
});

loadGsap().then(gsap => {
  if (!gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  gsap.from('.site-header', { y: -24, opacity: 0, duration: .7, ease: 'power2.out' });
  gsap.from('.hero-copy > *', { y: 24, opacity: 0, duration: .8, stagger: .08, delay: .15, ease: 'power2.out' });
  gsap.from('.hero-board', { x: 32, opacity: 0, duration: 1, delay: .25, ease: 'power2.out' });
  document.querySelectorAll('.section-pad').forEach(section => {
    gsap.from(section.querySelectorAll('.section-index, h2, h3, .body-copy, .project-card, .process-list article, .expertise-grid article'), {
      y: 22, opacity: 0, duration: .65, stagger: .05, ease: 'power2.out', immediateRender: false,
      scrollTrigger: { trigger: section, start: 'top 84%', once: true }
    });
  });
});
