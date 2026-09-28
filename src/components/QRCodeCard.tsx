import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

/**
 * Génère un QR code pointant vers l'URL fournie, entièrement côté client
 * (aucun appel à un service tiers). Affiche aussi un bouton pour
 * télécharger le QR code en PNG — utile à imprimer et coller sur une
 * porte de chambre ou un flyer.
 */
export default function QRCodeCard({ url, label }: { url: string; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 }, (err) => {
      if (err) setError("Impossible de générer le QR code.");
    });
  }, [url]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "paradis-services-qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-linen-300 bg-linen-50 p-6">
      {label && <p className="text-sm font-medium text-pine-700">{label}</p>}
      {error ? (
        <p className="text-sm text-clay-600">{error}</p>
      ) : (
        <canvas ref={canvasRef} className="rounded-lg" />
      )}
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-full border border-pine-300 px-4 py-2 text-xs font-medium tracking-wide text-pine-700 uppercase transition-colors hover:bg-pine-800 hover:text-linen-100"
      >
        Télécharger le QR code
      </button>
    </div>
  );
}
