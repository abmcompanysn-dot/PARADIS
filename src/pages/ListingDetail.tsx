import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, listProducts } from "../services/abmcy";
import { mapProduct, mapProducts } from "../lib/mapProduct";
import type { Listing } from "../data/catalog";
import { fmtPrice } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { Reveal } from "../components/Reveal";
import ListingCard from "../components/ListingCard";
import ShareMenu from "../components/ShareMenu";
import { IconArrow, IconBag, IconCheck, IconPin } from "../components/Icons";

const unitLabel: Record<Listing["priceUnit"], string> = {
  nuit: "par nuit",
  mois: "par mois",
  prestation: "par prestation",
};

export default function ListingDetail() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    async function load() {
      try {
        const product = await getProduct(id!);
        if (cancelled) return;
        const mapped = mapProduct(product);
        setListing(mapped);

        const siblings = await listProducts({ category: product.category }).catch(() => []);
        if (!cancelled) {
          setSimilar(mapProducts(siblings).filter((l) => l.id !== mapped.id).slice(0, 3));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-32 text-center text-pine-500">Chargement…</p>;
  }

  if (notFound || !listing) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <p className="font-display text-4xl font-semibold text-pine-900 italic">Annonce introuvable</p>
        <p className="mt-4 text-pine-500">Cette annonce n'existe plus ou a été retirée.</p>
        <Link to="/chambres" className="btn-primary mt-8">Retour aux chambres</Link>
      </div>
    );
  }

  const onAdd = () => {
    addToCart(
      {
        key: listing.id,
        productId: listing.id,
        name: listing.name,
        detail: `${listing.city} · ${listing.type}`,
        price: listing.price,
        image: listing.image,
        city: listing.city,
        priceUnit: listing.priceUnit,
      },
      qty
    );
  };

  const shareText = `${listing.name} — ${listing.city} — ${fmtPrice(listing.price)} ${unitLabel[listing.priceUnit]} — via Paradis Services`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal className="overflow-hidden rounded-[10px] border border-linen-300">
          <img src={listing.image} alt={listing.name} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: listing.objectPos }} />
        </Reveal>

        <Reveal delay={80}>
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-pine-500">
            <IconPin size={13} /> {listing.city} · {listing.type}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-pine-900">{listing.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-clay-600">
            {fmtPrice(listing.price)} <span className="text-sm font-normal text-pine-500">{unitLabel[listing.priceUnit]}</span>
          </p>

          <p className="mt-6 leading-relaxed text-pine-700">{listing.description}</p>

          {listing.capacity && (
            <p className="mt-4 text-sm text-pine-600">Capacité : jusqu'à {listing.capacity} personne(s)</p>
          )}

          {listing.amenities.length > 0 && (
            <div className="mt-6">
              <p className="label">Équipements</p>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {listing.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-pine-700">
                    <IconCheck size={15} className="text-clay-500" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-linen-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 cursor-pointer place-items-center hover:bg-linen-200"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 cursor-pointer place-items-center hover:bg-linen-200"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
            <button onClick={onAdd} className="btn-primary flex-1">
              <IconBag size={16} /> {listing.kind === "chambre" ? "Réserver" : "Demander cette prestation"}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <ShareMenu text={shareText} />
          </div>
        </Reveal>
      </div>

      {similar.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow">Vous pourriez aussi aimer</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-pine-900">Annonces similaires</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <ListingCard key={s.id} listing={s} delay={i * 80} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <Link to={listing.kind === "chambre" ? "/chambres" : "/prestations"} className="btn-ghost">
          <IconArrow size={16} className="rotate-180" /> Retour à la liste
        </Link>
      </div>
    </div>
  );
}
