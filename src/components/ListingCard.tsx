import { Link } from "react-router-dom";
import { fmtPrice, type Listing } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { Reveal } from "./Reveal";
import { IconBag, IconPin } from "./Icons";

const unitLabel: Record<Listing["priceUnit"], string> = {
  nuit: "/ nuit",
  mois: "/ mois",
  prestation: "/ prestation",
};

export default function ListingCard({
  listing,
  delay = 0,
}: {
  listing: Listing;
  delay?: number;
}) {
  const { addToCart } = useStore();
  const detailPath = listing.kind === "chambre" ? `/chambres/${listing.id}` : `/prestations/${listing.id}`;

  const quickAdd = () =>
    addToCart({
      key: listing.id,
      productId: listing.id,
      name: listing.name,
      detail: `${listing.city} · ${listing.type}`,
      price: listing.price,
      image: listing.image,
      city: listing.city,
      priceUnit: listing.priceUnit,
    });

  return (
    <Reveal delay={delay} className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[8px] border border-linen-300/70 bg-linen-200">
        <Link to={detailPath} className="block aspect-[4/3] overflow-hidden">
          <img
            src={listing.image}
            alt={listing.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            style={{ objectPosition: listing.objectPos }}
          />
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.isNew && (
            <span className="bg-clay-500 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-linen-50">
              Nouveau
            </span>
          )}
          {listing.isBest && (
            <span className="bg-pine-800/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-linen-100">
              Populaire
            </span>
          )}
        </div>

        {/* action rapide */}
        <button
          onClick={quickAdd}
          className="absolute right-3 bottom-3 left-3 flex cursor-pointer items-center justify-center gap-2.5 bg-pine-900/95 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-linen-100 backdrop-blur-sm transition-all duration-400 ease-out hover:bg-clay-600 active:scale-[0.98] md:translate-y-[120%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <IconBag size={15} /> {listing.kind === "chambre" ? "Réserver" : "Demander"}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.24em] text-pine-500">
          <IconPin size={12} /> {listing.city} · {listing.type}
        </p>
        <Link
          to={detailPath}
          className="font-display mt-1 text-xl leading-snug font-semibold text-pine-900 transition-colors hover:text-clay-600"
        >
          {listing.name}
        </Link>
        <p className="mt-1 text-[15px] font-semibold text-clay-600">
          {fmtPrice(listing.price)} <span className="text-xs font-normal text-pine-500">{unitLabel[listing.priceUnit]}</span>
        </p>

        {listing.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-linen-300/60 pt-3">
            {listing.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full border border-linen-300 px-2.5 py-1 text-[10.5px] text-pine-600"
              >
                {a}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-[11px] text-pine-500">+{listing.amenities.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
