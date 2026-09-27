import { useEffect } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./context/StoreContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { IconWhatsApp } from "./components/Icons";
import Home from "./pages/Home";
import Chambres from "./pages/Chambres";
import ListingDetail from "./pages/ListingDetail";
import Prestations from "./pages/Prestations";
import Publier from "./pages/Publier";
import Reserver from "./pages/Reserver";
import Galerie from "./pages/Galerie";
import EspaceClient from "./pages/EspaceClient";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-[95] flex flex-col gap-3">
      {toasts.map((t) => (
        <p
          key={t.id}
          className="toast-in border-l-2 border-clay-500 bg-pine-900 px-5 py-4 text-sm text-linen-100 shadow-[0_18px_44px_-16px_rgba(23,33,27,0.8)]"
        >
          {t.msg}
        </p>
      ))}
    </div>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/221000000000" // TODO: remplacer par le vrai numéro WhatsApp Business de Paradis Services
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter avec Paradis Services sur WhatsApp"
      title="WhatsApp"
      className="pulse-dot fixed right-5 bottom-6 z-[75] grid h-14 w-14 place-items-center rounded-full bg-[#1f8f52] text-linen-50 shadow-[0_16px_38px_-10px_rgba(31,143,82,0.75)] transition-transform duration-300 hover:scale-110"
    >
      <IconWhatsApp size={26} />
    </a>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="eyebrow">Page introuvable</p>
      <p className="font-display mt-4 text-6xl font-semibold text-pine-900 italic">Perdu en chemin…</p>
      <p className="mt-4 text-pine-500">Cette page n'existe pas, mais nos annonces vous attendent.</p>
      <Link to="/" className="btn-primary mt-8">Retour à l'accueil</Link>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chambres" element={<Chambres />} />
              <Route path="/chambres/:id" element={<ListingDetail />} />
              <Route path="/prestations" element={<Prestations />} />
              <Route path="/prestations/:id" element={<ListingDetail />} />
              <Route path="/publier" element={<Publier />} />
              <Route path="/reserver" element={<Reserver />} />
              <Route path="/galerie" element={<Galerie />} />
              <Route path="/espace-client" element={<EspaceClient />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <Toasts />
        <WhatsAppFloat />
        <div className="noise-layer" aria-hidden />
      </HashRouter>
    </StoreProvider>
  );
}
