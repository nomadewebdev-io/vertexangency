/**
 * ==============================================================================
 * VERTEX AGENCY - FICHIER DE DONNÉES UNIQUE DES RÉALISATIONS / PROJETS
 * ==============================================================================
 * Structure finale de chaque entrée :
 * - id: Identifiant numérique unique
 * - nom / title: Nom du projet (en gras, aligné à gauche)
 * - image: Image réelle du projet affichée au centre de l'écran du mockup laptop
 * - description: Courte description synthétique (1 ligne max)
 * - secteur / category: Secteur d'activité affiché en pilule bleue
 * - lien / link: URL vers le projet réel ouverte dans un nouvel onglet
 * ==============================================================================
 */

export const projects = [
  {
    id: 1,
    name: "Quantum Analytics",
    title: "Quantum Analytics",
    sector: "SaaS & IA",
    category: "SaaS & IA",
    image: "assets/images/project_saas.jpg",
    description: "Plateforme SaaS d'analytique temps réel et visualisation de données.",
    link: "https://example.com"
  },
  {
    id: 2,
    name: "Aurelia Luxe",
    title: "Aurelia Luxe",
    sector: "E-Commerce",
    category: "E-Commerce",
    image: "assets/images/project_ecommerce.jpg",
    description: "Boutique e-commerce haute joaillerie avec expérience d'achat immersive.",
    link: "https://example.com"
  },
  {
    id: 3,
    name: "Hexa Fintech",
    title: "Hexa Fintech",
    sector: "Fintech",
    category: "Fintech",
    image: "assets/images/project_fintech.jpg",
    description: "Application bancaire mobile et gestion d'actifs crypto multi-devises.",
    link: "https://example.com"
  },
  {
    id: 4,
    name: "Emerald Estates",
    title: "Emerald Estates",
    sector: "Immobilier",
    category: "Immobilier",
    image: "assets/images/project_realestate.jpg",
    description: "Portail immobilier de résidences de prestige avec visites interactives.",
    link: "https://example.com"
  },
  {
    id: 5,
    name: "Nova Pulse",
    title: "Nova Pulse",
    sector: "Productivité",
    category: "Productivité",
    image: "assets/images/project_saas.jpg",
    description: "Suite logicielle collaborative et automatisation de flux de travail.",
    link: "https://example.com"
  },
  {
    id: 6,
    name: "Zenith Retail",
    title: "Zenith Retail",
    sector: "Retail & Mode",
    category: "Retail & Mode",
    image: "assets/images/project_ecommerce.jpg",
    description: "Marketplace omnicanale internationale avec gestion intelligente des stocks.",
    link: "https://example.com"
  }
];
