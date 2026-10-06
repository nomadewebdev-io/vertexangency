/**
 * VERTEX AGENCY - Scripts Applicatifs
 * Modules : Données Projets, Navigation & ScrollSpy, Statistiques Animées,
 * Modale Détails, Formulaire de Contact & Notifications Toast
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
   UTILITAIRES DE SÉCURITÉ ET MANIPULATION DU DOM
   ========================================================================== */

/**
 * Neutralise les entités HTML sensibles pour immuniser le code contre les injections XSS.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"'/]/g, (char) => {
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

/**
 * Valide et restreint les URLs aux protocoles sécurisés (http/https, chemins relatifs ou ancres).
 * Bloque les pseudo-protocoles d'exécution (javascript:, vbscript:, data:).
 * @param {string} rawUrl
 * @returns {string}
 */
function sanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  const trimmedUrl = rawUrl.trim();

  const isSafeRelativePath = 
    trimmedUrl.startsWith('#') || 
    trimmedUrl.startsWith('/') || 
    trimmedUrl.startsWith('./') || 
    trimmedUrl.startsWith('assets/');

  if (isSafeRelativePath) return trimmedUrl;

  try {
    const parsedUrl = new URL(trimmedUrl, window.location.origin);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return trimmedUrl;
    }
  } catch {
    return '#';
  }

  return '#';
}

/**
 * Parse une chaîne HTML dans un contexte DOM isolé via DOMParser,
 * élimine tout élément exécutable (script, iframe, embed) et monte les nœuds de manière sûre.
 * @param {HTMLElement|null} targetElement
 * @param {string} htmlMarkup
 */
function setSafeHTML(targetElement, htmlMarkup) {
  if (!targetElement || typeof htmlMarkup !== 'string') return;
  try {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(htmlMarkup, 'text/html');
    parsedDoc.querySelectorAll('script, iframe, object, embed').forEach((el) => el.remove());
    targetElement.replaceChildren(...parsedDoc.body.childNodes);
  } catch {
    targetElement.textContent = '';
  }
}

/* ==========================================================================
   MODULE PROJETS & RENDU CENTRALISÉ
   ========================================================================== */

/**
 * Normalise un objet projet issu de la source de données pour assurer l'intégrité de ses champs.
 * @param {Record<string, unknown>} rawProject
 */
function normalizeProject(rawProject) {
  return {
    id: String(rawProject?.id ?? ''),
    title: String(rawProject?.title || rawProject?.name || rawProject?.nom || 'Projet'),
    category: String(rawProject?.category || rawProject?.sector || rawProject?.secteur || 'Digital'),
    description: String(rawProject?.description || ''),
    link: sanitizeUrl(String(rawProject?.link || rawProject?.lien || '#')),
    image: sanitizeUrl(String(rawProject?.image || '')),
  };
}

/**
 * Génère le balisage HTML d'une carte projet individuelle.
 * @param {ReturnType<typeof normalizeProject>} project
 * @returns {string}
 */
function buildProjectCardMarkup(project) {
  const safeTitle = escapeHTML(project.title);
  const safeCategory = escapeHTML(project.category);
  const safeDescription = escapeHTML(project.description);
  const safeId = escapeHTML(project.id);

  const screenMedia = (project.image && project.image !== '#')
    ? `<img src="${project.image}" alt="${safeTitle}" class="portfolio-screen-img" loading="lazy" decoding="async" width="1376" height="768">`
    : `<div class="portfolio-screen-placeholder">IMAGE SITE WEB</div>`;

  const descriptionBlock = safeDescription
    ? `<p class="portfolio-desc">${safeDescription}</p>`
    : '';

  return `
    <a href="${project.link}" class="portfolio-card" data-id="${safeId}" target="_blank" rel="noopener noreferrer" aria-label="Découvrir le projet ${safeTitle}">
      <div class="portfolio-mockup-wrapper">
        <img src="assets/images/BG_Project.png" alt="Mockup ${safeTitle}" class="portfolio-mockup-bg" loading="lazy" decoding="async" width="5038" height="3526">
        <div class="portfolio-screen">
          ${screenMedia}
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-info">
          <h3 class="portfolio-title">${safeTitle}</h3>
          ${descriptionBlock}
        </div>
        <span class="portfolio-sector-badge">${safeCategory}</span>
      </div>
    </a>
  `;
}

function renderProjectCards(container, projectList) {
  if (!container || !Array.isArray(projectList) || projectList.length === 0) return;
  const cardsHtml = projectList
    .map((raw) => buildProjectCardMarkup(normalizeProject(raw)))
    .join('');
  setSafeHTML(container, cardsHtml);
}

function initProjects() {
  const landingGrid = document.getElementById('portfolioGrid');
  if (landingGrid) {
    renderProjectCards(landingGrid, projects.slice(0, 4));
  }

  const allGrid = document.getElementById('portfolioAllGrid');
  if (allGrid) {
    renderProjectCards(allGrid, projects);
  }
}

/* ==========================================================================
   MODULE NAVIGATION (DESKTOP & MOBILE)
   ========================================================================== */

function initStickyNavbar(navbar) {
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initMobileMenu(menuToggle, navMenu) {
  if (!menuToggle || !navMenu) return;

  function closeMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpening = !navMenu.classList.contains('active');
    menuToggle.classList.toggle('active', isOpening);
    navMenu.classList.toggle('active', isOpening);
    document.body.style.overflow = isOpening ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const targetNode = event.target;
    if (navMenu.classList.contains('active') && !navMenu.contains(targetNode) && !menuToggle.contains(targetNode)) {
      closeMenu();
    }
  });
}

function initScrollSpy(allNavLinks, sections, navbar) {
  if (!allNavLinks.length || !sections.length) return;

  function setActiveLink(sectionId) {
    allNavLinks.forEach((link) => link.classList.remove('active'));
    const matchingLinks = document.querySelectorAll(
      `.nav-link[href="#${sectionId}"], .bottom-nav-link[href="#${sectionId}"], .nav-link[href="${sectionId}.html"], .bottom-nav-link[href="${sectionId}.html"]`
    );
    matchingLinks.forEach((link) => link.classList.add('active'));
  }

  function handleScrollSpy() {
    const scrollY = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const navOffset = navbar ? navbar.offsetHeight + 24 : 180;

    if (scrollY + viewportHeight >= documentHeight - 70) {
      setActiveLink('contact');
      return;
    }

    if (scrollY < 180) {
      setActiveLink('hero');
      return;
    }

    for (const section of sections) {
      const sectionTop = section.offsetTop - navOffset;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute('id');
        if (sectionId) setActiveLink(sectionId);
        break;
      }
    }
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();
}

function initSmoothScroll(bottomNavLinks, allNavLinks, navbar) {
  bottomNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('href');
      if (!targetSelector || !targetSelector.startsWith('#')) return;

      const targetSection = document.querySelector(targetSelector);
      if (!targetSection) return;

      event.preventDefault();
      const navOffset = navbar ? navbar.offsetHeight + 14 : 180;
      const targetTop = targetSelector === '#hero' ? 0 : targetSection.offsetTop - navOffset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      allNavLinks.forEach((l) => l.classList.remove('active'));
      const activeLinks = document.querySelectorAll(
        `.nav-link[href="${targetSelector}"], .bottom-nav-link[href="${targetSelector}"]`
      );
      activeLinks.forEach((l) => l.classList.add('active'));
    });
  });
}

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const allNavLinks = document.querySelectorAll('.nav-link, .bottom-nav-link');
  const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

  initStickyNavbar(navbar);
  initMobileMenu(menuToggle, navMenu);

  const isPortfolioPage = window.location.pathname.endsWith('portfolio.html');
  if (isPortfolioPage) {
    allNavLinks.forEach((l) => l.classList.remove('active'));
    document
      .querySelectorAll('.nav-link[href="portfolio.html"], .bottom-nav-link[href="portfolio.html"]')
      .forEach((l) => l.classList.add('active'));
    return;
  }

  const sections = Array.from(document.querySelectorAll('section[id]'));
  initScrollSpy(allNavLinks, sections, navbar);
  initSmoothScroll(bottomNavLinks, allNavLinks, navbar);
}

/* ==========================================================================
   MODULE STATISTIQUES ANIMÉES
   ========================================================================== */

function animateCounter(statElement, duration = 1200) {
  const targetValue = Number(statElement.getAttribute('data-target')) || 0;
  const prefix = statElement.getAttribute('data-prefix') || '';
  const suffix = statElement.getAttribute('data-suffix') || '';

  const stepDuration = 40;
  const totalSteps = Math.max(1, duration / stepDuration);
  const stepIncrement = targetValue / totalSteps;
  let currentValue = 0;

  const timer = setInterval(() => {
    currentValue += stepIncrement;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    statElement.textContent = `${prefix}${Math.floor(currentValue)}${suffix}`;
  }, stepDuration);
}

function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  const statsContainer = document.querySelector('.hero-stats');
  if (!statElements.length || !statsContainer) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach((el) => animateCounter(el));
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsContainer);
}

/* ==========================================================================
   MODULE MODALE DÉTAILS PROJET
   ========================================================================== */

function buildModalMarkup(project) {
  const safeTitle = escapeHTML(project.title);
  const safeCategory = escapeHTML(project.category);
  const safeDescription = escapeHTML(project.description);

  return `
    <div style="margin-bottom: 20px;">
      <span class="section-badge badge-green">${safeCategory}</span>
      <h2 style="font-size: 1.8rem; color: #FFF; margin: 10px 0;">${safeTitle}</h2>
    </div>
    <div style="border-radius: 14px; overflow: hidden; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1); max-height: 320px; background: #0A1424;">
      <img src="${project.image}" alt="${safeTitle}" style="width:100%; height:100%; object-fit:cover;">
    </div>
    <p style="color: #CBD5E1; line-height: 1.6; margin-bottom: 24px; font-size: 0.95rem;">
      ${safeDescription}
    </p>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="${project.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Visiter le site en direct →</a>
      <button type="button" class="btn btn-secondary modal-close-action-btn">Fermer</button>
    </div>
  `;
}

function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.modal-close-btn');
  if (!modalBackdrop || !modalContent) return;

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.closeProjectModal = closeModal;

  function openModal(projectId) {
    const rawProject = projects.find((p) => String(p.id) === String(projectId)) || {
      title: "Nom du projet",
      category: "Projets",
      image: "assets/images/project_saas.jpg",
      description: "Plateforme interactive développée sur mesure.",
      link: "#"
    };

    const normalized = normalizeProject(rawProject);
    setSafeHTML(modalContent, buildModalMarkup(normalized));

    const innerCloseBtn = modalContent.querySelector('.modal-close-action-btn');
    if (innerCloseBtn) {
      innerCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', (event) => {
    const previewTrigger = event.target.closest('.portfolio-preview');
    if (!previewTrigger) return;

    event.preventDefault();
    const parentCard = previewTrigger.closest('.portfolio-card');
    if (parentCard) {
      const projectId = parentCard.getAttribute('data-id');
      if (projectId) openModal(projectId);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   MODULE FORMULAIRE DE CONTACT & VALIDATION
   ========================================================================== */

const FORM_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 150,
  MAX_MESSAGE_LENGTH: 2500,
  SUBMIT_COOLDOWN_MS: 4000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactInput(name, email, message) {
  if (!name || !email || !message) {
    return { isValid: false, error: "Veuillez remplir tous les champs obligatoires." };
  }
  if (name.length > FORM_LIMITS.MAX_NAME_LENGTH) {
    return { isValid: false, error: `Le nom est trop long (maximum ${FORM_LIMITS.MAX_NAME_LENGTH} caractères).` };
  }
  if (email.length > FORM_LIMITS.MAX_EMAIL_LENGTH) {
    return { isValid: false, error: `L'adresse email est trop longue (maximum ${FORM_LIMITS.MAX_EMAIL_LENGTH} caractères).` };
  }
  if (message.length > FORM_LIMITS.MAX_MESSAGE_LENGTH) {
    return { isValid: false, error: `Le message est trop long (maximum ${FORM_LIMITS.MAX_MESSAGE_LENGTH} caractères).` };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { isValid: false, error: "Veuillez entrer une adresse email valide." };
  }
  return { isValid: true, error: null };
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  let lastSubmitTimestamp = 0;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTimestamp < FORM_LIMITS.SUBMIT_COOLDOWN_MS) {
      showToast("Veuillez patienter quelques instants avant de renvoyer un message.", "error");
      return;
    }

    const submitBtn = contactForm.querySelector('.btn-form-submit');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameValue = nameInput ? nameInput.value.trim() : '';
    const emailValue = emailInput ? emailInput.value.trim() : '';
    const messageValue = messageInput ? messageInput.value.trim() : '';

    const validationResult = validateContactInput(nameValue, emailValue, messageValue);
    if (!validationResult.isValid) {
      showToast(validationResult.error, "error");
      return;
    }

    lastSubmitTimestamp = now;

    if (submitBtn) {
      const originalChildren = Array.from(submitBtn.childNodes).map((n) => n.cloneNode(true));
      submitBtn.disabled = true;
      setSafeHTML(submitBtn, `
        <svg style="animation: spin 1s linear infinite; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#040914"></path>
        </svg>
        Envoi en cours...
      `);

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.replaceChildren(...originalChildren);
        contactForm.reset();

        showToast("Merci ! Votre message a été transmis avec succès.");
        triggerConfetti();
      }, 1000);
    }
  });
}

/* ==========================================================================
   MODULE NOTIFICATIONS TOAST & EFFETS VISUELS
   ========================================================================== */

function getOrCreateToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function createToastIconElement(isError) {
  const iconContainer = document.createElement('span');
  iconContainer.style.display = 'inline-flex';
  iconContainer.style.alignItems = 'center';
  iconContainer.style.justifyContent = 'center';
  iconContainer.style.flexShrink = '0';

  const iconMarkup = isError
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  setSafeHTML(iconContainer, iconMarkup);
  return iconContainer;
}

function showToast(message, type = "success") {
  const container = getOrCreateToastContainer();
  const isError = type === 'error';

  const toastCard = document.createElement('div');
  toastCard.className = 'toast';
  toastCard.style.borderColor = isError ? '#EF4444' : 'var(--color-green)';

  const textNode = document.createElement('span');
  textNode.textContent = message;

  toastCard.appendChild(createToastIconElement(isError));
  toastCard.appendChild(textNode);
  container.appendChild(toastCard);

  setTimeout(() => {
    toastCard.style.opacity = '0';
    toastCard.style.transform = 'translateY(10px)';
    toastCard.style.transition = 'all 0.3s ease';
    setTimeout(() => toastCard.remove(), 300);
  }, 4500);
}

function createConfettiParticle(colorPalette) {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = `${Math.random() * 8 + 6}px`;
  particle.style.height = `${Math.random() * 8 + 6}px`;
  particle.style.backgroundColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = '-20px';
  particle.style.zIndex = '9999';
  particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
  particle.style.pointerEvents = 'none';
  particle.style.transition = `transform ${Math.random() * 2 + 2}s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s ease`;
  return particle;
}

function triggerConfetti() {
  const brandColors = ['#24CE6B', '#0D63FC', '#0144D0', '#FFFFFF'];
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = createConfettiParticle(brandColors);
    document.body.appendChild(particle);

    setTimeout(() => {
      const lateralDrift = Math.random() * 200 - 100;
      const verticalFall = window.innerHeight + 50;
      const rotationAngle = Math.random() * 720;
      particle.style.transform = `translate(${lateralDrift}px, ${verticalFall}px) rotate(${rotationAngle}deg)`;
      particle.style.opacity = '0';
    }, 20);

    setTimeout(() => particle.remove(), 3000);
  }
}

function initScrollEffects() {
  const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
    element.style.transition = 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    observer.observe(element);
  });
}
