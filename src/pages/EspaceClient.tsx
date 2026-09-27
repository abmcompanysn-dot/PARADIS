import { useEffect, useState, type FormEvent } from "react";
import {
  isAuthenticated,
  loginCustomer,
  registerCustomer,
  listOrders,
  setToken,
  clearToken,
  formatDate,
  formatPrice,
  type Order,
} from "../services/abmcy";
import { BOOKING_STAGES } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconCheck, IconChevron } from "../components/Icons";

function stageFor(status: Order["status"]): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
    case "paid":
      return 1;
    case "making":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

function LoginForm({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = mode === "login" ? await loginCustomer(phone, password) : await registerCustomer(phone, password);
      setToken(result.token);
      onAuth();
    } catch (err: any) {
      setError(err?.message || "Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <Reveal>
        <p className="eyebrow">Espace client</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-pine-900">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mt-3 text-pine-600">
          Suivez vos réservations et vos demandes de prestations en un seul endroit.
        </p>
      </Reveal>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div>
          <label className="label" htmlFor="phone">Téléphone</label>
          <input id="phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="password">Mot de passe</label>
          <input id="password" type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-clay-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"} <IconArrow size={16} />
        </button>
      </form>

      <button
        onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
        className="mt-6 w-full cursor-pointer text-center text-sm text-pine-600 underline hover:text-clay-600"
      >
        {mode === "login" ? "Pas encore de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
      </button>
    </div>
  );
}

export default function EspaceClient() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    setLoading(true);
    listOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  if (!authed) {
    return <LoginForm onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Reveal>
          <p className="eyebrow">Espace client</p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-pine-900">Mes réservations</h1>
        </Reveal>
        <button
          onClick={() => {
            clearToken();
            setAuthed(false);
          }}
          className="btn-ghost"
        >
          Se déconnecter
        </button>
      </div>

      {loading && <p className="mt-12 text-pine-500">Chargement…</p>}
      {!loading && orders.length === 0 && (
        <p className="mt-12 text-pine-500">Aucune réservation pour le moment.</p>
      )}

      <div className="mt-10 space-y-5">
        {orders.map((order) => {
          const stage = stageFor(order.status);
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="rounded-[8px] border border-linen-300 bg-linen-50">
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-pine-900">
                    Réservation {order.order_number || order.id}
                  </p>
                  <p className="text-xs text-pine-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-clay-600">{formatPrice(order.total_amount)}</span>
                  <IconChevron size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-linen-300/70 px-6 py-6">
                  {/* timeline */}
                  <div className="flex items-center">
                    {BOOKING_STAGES.map((s, i) => (
                      <div key={s.key} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                          <span
                            className={`grid h-8 w-8 place-items-center rounded-full text-xs ${
                              i <= stage ? "bg-pine-800 text-linen-100" : "border border-linen-300 text-pine-400"
                            }`}
                          >
                            {i <= stage ? <IconCheck size={14} /> : i + 1}
                          </span>
                          <span className="max-w-[80px] text-center text-[10.5px] text-pine-500">{s.label}</span>
                        </div>
                        {i < BOOKING_STAGES.length - 1 && (
                          <div className={`mx-2 h-px flex-1 ${i < stage ? "bg-pine-800" : "bg-linen-300"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="label">Contact</dt>
                      <dd className="text-pine-700">{order.customer_name} · {order.customer_phone}</dd>
                    </div>
                    {order.shipping_address && (
                      <div>
                        <dt className="label">Adresse</dt>
                        <dd className="text-pine-700">{order.shipping_address}</dd>
                      </div>
                    )}
                    {order.notes && (
                      <div className="sm:col-span-2">
                        <dt className="label">Détails</dt>
                        <dd className="text-pine-700">{order.notes}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
