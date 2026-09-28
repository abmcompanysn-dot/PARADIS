import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts, listGallery, type GalleryItem } from "../services/abmcy";
import { mapProducts } from "../lib/mapProduct";
import type { Listing } from "../data/catalog";
import { TESTIMONIALS, fmtPrice } from "../data/catalog";
import ListingCard from "../components/ListingCard";
import { Reveal, MaskLines } from "../components/Reveal";
import {
  IconArrow,
  IconBed,
  IconBroom,
  IconKey,
  IconShield,
  IconStar,
  IconWifi,
} from "../components/Icons";

const HIGHLIGHTS = [
  {
    icon: IconBed,
    title: "Chambres vérifiées",
    text: "Chaque chambre publiée est photographiée et décrite avec ses équipements réels avant mise en ligne.",
  },
  {
    icon: IconBroom,
    title: "Prestations fiables",
    text: "Ménage, blanchisserie, accueil : des prestataires suivis, pour un service constant d'une fois sur l'autre.",
  },
  {
    icon: IconShield,
    title: "Confiance & sécurité",
    text: "Profils vérifiés, suivi de réservation clair, et une équipe joignable en cas de besoin.",
  },
  {
    icon: IconKey,
    title: "Courte ou longue durée",
    text: "Une nuit, un mois, ou un contrat de service récurrent — le format s'adapte à votre besoin.",
  },
];

export default function Home() {
  const [rooms, setRooms] = useState<Listing[]>([]);
  const [services, setServices] = useState<Listing[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [roomProducts, serviceProducts, galleryItems] = await Promise.all([
          listProducts({ category: "chambre", sort: "featured" }),
          listProducts({ category: "prestation", sort: "featured" }),
          listGallery().catch(() => []),
        ]);
        if (cancelled) return;
        setRooms(mapProducts(roomProducts).slice(0, 4));
        setServices(mapProducts(serviceProducts).slice(0, 3));
        setGallery(galleryItems.slice(0, 6));
      } catch {
        // Le backend n'est peut-être pas encore configuré pour ce tenant —
        // on affiche simplement des sections vides plutôt qu'un écran d'erreur.
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
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-pine-900 text-linen-100">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(208,130,79,0.35), transparent 60%)",
        }} />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 py-24 lg:flex-row lg:items-center lg:px-8 lg:py-32">
          <div className="flex-1">
            <p className="eyebrow !text-clay-300">Sénégal — Dakar et autres villes</p>
            <MaskLines
              className="font-display mt-4 text-5xl leading-[1.05] font-semibold sm:text-6xl"
              lines={["Une chambre.", "Un service.", "L'esprit tranquille."]}
            />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-linen-300">
              Paradis Services réunit des chambres à louer et des prestations du quotidien
              (ménage, blanchisserie, sécurité, accueil) sur une seule plateforme simple et
              rassurante.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/chambres" className="btn-primary">
                Voir les chambres <IconArrow size={16} />
              </Link>
              <Link to="/prestations" className="btn-ghost !border-linen-100/30 !text-linen-100 hover:!bg-linen-100 hover:!text-pine-900">
                Découvrir les prestations
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
                alt="Chambre lumineuse et accueillante"
                className="aspect-[3/4] translate-y-6 rounded-[10px] object-cover ring-1 ring-linen-100/10"
                loading="eager"
              />
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                alt="Chambre avec vue, ambiance sereine"
                className="aspect-[3/4] rounded-[10px] object-cover ring-1 ring-linen-100/10"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-linen-300 bg-linen-200 py-3">
        <div className="animate-marquee flex w-max gap-10 text-[12px] font-medium tracking-[0.2em] text-pine-600 uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>Chambres courte durée</span>
              <span>·</span>
              <span>Chambres longue durée</span>
              <span>·</span>
              <span>Ménage</span>
              <span>·</span>
              <span>Blanchisserie</span>
              <span>·</span>
              <span>Sécurité</span>
              <span>·</span>
              <span>Accueil & conciergerie</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pourquoi Paradis Services</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-pine-900">
            Louer et se faire servir, sans mauvaise surprise
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 90} className="rounded-[8px] border border-linen-300 bg-linen-50/60 p-7">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-pine-800 text-linen-100">
                <h.icon size={22} />
              </span>
              <p className="font-display mt-5 text-xl font-semibold text-pine-900">{h.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-pine-600">{h.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CHAMBRES EN AVANT */}
      <section className="bg-linen-200/60 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow">Chambres disponibles</p>
              <h2 className="font-display mt-3 text-4xl font-semibold text-pine-900">
                Nos dernières annonces
              </h2>
            </Reveal>
            <Link to="/chambres" className="btn-ghost">
              Toutes les chambres <IconArrow size={16} />
            </Link>
          </div>

          {!loading && rooms.length === 0 ? (
            <p className="mt-12 text-pine-500">
              Aucune chambre publiée pour le moment — revenez bientôt, ou{" "}
              <Link to="/publier" className="underline hover:text-clay-600">publiez la vôtre</Link>.
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {rooms.map((r, i) => (
                <ListingCard key={r.id} listing={r} delay={i * 80} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRESTATIONS EN AVANT */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow">Prestations de service</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-pine-900">
              Un coup de main au quotidien
            </h2>
          </Reveal>
          <Link to="/prestations" className="btn-ghost">
            Toutes les prestations <IconArrow size={16} />
          </Link>
        </div>

        {!loading && services.length === 0 ? (
          <p className="mt-12 text-pine-500">Aucune prestation publiée pour le moment.</p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ListingCard key={s.id} listing={s} delay={i * 90} />
            ))}
          </div>
        )}
      </section>

      {/* PUBLIER CTA */}
      <section className="relative overflow-hidden bg-pine-900 py-24 text-linen-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center">
          <IconStar size={30} className="text-clay-300" />
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Vous avez une chambre à louer ?
          </h2>
          <p className="max-w-xl text-linen-300">
            Publiez votre annonce en quelques minutes : photos avec filigrane automatique,
            équipements, prix — et recevez vos premières demandes de réservation.
          </p>
          <Link to="/publier" className="btn-light mt-2">
            Publier une annonce <IconArrow size={16} />
          </Link>
        </div>
      </section>

      {/* GALERIE TEASER */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow">Galerie</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-pine-900">
              Chambres et réalisations récentes
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {gallery.map((g, i) => (
              <Reveal key={g.id} delay={i * 60} className="aspect-square overflow-hidden rounded-[6px]">
                <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/galerie" className="btn-ghost">
              Voir toute la galerie <IconArrow size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* TÉMOIGNAGES */}
      <section className="bg-linen-200/60 py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow">Ils nous font confiance</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-pine-900">Avis récents</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100} className="rounded-[8px] border border-linen-300 bg-linen-50 p-7">
                <div className="mb-3 flex gap-1 text-clay-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <IconStar key={s} size={14} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-pine-700 italic">“{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-pine-900">{t.name}</p>
                <p className="text-xs text-pine-500">{t.city}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal className="flex flex-col items-center justify-between gap-8 rounded-[10px] border border-linen-300 bg-linen-50 p-10 text-center lg:flex-row lg:text-left">
          <div>
            <h3 className="font-display text-3xl font-semibold text-pine-900">
              Prêt à réserver ou à vous faire aider ?
            </h3>
            <p className="mt-2 text-pine-600">
              Parcourez les chambres disponibles dès maintenant, à partir de{" "}
              <span className="font-semibold text-clay-600">{fmtPrice(10000)}</span> la nuit.
            </p>
          </div>
          <Link to="/chambres" className="btn-primary shrink-0">
            Voir les chambres <IconArrow size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
