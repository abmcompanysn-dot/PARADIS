export type Listing = {
  id: string;
  name: string;
  /** "chambre" (location) ou "prestation" (service). */
  kind: "chambre" | "prestation";
  city: string;
  type: string; // ex: "Chambre privée", "Studio", "Ménage", "Blanchisserie"...
  price: number;
  priceUnit: "nuit" | "mois" | "prestation";
  image: string;
  objectPos?: string;
  description: string;
  amenities: string[];
  capacity?: number; // nombre de personnes (chambres uniquement)
  isNew?: boolean;
  isBest?: boolean;
};

/**
 * Anciennes listes statiques supprimées au fil de l'intégration API — les
 * annonces réelles viennent de GET /products (voir Chambres.tsx,
 * Prestations.tsx). Ce fichier ne garde que les données éditoriales fixes
 * (villes, équipements suggérés, témoignages, étapes de réservation).
 */

export const CITIES = ["Dakar", "Saint-Louis", "Thiès", "Mbour", "Saly"];

export const ROOM_TYPES = ["Chambre privée", "Studio", "Appartement meublé", "Chambre partagée"];

export const SERVICE_TYPES = ["Ménage", "Blanchisserie", "Accueil & conciergerie", "Sécurité"];

export const SUGGESTED_AMENITIES = [
  "Wi-Fi",
  "Climatisation",
  "Salle de bain privée",
  "Petit-déjeuner inclus",
  "Cuisine partagée",
  "Parking",
  "Générateur / secours électrique",
  "Ménage quotidien",
  "Accès sécurisé 24h/24",
];

export const TESTIMONIALS = [
  {
    quote:
      "J'ai réservé une chambre à Dakar pour deux semaines en déplacement professionnel, tout s'est passé comme annoncé et l'équipe a été très réactive.",
    name: "Awa D.",
    city: "Dakar — Plateau",
  },
  {
    quote:
      "Le service de ménage était ponctuel et sérieux. Pratique de tout gérer depuis mon espace client, sans devoir rappeler chaque semaine.",
    name: "Moussa S.",
    city: "Saint-Louis",
  },
  {
    quote:
      "Studio propre, bien situé, et la prestation de blanchisserie en option nous a fait gagner un temps précieux pendant notre séjour.",
    name: "Fatou N.",
    city: "Thiès",
  },
];

export const BOOKING_STAGES = [
  { key: "recorded", label: "Réservation enregistrée" },
  { key: "confirmed", label: "Confirmée par l'équipe" },
  { key: "making", label: "Préparation en cours" },
  { key: "shipped", label: "Prête / en route" },
  { key: "delivered", label: "Séjour ou prestation effectué" },
];

export const fmtPrice = (n: number) => `${n.toLocaleString("fr-FR")} F`;

/**
 * Réseaux sociaux et contacts — placeholders explicites. À remplacer par les
 * vrais comptes/numéros de Paradis Services avant mise en production.
 */
export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#" }, // TODO: lien réel du compte Instagram Paradis Services
  { id: "facebook", label: "Facebook", href: "#" }, // TODO: lien réel de la page Facebook
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/221000000000" }, // TODO: remplacer par le vrai numéro WhatsApp
];
