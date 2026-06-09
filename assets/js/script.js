const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const faqBoxes = document.querySelectorAll('.faq-box');
const themeToggle = document.getElementById('theme-toggle');
const pageLoader = document.getElementById('page-loader');
const pageTransition = document.getElementById('page-transition');
const header = document.querySelector('header');
const animatedSections = document.querySelectorAll('main > section');

const savedTheme = localStorage.getItem('theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const activeTheme = savedTheme || preferredTheme;
document.documentElement.dataset.theme = activeTheme;
if (themeToggle) {
  themeToggle.textContent = activeTheme === 'dark' ? '\u263e' : '\u2600';
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '\u263e' : '\u2600';
  });
}

const toggleMenu = () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
};

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

window.addEventListener('click', event => {
  if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  }
});

const isInternalLink = href => href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#');

document.querySelectorAll('a[href]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || !isInternalLink(href) || anchor.target === '_blank') return;
    event.preventDefault();
    pageTransition.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });
});

const initCounters = section => {
  section.querySelectorAll('.counter').forEach(counter => {
    if (counter.dataset.animated) return;
    counter.dataset.animated = 'true';
    const target = Number(counter.dataset.target) || 0;
    const duration = 1400;
    const startTime = performance.now();

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent = Math.round(target * progress);
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        counter.textContent = target;
      }
    };

    window.requestAnimationFrame(tick);
  });
};

const initProgressBars = section => {
  section.querySelectorAll('.progress-bar span').forEach(bar => {
    if (bar.dataset.filled) return;
    bar.dataset.filled = 'true';
    const width = Number(bar.dataset.progress) || 80;
    bar.style.width = `${width}%`;
  });
};

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      initCounters(entry.target);
      initProgressBars(entry.target);
    });
  },
  { threshold: 0.2 }
);

animatedSections.forEach(section => revealObserver.observe(section));

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 32);
  document.documentElement.style.setProperty('--hero-offset', `${window.scrollY * 0.05}px`);
});

window.addEventListener('load', () => {
  if (pageLoader) {
    pageLoader.style.opacity = '0';
    pageLoader.style.visibility = 'hidden';
    document.body.classList.remove('page-loading');
    setTimeout(() => pageLoader.remove(), 700);
  }
});

faqBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const isActive = box.classList.contains('active');
    faqBoxes.forEach(other => other.classList.remove('active'));
    if (!isActive) {
      box.classList.add('active');
    }
  });
});
