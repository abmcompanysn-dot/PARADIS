import { useEffect, useState } from "react";
import { listProducts } from "../services/abmcy";
import { mapProducts } from "../lib/mapProduct";
import type { Listing } from "../data/catalog";
import ListingCard from "../components/ListingCard";
import { Reveal } from "../components/Reveal";

export default function Prestations() {
  const [services, setServices] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const products = await listProducts({ category: "prestation" });
        if (!cancelled) setServices(mapProducts(products));
      } catch {
        if (!cancelled) setError("Impossible de charger les prestations pour le moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Prestations de service</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-pine-900">
          Un service pour chaque besoin
        </h1>
        <p className="mt-4 max-w-xl text-pine-600">
          Ménage, blanchisserie, sécurité, accueil & conciergerie — des prestataires suivis, pour
          un service constant.
        </p>
      </Reveal>

      {loading && <p className="mt-16 text-center text-pine-500">Chargement des prestations…</p>}
      {error && <p className="mt-16 text-center text-clay-600">{error}</p>}
      {!loading && !error && services.length === 0 && (
        <p className="mt-16 text-center text-pine-500">Aucune prestation publiée pour le moment.</p>
      )}
      {!loading && !error && services.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ListingCard key={s.id} listing={s} delay={(i % 6) * 70} />
          ))}
        </div>
      )}
    </div>
  );
}
