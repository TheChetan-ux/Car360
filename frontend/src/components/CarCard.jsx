import { Link } from "react-router-dom";
import Button from "./Button";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function CarCard({ car }) {
  return (
    <article className="panel group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-60 overflow-hidden">
        <img
          src={car.images?.[0]}
          alt={car.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {car.verified && (
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
              Verified
            </span>
          )}
          {car.isAuction && (
            <span className="rounded-full bg-violet-600/90 px-3 py-1 text-xs font-semibold text-white">
              Auction
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{car.title}</h3>
            <p className="muted text-sm">
              {car.location} • {car.year}
            </p>
          </div>
          <p className="text-lg font-semibold text-blue-400">{formatPrice(car.price)}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="font-semibold">{car.fuelType}</p>
            <p className="muted text-xs">Fuel</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="font-semibold">{car.transmission}</p>
            <p className="muted text-xs">Gearbox</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="font-semibold">{(car.mileage || 0).toLocaleString()}</p>
            <p className="muted text-xs">Km</p>
          </div>
        </div>

        <Button as={Link} to={`/cars/${car._id}`} className="w-full">
          View Details
        </Button>
      </div>
    </article>
  );
}

export default CarCard;

