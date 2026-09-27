import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { IconBag, IconClose, IconMenu, IconSparkle, IconUser, IconWhatsApp } from "./Icons";
import { SOCIALS } from "../data/catalog";

/**
 * Logo texte/SVG généré en CSS (pas de fichier image) — placeholder clair à
 * remplacer par un vrai logo graphique plus tard. Le sceau "P" est un simple
 * cercle SVG inline.
 */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="Paradis Services — accueil">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ring-1 transition-colors duration-300 ${
          light ? "bg-clay-500 ring-linen-100/30" : "bg-pine-800 ring-pine-800/15"
        }`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fbf7f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20V9.5L12 4l8 5.5V20" />
          <path d="M9 20v-6h6v6" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-display block text-[22px] font-semibold tracking-[0.06em] ${
            light ? "text-linen-100" : "text-pine-900"
          }`}
        >
          Paradis Services
        </span>
        <span
          className={`mt-1 block text-[8.5px] font-medium uppercase tracking-[0.4em] ${
            light ? "text-linen-300" : "text-pine-500"
          }`}
        >
          Chambres & prestations
        </span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/chambres", label: "Chambres" },
  { to: "/prestations", label: "Prestations" },
  { to: "/publier", label: "Publier une annonce" },
  { to: "/galerie", label: "Galerie" },
];

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* bandeau annonce */}
      <div className="relative z-[60] flex items-center justify-center gap-2 bg-pine-900 px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-linen-200">
        <IconSparkle size={11} className="shrink-0 text-clay-300" />
        <span className="hidden sm:inline">Chambres vérifiées · Prestations fiables · Dakar et autres villes</span>
        <span className="sm:hidden">Chambres & prestations vérifiées</span>
        <IconSparkle size={11} className="shrink-0 text-clay-300" />
      </div>

      <header
        className={`sticky top-0 z-[55] border-b transition-all duration-500 ${
          scrolled
            ? "border-linen-300/80 bg-linen-100/95 shadow-[0_10px_40px_-18px_rgba(23,33,27,0.35)] backdrop-blur-md"
            : "border-transparent bg-linen-100/60 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `relative py-1 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-clay-500 after:transition-transform after:duration-300 hover:text-clay-600 hover:after:scale-x-100 ${
                    isActive ? "text-clay-600 after:scale-x-100" : "text-pine-700"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/espace-client"
              aria-label="Espace client"
              className="grid h-11 w-11 place-items-center rounded-full text-pine-800 transition-all duration-300 hover:bg-pine-800 hover:text-linen-100"
            >
              <IconUser />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Ouvrir ma sélection"
              className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full text-pine-800 transition-all duration-300 hover:bg-pine-800 hover:text-linen-100"
            >
              <IconBag />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay-500 px-1 text-[10px] font-semibold text-linen-50">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-pine-800 transition-colors hover:bg-pine-800 hover:text-linen-100 lg:hidden"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {/* menu mobile */}
      <div
        className={`fixed inset-0 z-[85] transition-opacity duration-400 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-pine-950/60" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 flex h-full w-[86%] max-w-sm flex-col bg-pine-900 text-linen-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-linen-100/10 px-6 py-5">
            <span className="eyebrow !text-clay-300">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-linen-100/10"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
            {NAV.map((n, i) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
                className={({ isActive }) =>
                  `font-display border-b border-linen-100/8 py-4 text-3xl font-medium transition-all duration-500 ${
                    menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  } ${isActive ? "text-clay-300 italic" : "text-linen-100 hover:text-clay-300"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to="/espace-client"
              className="mt-6 inline-flex items-center gap-3 self-start bg-clay-500 px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-pine-950 transition-colors hover:bg-clay-300"
            >
              <IconUser size={16} /> Espace client
            </NavLink>
          </nav>
          <div className="border-t border-linen-100/10 px-6 py-6">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-linen-300">Suivez-nous</p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-linen-100/20 transition-all hover:border-clay-300 hover:text-clay-300"
                >
                  {s.id === "whatsapp" ? <IconWhatsApp size={17} /> : <IconSparkle size={15} />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
