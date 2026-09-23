/**
 * VERTEX AGENCY - INTERACTIVE SCRIPTS
 * Features: Mobile Nav, Smooth Scroll, Active Spy, Project Lightbox Modal,
 * Stats Counter Animation, Form Validation & Success Toast/Confetti, Card Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavigation();
  initStatsCounter();
  initPortfolioFilters();
  initProjectModal();
  initContactForm();
  initScrollEffects();
});

/* ==========================================================================
   NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
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

  // Active Link Spy on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  });
}

/* ==========================================================================
   STATS COUNTER ANIMATION
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
          const duration = 1800; // ms
          const stepTime = 30;
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
   PORTFOLIO FILTERS
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  saas: {
    title: "Quantum Analytics SaaS Platform",
    category: "Next.js • Tailwind CSS • Dashboard • TypeScript",
    image: "assets/images/project_saas.jpg",
    description: "Plateforme B2B d'analyse prédictive et de visualisation de données en temps réel. Dotée d'un moteur d'apprentissage automatique pour l'optimisation des taux de conversion et d'une interface ultra-réactive conçue pour les équipes produit.",
    deliverables: ["Dashboard temps réel avec Websockets", "Architecture micro-frontend Next.js 14", "Intégration d'API GraphQL & Stripe Billing", "Dark mode natif et composants modulaires"],
    client: "Quantum Tech Corp",
    year: "2026"
  },
  ecommerce: {
    title: "Aurelia Luxe E-Commerce",
    category: "Shopify Plus • Webflow • UI/UX Design",
    image: "assets/images/project_ecommerce.jpg",
    description: "Expérience shopping immersive et épurée pour une maison de haute maroquinerie et joaillerie. Optimisation globale des parcours d'achat ayant entraîné une progression de 78% des commandes internationales.",
    deliverables: ["Design UI/UX sur mesure sous Figma", "Boutique headless Shopify Storefront API", "Panier dynamique tiroir et checkout 1-clic", "Optimisation des performances (score 99/100)"],
    client: "Maison Aurelia Paris",
    year: "2026"
  },
  fintech: {
    title: "Hexa Fintech & Crypto Ecosystem",
    category: "React Native • Node.js • Web3 API",
    image: "assets/images/project_fintech.jpg",
    description: "Application mobile bancaire nouvelle génération avec intégration de portefeuilles multi-devises, transferts instantanés sans frais et tableau de bord d'investissement en temps réel.",
    deliverables: ["Application mobile hybride iOS / Android", "Système d'authentification biométrique sécurisé", "Graphiques financiers haute fréquence", "Conformité réglementaire bancaire"],
    client: "Hexa Financial Ltd",
    year: "2025"
  },
  realestate: {
    title: "Emerald Estates Luxury Portal",
    category: "Vue.js • Real Estate • Interactive Maps",
    image: "assets/images/project_realestate.jpg",
    description: "Portail immobilier de prestige offrant des visites virtuelles interactives 3D, un système de cartographie géolocalisée et un module de prise de rendez-vous avec conseillers privés.",
    deliverables: ["Visites virtuelles 360° interactives", "Filtres géolocalisés haute performance", "CRM de gestion des mandats et leads", "Design ultra-luxe orienté conversion"],
    client: "Emerald Global Real Estate",
    year: "2025"
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggerBtns = document.querySelectorAll('.btn-project-cta, .portfolio-preview');

  if (!modalBackdrop || !modalContent) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="section-badge badge-green">${data.category}</span>
        <h2 style="font-size: 1.8rem; color: #FFF; margin: 10px 0;">${data.title}</h2>
        <div style="font-size: 0.85rem; color: #94A3B8; display: flex; gap: 16px; margin-bottom: 16px;">
          <span><strong>Client :</strong> ${data.client}</span>
          <span><strong>Année :</strong> ${data.year}</span>
        </div>
      </div>
      <div style="border-radius: 14px; overflow: hidden; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1); max-height: 320px;">
        <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <p style="color: #E2E8F0; line-height: 1.6; margin-bottom: 20px; font-size: 0.95rem;">
        ${data.description}
      </p>
      <h4 style="color: #00FF87; font-size: 1.05rem; margin-bottom: 12px;">Points clés du projet :</h4>
      <ul style="list-style: none; margin-bottom: 24px; display: grid; grid-template-columns: 1fr; gap: 8px;">
        ${data.deliverables.map(item => `<li style="display: flex; align-items: center; gap: 10px; color: #94A3B8; font-size: 0.9rem;"><span style="color:#00DF81;">✔</span> ${item}</li>`).join('')}
      </ul>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="#contact" class="btn btn-primary" onclick="closeProjectModal()">Lancer un projet similaire →</a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeProjectModal = function() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-card');
      if (card) {
        const projectId = card.getAttribute('data-id');
        openModal(projectId);
      }
    });
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-form-submit');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const projectType = document.getElementById('projectType');
    const messageInput = document.getElementById('message');

    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showToast("Veuillez entrer une adresse email valide.", "error");
      return;
    }

    // Submit state animation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#040914"></path>
      </svg>
      Envoi en cours...
    `;

    // Simulate API network request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      showToast(`Merci ${nameInput.value.trim()} ! Votre message a été transmis avec succès. Notre équipe vous recontactera sous 24h.`);
      triggerConfetti();
    }, 1200);
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
  toast.innerHTML = `
    <span style="font-size: 1.3rem;">${type === 'error' ? '⚠️' : '✅'}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* Confetti Celebration */
function triggerConfetti() {
  const colors = ['#00FF87', '#00DF81', '#0066FF', '#38BDF8', '#FFFFFF'];
  for (let i = 0; i < 40; i++) {
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

/* Subtle Scroll Animations */
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
