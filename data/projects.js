/**
 * VERTEX AGENCY - Données Centralisées des Réalisations
 * Schéma unifié pour chaque projet :
 * - id: number (identifiant unique)
 * - title: string (titre affiché du projet)
 * - category: string (catégorie / secteur d'activité)
 * - image: string (chemin relatif de l'image de prévisualisation)
 * - description: string (synthèse courte)
 * - link: string (URL de démonstration ou de production)
 */

export const projects = [
  {
    id: 1,
    title: "Quantum Analytics",
    category: "SaaS & IA",
    image: "assets/images/project_saas.jpg",
    description: "Plateforme SaaS d'analytique temps réel et tableaux de bord financiers pour entreprises.",
    link: "https://example.com"
  },
  {
    id: 2,
    title: "Aurelia Luxe",
    category: "E-Commerce",
    image: "assets/images/project_ecommerce.jpg",
    description: "Boutique en ligne haut de gamme avec paiements sécurisés et catalogue immersif.",
    link: "https://example.com"
  },
  {
    id: 3,
    title: "Hexa Fintech",
    category: "Fintech",
    image: "assets/images/project_fintech.jpg",
    description: "Application mobile bancaire et passerelle de paiements instantanés Wave & Orange Money.",
    link: "https://example.com"
  },
  {
    id: 4,
    title: "Emerald Estates",
    category: "Immobilier",
    image: "assets/images/project_realestate.jpg",
    description: "Portail immobilier de résidences de prestige aux Almadies et Plateau avec visites 3D.",
    link: "https://example.com"
  },
  {
    id: 5,
    title: "Nova Pulse",
    category: "Productivité",
    image: "assets/images/project_saas.jpg",
    description: "Suite logicielle collaborative et automatisation de flux de travail pour équipes distribuées.",
    link: "https://example.com"
  },
  {
    id: 6,
    title: "Zenith Retail",
    category: "Retail & Distribution",
    image: "assets/images/project_ecommerce.jpg",
    description: "Marketplace omnicanale ouest-africaine avec gestion des stocks multi-entrepôts et suivi livreurs.",
    link: "https://example.com"
  }
];
