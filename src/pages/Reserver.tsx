import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { fmtPrice } from "../data/catalog";
import { createOrder, type Order } from "../services/abmcy";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconCheck } from "../components/Icons";

export default function Reserver() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="font-display text-3xl font-semibold text-pine-900 italic">Rien à réserver pour l'instant</p>
        <p className="mt-4 text-pine-500">Ajoutez une chambre ou une prestation avant de finaliser.</p>
        <Link to="/chambres" className="btn-primary mt-8">Voir les chambres</Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Le nom et le téléphone sont requis pour confirmer la réservation.");
      return;
    }

    setSubmitting(true);
    try {
      const summary = cart.map((i) => `${i.qty}x ${i.name}`).join(", ");
      const created = await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        total_amount: cartTotal,
        shipping_address: address.trim() || undefined,
        notes: [summary, notes.trim()].filter(Boolean).join(" — "),
      });
      setOrder(created);
      clearCart();
    } catch (err: any) {
      setError(err?.message || "Échec de l'envoi de la réservation. Réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pine-800 text-linen-100">
          <IconCheck size={26} className="check-path" />
        </span>
        <h1 className="font-display mt-6 text-4xl font-semibold text-pine-900">Réservation enregistrée</h1>
        <p className="mt-4 text-pine-600">
          Référence <span className="font-semibold text-clay-600">{order.order_number || order.id}</span> —
          notre équipe vous contactera au {phone} pour confirmer les modalités.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/espace-client" className="btn-primary">
            Suivre ma réservation <IconArrow size={16} />
          </Link>
          <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Dernière étape</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-pine-900">Finaliser la réservation</h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Nom complet</label>
              <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input id="phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">E-mail (optionnel)</label>
            <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="address">Adresse ou quartier</label>
            <input id="address" className="field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Utile pour les prestations à domicile" />
          </div>
          <div>
            <label className="label" htmlFor="notes">Remarques (optionnel)</label>
            <textarea id="notes" className="field min-h-24 resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dates souhaitées, horaires, précisions..." />
          </div>

          {error && <p className="text-sm text-clay-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Envoi en cours…" : "Confirmer la réservation"} <IconArrow size={16} />
          </button>
          <p className="text-center text-[11px] tracking-wide text-pine-500">
            Paiement à la confirmation — Wave · Orange Money · MTN MoMo · Carte bancaire
          </p>
        </form>

        <aside className="h-fit rounded-[8px] border border-linen-300 bg-linen-50 p-6">
          <p className="eyebrow">Récapitulatif</p>
          <ul className="mt-4 space-y-4 divide-y divide-linen-300/60">
            {cart.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 pt-4 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-pine-900">{item.name}</p>
                  {item.detail && <p className="text-xs text-pine-500">{item.detail}</p>}
                  <p className="text-xs text-pine-500">Quantité : {item.qty}</p>
                </div>
                <p className="text-sm font-semibold text-pine-900">{fmtPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline justify-between border-t border-linen-300/70 pt-4">
            <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-pine-700">Total</span>
            <span className="font-display text-2xl font-semibold text-pine-900">{fmtPrice(cartTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
