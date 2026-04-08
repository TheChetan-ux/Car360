import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getCarById, getHighestBid } from "../services/api";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [car, setCar] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [carData, highestBidData] = await Promise.all([getCarById(id), getHighestBid(id)]);
      setCar(carData);
      setHighestBid(highestBidData);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const openCheckout = (type, amount) => {
    const search = new URLSearchParams({
      type,
      carId: id,
      amount: String(amount),
    });

    navigate(`/checkout?${search.toString()}`);
  };

  const handleBuy = () => {
    if (!token) {
      setMessage("Login as a buyer to continue with purchase.");
      return;
    }

    if (!car) {
      setMessage("Car details are still loading.");
      return;
    }

    setMessage("");
    openCheckout("buy", car.price);
  };

  const handleBid = () => {
    if (!token) {
      setMessage("Login to place a bid.");
      return;
    }

    const normalizedAmount = Number(bidAmount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setMessage("Enter a valid bid amount before continuing.");
      return;
    }

    setMessage("");
    openCheckout("bid", normalizedAmount);
  };

  if (loading) {
    return (
      <div className="shell">
        <Loader lines={8} />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="shell">
        <div className="panel p-8">
          <h1 className="text-3xl font-semibold">Car not found</h1>
          <p className="mt-4 muted">This listing is unavailable right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="space-y-6">
        <div className="panel overflow-hidden">
          <img src={car.images?.[0]} alt={car.title} className="h-[420px] w-full object-cover" />
        </div>
        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{car.title}</h1>
              <p className="mt-2 muted">
                {car.location} - {car.year} - {car.transmission} - {car.fuelType}
              </p>
            </div>
            <p className="text-3xl font-semibold text-blue-400">{formatPrice(car.price)}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-lg font-semibold">{(car.mileage || 0).toLocaleString()} km</p>
              <p className="muted text-sm">Driven</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-lg font-semibold">{car.verified ? "Yes" : "Pending"}</p>
              <p className="muted text-sm">Verified</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-lg font-semibold">{car.status}</p>
              <p className="muted text-sm">Availability</p>
            </div>
          </div>

          <p className="mt-8 leading-7 muted">
            {car.description || "A carefully maintained used car with premium road presence and a clean ownership trail."}
          </p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Buy now</p>
          <h2 className="mt-2 text-2xl font-semibold">Checkout-ready flow</h2>
          <p className="mt-3 muted">Review the vehicle, run a fake payment flow, and then confirm the purchase.</p>
          <Button onClick={handleBuy} className="mt-6 w-full">
            Continue to Checkout
          </Button>
        </div>

        {car.isAuction && (
          <div className="panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Auction</p>
            <h2 className="mt-2 text-2xl font-semibold">Place your best bid</h2>
            <p className="mt-3 muted">
              Current highest bid: {highestBid?.amount ? formatPrice(highestBid.amount) : "No bids yet"}
            </p>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
            <Button onClick={handleBid} className="mt-4 w-full">
              Review Bid in Checkout
            </Button>
          </div>
        )}

        {message && <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">{message}</div>}
      </aside>
    </div>
  );
}

export default CarDetails;
