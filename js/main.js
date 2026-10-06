/**
 * VERTEX AGENCY - INTERACTIVE SCRIPTS
 * Modules: Centralized Projects Rendering, Navigation, Smooth Scroll, Stats Counter,
 * Project Lightbox Modal, Form Validation & Toast Notification
 */

import { projects } from '../data/projects.js';

document.addEventListener('DOMContentLoaded', () => {
  initProjects();
  initNavigation();
  initStatsCounter();
  initProjectModal();
  initContactForm();
  initScrollEffects();
});

/* ==========================================================================
   SECURITY HELPERS (ANTI-XSS & URL SANITIZATION)
   ========================================================================== */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"'/]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      case '/': return '&#47;';
      default: return char;
    }
  });
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('assets/')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return '#';
  }
  return '#';
}

function setSafeHTML(element, htmlString) {
  if (!element || typeof htmlString !== 'string') return;
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(htmlString, 'text/html');
  parsedDoc.querySelectorAll('script, iframe, object, embed').forEach((el) => el.remove());
  element.replaceChildren(...parsedDoc.body.childNodes);
}

/* ==========================================================================
   DYNAMIC PROJECTS RENDERING (CENTRALIZED DATA)
   ========================================================================== */
function initProjects() {
  const landingGrid = document.getElementById('portfolioGrid');
  if (landingGrid) {
    // Landing page: afficher uniquement les 4 premiers projets (ou 4 plus récents)
    renderProjectCards(landingGrid, projects.slice(0, 4));
  }

  const allGrid = document.getElementById('portfolioAllGrid');
  if (allGrid) {
    // Page Portfolio: afficher TOUS les projets de la base de données
    renderProjectCards(allGrid, projects);
  }
}

function renderProjectCards(container, list) {
  if (!container || !list || !list.length) return;
  const cardsHtml = list.map(project => {
    const title = escapeHTML(project.title || project.name || project.nom || "Projet");
    const sector = escapeHTML(project.sector || project.secteur || project.category || "Digital");
    const description = escapeHTML(project.description || "");
    const link = sanitizeUrl(project.link || project.lien || "#");
    const image = sanitizeUrl(project.image || "");
    const id = escapeHTML(project.id);

    return `
      <a href="${link}" class="portfolio-card" data-id="${id}" target="_blank" rel="noopener noreferrer" aria-label="Découvrir le projet ${title}">
        <div class="portfolio-mockup-wrapper">
          <img src="assets/images/BG_Project.png" alt="Mockup ${title}" class="portfolio-mockup-bg" loading="lazy">
          <div class="portfolio-screen">
            ${image && image !== '#' ? `<img src="${image}" alt="${title}" class="portfolio-screen-img" loading="lazy">` : `<div class="portfolio-screen-placeholder">IMAGE SITE WEB</div>`}
          </div>
        </div>
        <div class="portfolio-content">
          <div class="portfolio-info">
            <h3 class="portfolio-title">${title}</h3>
            ${description ? `<p class="portfolio-desc">${description}</p>` : ''}
          </div>
          <span class="portfolio-sector-badge">${sector}</span>
        </div>
      </a>
    `;
  }).join('');

  setSafeHTML(container, cardsHtml);
}

/* ==========================================================================
   NAVIGATION & BOTTOM NAV (DESKTOP & MOBILE)
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const allNavLinks = document.querySelectorAll('.nav-link, .bottom-nav-link');
  const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

  // Sticky Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle (fallback si présent)
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Active Section Tracker (Scroll Spy)
  const isPortfolioPage = window.location.pathname.endsWith('portfolio.html');
  if (isPortfolioPage) {
    allNavLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.nav-link[href="portfolio.html"], .bottom-nav-link[href="portfolio.html"]').forEach(l => l.classList.add('active'));
  } else {
    const sections = document.querySelectorAll('section[id]');

    function setActiveSection(targetId) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const matchedLinks = document.querySelectorAll(
        `.nav-link[href="#${targetId}"], .bottom-nav-link[href="#${targetId}"], .nav-link[href="${targetId}.html"], .bottom-nav-link[href="${targetId}.html"]`
      );
      matchedLinks.forEach(l => l.classList.add('active'));
    }

    function updateActiveLinkSpy() {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Contact is active when near page bottom
      if (scrollY + windowHeight >= docHeight - 70) {
        setActiveSection('contact');
        return;
      }

      // Hero is active when near page top
      if (scrollY < 180) {
        setActiveSection('hero');
        return;
      }

      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        setActiveSection(currentSectionId);
      }
    }

    window.addEventListener('scroll', updateActiveLinkSpy, { passive: true });
    updateActiveLinkSpy();
  }

  // Smooth scroll and active state on bottom nav click
  bottomNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetSection = document.querySelector(targetHref);
        if (targetSection) {
          e.preventDefault();
          const targetOffset = targetHref === '#hero' ? 0 : targetSection.offsetTop - 50;
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });
          allNavLinks.forEach(l => l.classList.remove('active'));
          const matched = document.querySelectorAll(`.nav-link[href="${targetHref}"], .bottom-nav-link[href="${targetHref}"]`);
          matched.forEach(l => l.classList.add('active'));
        }
      }
    });
  });
}

/* ==========================================================================
   STATS COUNTER ANIMATION (+5, 98%, +4 ans)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1200; // ms
          const stepTime = 40;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            stat.textContent = `${prefix}${Math.floor(count)}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* ==========================================================================
   PROJECT DETAILS MODAL (CENTRALISÉ VIA DATA/PROJECTS.JS)
   ========================================================================== */
function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!modalBackdrop || !modalContent) return;

  function openModal(projectId) {
    const rawData = projects.find(p => String(p.id) === String(projectId)) || {
      title: "Nom du projet",
      category: "Projets",
      image: "assets/images/project_saas.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      link: "#"
    };

    const title = escapeHTML(rawData.title || rawData.nom || rawData.name || "Projet");
    const category = escapeHTML(rawData.category || rawData.sector || rawData.secteur || "Digital");
    const description = escapeHTML(rawData.description || "");
    const image = sanitizeUrl(rawData.image || "");
    const link = sanitizeUrl(rawData.link || rawData.lien || "#");

    const modalHtml = `
      <div style="margin-bottom: 20px;">
        <span class="section-badge badge-green">${category}</span>
        <h2 style="font-size: 1.8rem; color: #FFF; margin: 10px 0;">${title}</h2>
      </div>
      <div style="border-radius: 14px; overflow: hidden; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1); max-height: 320px; background: #0A1424;">
        <img src="${image}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <p style="color: #CBD5E1; line-height: 1.6; margin-bottom: 24px; font-size: 0.95rem;">
        ${description}
      </p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="${link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Visiter le site en direct →</a>
        <button type="button" class="btn btn-secondary modal-close-action-btn">Fermer</button>
      </div>
    `;

    setSafeHTML(modalContent, modalHtml);

    const innerCloseBtn = modalContent.querySelector('.modal-close-action-btn');
    if (innerCloseBtn) {
      innerCloseBtn.addEventListener('click', window.closeProjectModal);
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeProjectModal = function() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Délégation d'événement sur tout le document pour les cartes générées dynamiquement
  document.addEventListener('click', (e) => {
    const preview = e.target.closest('.portfolio-preview');
    if (preview) {
      e.preventDefault();
      const card = preview.closest('.portfolio-card');
      if (card) {
        const projectId = card.getAttribute('data-id');
        openModal(projectId);
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', window.closeProjectModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) window.closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      window.closeProjectModal();
    }
  });
}

/* ==========================================================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  let lastSubmitTime = 0;
  const SUBMIT_COOLDOWN_MS = 4000;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
      showToast("Veuillez patienter quelques instants avant de renvoyer un message.", "error");
      return;
    }

    const submitBtn = form.querySelector('.btn-form-submit');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    // Validation des champs obligatoires
    if (!nameVal || !emailVal || !messageVal) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    // Validation des limites de taille (prévention d'abus / DoS)
    if (nameVal.length > 100) {
      showToast("Le nom est trop long (maximum 100 caractères).", "error");
      return;
    }

    if (emailVal.length > 150) {
      showToast("L'adresse email est trop longue (maximum 150 caractères).", "error");
      return;
    }

    if (messageVal.length > 2500) {
      showToast("Le message est trop long (maximum 2500 caractères).", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showToast("Veuillez entrer une adresse email valide.", "error");
      return;
    }

    lastSubmitTime = now;

    // Submit state animation
    const originalChildren = Array.from(submitBtn.childNodes).map(n => n.cloneNode(true));
    submitBtn.disabled = true;
    setSafeHTML(submitBtn, `
      <svg style="animation: spin 1s linear infinite; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#040914"></path>
      </svg>
      Envoi en cours...
    `);

    // Simulated API response
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.replaceChildren(...originalChildren);
      form.reset();

      showToast("Merci ! Votre message a été transmis avec succès.");
      triggerConfetti();
    }, 1000);
  });
}

function showToast(message, type = "success") {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderColor = type === 'error' ? '#EF4444' : 'var(--color-green)';

  // Icône vectorielle accessible conforme aux standards (pas d'emoji)
  const iconSpan = document.createElement('span');
  iconSpan.style.display = 'inline-flex';
  iconSpan.style.alignItems = 'center';
  iconSpan.style.justifyContent = 'center';
  iconSpan.style.flexShrink = '0';

  if (type === 'error') {
    setSafeHTML(iconSpan, `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `);
  } else {
    setSafeHTML(iconSpan, `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `);
  }

  // Insertion sécurisée du message texte pour éliminer tout risque XSS
  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function triggerConfetti() {
  const colors = ['#24CE6B', '#0D63FC', '#0144D0', '#FFFFFF'];
  for (let i = 0; i < 35; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = `${Math.random() * 8 + 6}px`;
    confetti.style.height = `${Math.random() * 8 + 6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = '-20px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = `transform ${Math.random() * 2 + 2}s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s ease`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translate(${Math.random() * 200 - 100}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    }, 20);

    setTimeout(() => confetti.remove(), 3000);
  }
}

function initScrollEffects() {
  const elements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    observer.observe(el);
  });
}
