// --- DOM Element Selectors ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const faqBoxes = document.querySelectorAll('.faq-box');
const themeToggle = document.getElementById('theme-toggle');
const pageLoader = document.getElementById('page-loader');
const pageTransition = document.getElementById('page-transition');
const header = document.querySelector('header');
const animatedSections = document.querySelectorAll('main > section');

// --- Theme Management (Dark/Light Mode) ---
// Check for saved user preference in local storage, otherwise use system preference
const savedTheme = localStorage.getItem('theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const activeTheme = savedTheme || preferredTheme;

// Apply the theme on initial load
document.documentElement.dataset.theme = activeTheme;
if (themeToggle) {
  // Set the correct icon (Moon for dark, Sun for light)
  themeToggle.textContent = activeTheme === 'dark' ? '\u263e' : '\u2600';
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '\u263e' : '\u2600';
  });
}

// --- Mobile Menu Logic ---
const toggleMenu = () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
};

// Open/Close menu when clicking the hamburger icon
if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

// Close menu when clicking anywhere outside of the navigation
window.addEventListener('click', event => {
  if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  }
});

// --- Page Transition Overlay ---
// Helper function to determine if a link points to a page on the same domain
const isInternalLink = href => href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#');

document.querySelectorAll('a[href]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    // Only apply transition to internal links that don't open in a new tab
    if (!href || !isInternalLink(href) || anchor.target === '_blank') return;
    
    event.preventDefault();
    pageTransition.classList.add('active');
    // Delay the actual navigation to allow the fade-out animation to play
    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });
});

// --- Statistic Counters Animation ---
// Animates numbers from 0 to the value specified in the 'data-target' attribute
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

// --- Progress Bar Animation ---
// Triggers the fill animation for bars based on the 'data-progress' attribute
const initProgressBars = section => {
  section.querySelectorAll('.progress-bar span').forEach(bar => {
    if (bar.dataset.filled) return;
    bar.dataset.filled = 'true';
    const width = Number(bar.dataset.progress) || 80;
    bar.style.width = `${width}%`;
  });
};

// --- Scroll Reveal System (Intersection Observer) ---
// Detects when a section enters the viewport to trigger entrance animations
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

// Start observing all main sections
animatedSections.forEach(section => revealObserver.observe(section));

// --- Scroll Events ---
window.addEventListener('scroll', () => {
  if (!header) return;
  // Add a background to the header once the user scrolls down slightly
  header.classList.toggle('scrolled', window.scrollY > 32);
  
  // Parallax Effect: Update a CSS variable used for floating hero elements
  document.documentElement.style.setProperty('--hero-offset', `${window.scrollY * 0.05}px`);
});

// --- Page Initialized ---
window.addEventListener('load', () => {
  // Hide and remove the pre-loader once everything (images, scripts) is ready
  if (pageLoader) {
    pageLoader.style.opacity = '0';
    pageLoader.style.visibility = 'hidden';
    document.body.classList.remove('page-loading');
    setTimeout(() => pageLoader.remove(), 700);
  }
});

// --- FAQ Accordion Logic ---
// Allows only one FAQ item to be expanded at a time
faqBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const isActive = box.classList.contains('active');
    faqBoxes.forEach(other => other.classList.remove('active'));
    if (!isActive) {
      box.classList.add('active');
    }
  });
});
