import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../services/abmcy";
import { mapProducts } from "../lib/mapProduct";
import type { Listing } from "../data/catalog";
import ListingCard from "../components/ListingCard";
import { Reveal } from "../components/Reveal";
import { IconChevron } from "../components/Icons";

type SortKey = "featured" | "new" | "price-asc" | "price-desc";

export default function Chambres() {
  const [rooms, setRooms] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Toutes");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const products = await listProducts({ category: "chambre" });
        if (!cancelled) setRooms(mapProducts(products));
      } catch {
        if (!cancelled) setError("Impossible de charger les chambres pour le moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set(rooms.map((r) => r.city));
    return ["Toutes", ...Array.from(set)];
  }, [rooms]);

  const filtered = useMemo(() => {
    let list = city === "Toutes" ? rooms : rooms.filter((r) => r.city === city);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "new":
        list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isBest) - Number(a.isBest));
    }
    return list;
  }, [rooms, city, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Chambres disponibles</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-pine-900">
          Trouvez votre chambre
        </h1>
        <p className="mt-4 max-w-xl text-pine-600">
          Courte ou longue durée, à Dakar ou dans d'autres villes du Sénégal — filtrez par ville
          et triez selon vos priorités.
        </p>
      </Reveal>

      {/* filtres */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`chip ${city === c ? "chip-on" : ""}`}
          >
            {c}
          </button>
        ))}

        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field w-auto cursor-pointer appearance-none pr-9 text-sm"
          >
            <option value="featured">Recommandées</option>
            <option value="new">Nouvelles</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <IconChevron size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-pine-500" />
        </div>
      </div>

      {/* résultats */}
      {loading && <p className="mt-16 text-center text-pine-500">Chargement des chambres…</p>}
      {error && <p className="mt-16 text-center text-clay-600">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="mt-16 text-center text-pine-500">Aucune chambre ne correspond à ce filtre pour le moment.</p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r, i) => (
            <ListingCard key={r.id} listing={r} delay={(i % 8) * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
