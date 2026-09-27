import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { fmtPrice } from "../data/catalog";
import { IconArrow, IconBag, IconClose, IconMinus, IconPlus, IconTrash } from "./Icons";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, updateQty, removeItem } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  return (
    <div
      className={`fixed inset-0 z-[90] transition-opacity duration-400 ${
        cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!cartOpen}
    >
      <div className="absolute inset-0 bg-pine-950/55" onClick={() => setCartOpen(false)} />
      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-linen-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-linen-300/70 px-6 py-5">
          <div>
            <p className="eyebrow">Votre sélection</p>
            <h2 className="font-display mt-1 text-2xl font-semibold text-pine-900">Panier</h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Fermer le panier"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-pine-700 transition-colors hover:bg-pine-800 hover:text-linen-100"
          >
            <IconClose />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-linen-300 text-pine-500">
              <IconBag size={30} />
            </span>
            <p className="font-display text-2xl text-pine-800 italic">Votre sélection est vide</p>
            <p className="text-sm text-pine-500">
              Parcourez les chambres disponibles ou les prestations de service.
            </p>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate("/chambres");
              }}
              className="btn-primary mt-2"
            >
              Voir les chambres
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-linen-300/60 overflow-y-auto px-6">
              {cart.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-[6px] border border-linen-300/70 bg-linen-200">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg leading-tight font-semibold text-pine-900">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.key)}
                        aria-label="Retirer l'article"
                        className="cursor-pointer text-pine-500 transition-colors hover:text-clay-600"
                      >
                        <IconTrash size={17} />
                      </button>
                    </div>
                    {item.detail && <p className="mt-0.5 text-xs text-pine-500">{item.detail}</p>}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-linen-300">
                        <button
                          onClick={() => updateQty(item.key, -1)}
                          aria-label="Diminuer"
                          className="grid h-8 w-8 cursor-pointer place-items-center transition-colors hover:bg-linen-200"
                        >
                          <IconMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, 1)}
                          aria-label="Augmenter"
                          className="grid h-8 w-8 cursor-pointer place-items-center transition-colors hover:bg-linen-200"
                        >
                          <IconPlus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-pine-900">
                        {fmtPrice(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-linen-300/70 bg-linen-100/60 px-6 py-5">
              <div className="mb-1 flex items-center justify-between text-sm text-pine-500">
                <span>Aucun frais caché — confirmation par notre équipe</span>
              </div>
              <div className="mb-5 flex items-baseline justify-between">
                <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-pine-700">
                  Total estimé
                </span>
                <span className="font-display text-3xl font-semibold text-pine-900">
                  {fmtPrice(cartTotal)}
                </span>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/reserver");
                }}
                className="btn-primary w-full"
              >
                Finaliser la réservation <IconArrow size={16} />
              </button>
              <p className="mt-3 text-center text-[11px] tracking-wide text-pine-500">
                Wave · Orange Money · MTN MoMo · Visa / Mastercard
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
