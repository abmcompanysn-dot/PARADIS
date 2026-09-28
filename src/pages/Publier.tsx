import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createProduct, type UploadResult } from "../services/abmcy";
import { listingToProductPayload } from "../lib/mapProduct";
import { CITIES, ROOM_TYPES, SERVICE_TYPES, SUGGESTED_AMENITIES } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import PhotoUploadWithWatermark from "../components/PhotoUploadWithWatermark";
import QRCodeCard from "../components/QRCodeCard";
import ShareMenu from "../components/ShareMenu";
import { IconArrow, IconCheck } from "../components/Icons";

type Kind = "chambre" | "prestation";

export default function Publier() {
  const [kind, setKind] = useState<Kind>("chambre");
  const [name, setName] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [type, setType] = useState(ROOM_TYPES[0]);
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"nuit" | "mois" | "prestation">("nuit");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photo, setPhoto] = useState<UploadResult | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const typeOptions = kind === "chambre" ? ROOM_TYPES : SERVICE_TYPES;

  function toggleAmenity(a: string) {
    setAmenities((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const numericPrice = Number(price);
    if (!name.trim() || !numericPrice || numericPrice <= 0) {
      setError("Merci de renseigner au moins un nom d'annonce et un prix valide.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = listingToProductPayload({
        name: name.trim(),
        kind,
        city,
        type,
        price: numericPrice,
        priceUnit,
        description: description.trim(),
        amenities,
        capacity: capacity ? Number(capacity) : undefined,
        imageUrl: photo?.url,
      });
      const created = await createProduct(payload);
      setCreatedId(created.id);
    } catch (err: any) {
      setError(err?.message || "Échec de la publication de l'annonce. Réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  }

  if (createdId) {
    const listingUrl = `${window.location.origin}/${kind === "chambre" ? "chambres" : "prestations"}/${createdId}`;
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-pine-800 text-linen-100">
          <IconCheck size={26} className="check-path" />
        </span>
        <h1 className="font-display mt-6 text-4xl font-semibold text-pine-900">Annonce publiée</h1>
        <p className="mt-4 text-pine-600">
          Votre annonce a été envoyée à Paradis Services. Elle apparaîtra dans la liste dès sa
          validation par l'équipe.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <QRCodeCard url={listingUrl} label="Scannez pour voir l'annonce" />
          <ShareMenu url={listingUrl} text={`${name || "Découvrez cette annonce"} — Paradis Services`} />
        </div>

        <Link to={kind === "chambre" ? "/chambres" : "/prestations"} className="btn-primary mt-10">
          Voir les annonces <IconArrow size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Propriétaires & prestataires</p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-pine-900">Publier une annonce</h1>
        <p className="mt-4 text-pine-600">
          Décrivez votre chambre ou votre prestation. La photo choisie recevra automatiquement un
          filigrane « Paradis Services » avant d'être envoyée.
        </p>
      </Reveal>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        <div>
          <p className="label">Type d'annonce</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setKind("chambre");
                setType(ROOM_TYPES[0]);
                setPriceUnit("nuit");
              }}
              className={`chip ${kind === "chambre" ? "chip-on" : ""}`}
            >
              Chambre à louer
            </button>
            <button
              type="button"
              onClick={() => {
                setKind("prestation");
                setType(SERVICE_TYPES[0]);
                setPriceUnit("prestation");
              }}
              className={`chip ${kind === "prestation" ? "chip-on" : ""}`}
            >
              Prestation de service
            </button>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="name">Nom de l'annonce</label>
          <input
            id="name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind === "chambre" ? "Ex : Chambre lumineuse aux Almadies" : "Ex : Ménage complet — appartement"}
            required
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="city">Ville</label>
            <select id="city" className="field" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="type">Type précis</label>
            <select id="type" className="field" value={type} onChange={(e) => setType(e.target.value)}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Prix (F CFA)</label>
            <input
              id="price"
              type="number"
              min={0}
              className="field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="priceUnit">Unité</label>
            <select
              id="priceUnit"
              className="field"
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value as typeof priceUnit)}
            >
              {kind === "chambre" ? (
                <>
                  <option value="nuit">par nuit</option>
                  <option value="mois">par mois</option>
                </>
              ) : (
                <option value="prestation">par prestation</option>
              )}
            </select>
          </div>
          {kind === "chambre" && (
            <div>
              <label className="label" htmlFor="capacity">Capacité (personnes)</label>
              <input
                id="capacity"
                type="number"
                min={1}
                className="field"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="2"
              />
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="field min-h-32 resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le logement ou la prestation, les conditions, les disponibilités..."
          />
        </div>

        <div>
          <p className="label">Équipements / options proposés</p>
          <div className="flex flex-wrap gap-2.5">
            {SUGGESTED_AMENITIES.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`chip ${amenities.includes(a) ? "chip-on" : ""}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <PhotoUploadWithWatermark
          label="Photo principale"
          hint="Un filigrane « Paradis Services » est ajouté automatiquement dans un coin de la photo avant l'envoi (max 25 Mo)."
          onUploaded={(result) => setPhoto(result)}
        />

        {error && <p className="text-sm text-clay-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Publication en cours…" : "Publier l'annonce"} <IconArrow size={16} />
        </button>
      </form>
    </div>
  );
}
