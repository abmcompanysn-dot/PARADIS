/**
 * Adaptateur Product API ABMCY -> Listing tel qu'attendu par l'UI (annonces
 * de chambres et prestations). Le backend ABMCY Core est générique :
 * `products.category` vaut "chambre" ou "prestation", et tout le reste
 * (ville, type précis, équipements, capacité...) vit librement dans
 * `products.attributes` (JSONB, aucune colonne dédiée côté backend).
 *
 * Repli défensif : une annonce créée depuis le dashboard tenant ou via
 * l'API n'est pas forcément enrichie de la même façon qu'une autre — on ne
 * fait jamais planter l'affichage, on dégrade proprement (ville/type
 * inconnus affichés comme "Non précisé", équipements vides).
 */
import type { Product as ApiProduct } from "../services/abmcy";
import type { Listing } from "../data/catalog";

const FALLBACK_IMAGE = "/images/chambre-placeholder.svg";

/** Transforme un produit brut de l'API ABMCY en annonce compatible avec l'UI. */
export function mapProduct(p: ApiProduct): Listing {
  const attrs = p.attributes || {};

  const kind: "chambre" | "prestation" = p.category === "prestation" ? "prestation" : "chambre";

  const amenities: string[] = Array.isArray(attrs.amenities) ? attrs.amenities : [];

  const priceUnit: Listing["priceUnit"] =
    attrs.price_unit === "mois" ? "mois" : attrs.price_unit === "prestation" ? "prestation" : kind === "chambre" ? "nuit" : "prestation";

  const image = attrs.image_url || p.image_url || FALLBACK_IMAGE;

  return {
    id: p.id,
    name: p.name,
    kind,
    city: attrs.city || "Non précisé",
    type: attrs.type || (kind === "chambre" ? "Chambre" : "Prestation"),
    price: p.price,
    priceUnit,
    image,
    objectPos: attrs.objectPos,
    description: p.description || attrs.summary || p.name,
    amenities,
    capacity: typeof attrs.capacity === "number" ? attrs.capacity : undefined,
    isNew: !!attrs.isNew,
    isBest: !!attrs.isBest || !!p.is_featured,
  };
}

export function mapProducts(list: ApiProduct[]): Listing[] {
  return list.map(mapProduct);
}

/**
 * Transforme une annonce du formulaire de publication vers les champs
 * attendus par createProduct() (voir services/abmcy.ts) — direction inverse
 * de mapProduct(), utilisée par la page "Publier une annonce".
 */
export function listingToProductPayload(input: {
  name: string;
  kind: "chambre" | "prestation";
  city: string;
  type: string;
  price: number;
  priceUnit: Listing["priceUnit"];
  description: string;
  amenities: string[];
  capacity?: number;
  imageUrl?: string;
}) {
  return {
    name: input.name,
    price: input.price,
    category: input.kind,
    description: input.description,
    image_url: input.imageUrl,
    attributes: {
      city: input.city,
      type: input.type,
      price_unit: input.priceUnit,
      amenities: input.amenities,
      capacity: input.capacity,
      image_url: input.imageUrl,
    },
  };
}
