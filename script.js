// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile nav ───
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active');
}
function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('active');
}

// ─── Scroll reveal ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── Smooth scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Active nav link on scroll (scroll spy) ───
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveNav() {
  const scrollY = window.scrollY + 120; // offset for fixed navbar

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });

  // Remove active state when at very top (hero section)
  if (window.scrollY < 200) {
    navItems.forEach(link => link.classList.remove('active'));
  }
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

// ─── Animated counter for hero metrics ───
function animateCounters() {
  const metrics = document.querySelectorAll('.metric-value');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const text = entry.target.textContent.trim();
        
        // Parse the number and suffix (e.g., "60K+" → 60, "K+")
        const match = text.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        
        const target = parseFloat(match[1]);
        const suffix = match[2]; // e.g., "K+", "+", "%+"
        const isDecimal = text.includes('.');
        const duration = 1500; // ms
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease-out curve for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          
          if (isDecimal) {
            entry.target.textContent = current.toFixed(1) + suffix;
          } else {
            entry.target.textContent = Math.floor(current) + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent = text; // ensure exact final value
            entry.target.classList.add('counted');
          }
        }
        
        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.5 });
  
  metrics.forEach(el => counterObserver.observe(el));
}

animateCounters();
