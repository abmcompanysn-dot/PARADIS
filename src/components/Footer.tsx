import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Header";
import { IconArrow, IconCheck, IconMail, IconPhone, IconPin, IconWhatsApp } from "./Icons";
import { SOCIALS } from "../data/catalog";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative mt-28 bg-pine-900 text-linen-200">
      {/* liseré décoratif */}
      <div className="relative flex items-center gap-4 overflow-hidden px-8 pt-10">
        <div className="h-px flex-1 bg-linen-100/15" />
        <span className="font-display text-lg tracking-[0.4em] text-clay-300 italic">Paradis Services</span>
        <div className="h-px flex-1 bg-linen-100/15" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] lg:px-8">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-linen-300">
            Plateforme sénégalaise de location de chambres et de prestations de services —
            ménage, blanchisserie, sécurité, accueil. Basée à Dakar, active dans plusieurs villes.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-linen-100/20 text-linen-200 transition-all duration-300 hover:-translate-y-1 hover:border-clay-300 hover:text-clay-300"
              >
                {s.id === "whatsapp" ? <IconWhatsApp size={18} /> : <span className="text-xs font-semibold">{s.label[0]}</span>}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-clay-300">Navigation</h3>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/chambres", label: "Toutes les chambres" },
              { to: "/prestations", label: "Toutes les prestations" },
              { to: "/publier", label: "Publier une annonce" },
              { to: "/galerie", label: "Galerie" },
              { to: "/espace-client", label: "Espace client & suivi" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-2 text-linen-300 transition-colors hover:text-clay-300"
                >
                  <span className="h-px w-0 bg-clay-300 transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-clay-300">Villes actives</h3>
          <ul className="space-y-3 text-sm text-linen-300">
            {["Dakar", "Saint-Louis", "Thiès", "Mbour", "Saly"].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="h-px w-4 bg-clay-300/60" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-clay-300">Nous contacter</h3>
          <ul className="space-y-3.5 text-sm text-linen-300">
            <li className="flex items-start gap-3">
              <IconPin size={17} className="mt-0.5 shrink-0 text-clay-300" />
              Dakar, Sénégal — présent dans plusieurs villes
            </li>
            <li className="flex items-center gap-3">
              <IconPhone size={17} className="shrink-0 text-clay-300" />
              {/* TODO: remplacer par le vrai numéro de contact Paradis Services */}
              <span>+221 XX XXX XX XX (à définir)</span>
            </li>
            <li className="flex items-center gap-3">
              <IconMail size={17} className="shrink-0 text-clay-300" />
              {/* TODO: remplacer par la vraie adresse email de contact */}
              <span>contact@paradis-services.example</span>
            </li>
          </ul>

          <div className="mt-7">
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-linen-300">
              Nouvelles annonces & offres
            </p>
            {subscribed ? (
              <p className="flex items-center gap-2 bg-pine-800 px-4 py-3 text-sm text-clay-300">
                <IconCheck size={16} /> Merci, vous êtes inscrit(e) !
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  className="w-full min-w-0 border border-linen-100/20 bg-pine-800 px-4 py-3 text-sm text-linen-100 outline-none placeholder:text-linen-300/50 focus:border-clay-300"
                />
                <button
                  type="submit"
                  aria-label="S'inscrire"
                  className="grid w-12 shrink-0 cursor-pointer place-items-center bg-clay-500 text-pine-950 transition-colors hover:bg-clay-300"
                >
                  <IconArrow size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* moyens de paiement */}
      <div className="border-t border-linen-100/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-6 sm:flex-row lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-linen-300">Paiement sécurisé</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-[5px] bg-[#1b9cd8] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-linen-50">
              Wave
            </span>
            <span className="rounded-[5px] bg-[#e8710a] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-linen-50">
              Orange Money
            </span>
            <span className="rounded-[5px] bg-[#f7b500] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-pine-950">
              MTN MoMo
            </span>
            <span className="rounded-[5px] border border-linen-100/25 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-linen-200">
              VISA
            </span>
            <span className="rounded-[5px] border border-linen-100/25 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-linen-200">
              Mastercard
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-linen-100/10 py-5 text-center text-[12px] tracking-wide text-linen-300/70">
        © {new Date().getFullYear()} Paradis Services — Tous droits réservés
        <span className="mx-2 text-clay-300">✦</span>
        Chambres & prestations, en toute confiance
      </div>
    </footer>
  );
}
