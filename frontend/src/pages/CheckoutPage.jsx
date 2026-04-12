import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getCarById, placeBid, purchaseCar } from "../services/api";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const carId = searchParams.get("carId");
  const checkoutType = searchParams.get("type") === "bid" ? "bid" : "buy";
  const requestedAmount = Number(searchParams.get("amount") || 0);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("review");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [receipt, setReceipt] = useState(null);
  const isDemoCar = typeof car?._id === "string" && car._id.startsWith("demo-");

  useEffect(() => {
    const loadCar = async () => {
      if (!carId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const carData = await getCarById(carId, token);
      setCar(carData || null);
      setLoading(false);
    };

    loadCar();
  }, [carId, token]);

  const finalAmount = checkoutType === "buy" ? car?.price || 0 : requestedAmount;
  const inspectionStatus = car?.status || (car?.verified ? "verified" : "pending");
  const documentStatus = car?.documentStatus || (inspectionStatus === "verified" ? "verified" : "pending");
  const availabilityStatus = car?.availabilityStatus || "available";
  const checkoutBlockedReason =
    documentStatus !== "verified"
      ? "This vehicle's documents have not been verified yet."
      : inspectionStatus !== "verified"
      ? "This vehicle has not been verified by an inspector yet."
      : availabilityStatus !== "available"
        ? `This vehicle is currently ${availabilityStatus} and cannot be checked out.`
        : "";

  const handleCheckout = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }

    if (!car) {
      setMessage("Car details are unavailable right now.");
      return;
    }

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      setMessage("Please provide a valid amount before continuing.");
      return;
    }

    if (checkoutBlockedReason) {
      setMessage(checkoutBlockedReason);
      return;
    }

    setMessage("");
    setStage("processing");

    try {
      const transaction = `CAR360-${Date.now()}`;
      const action = isDemoCar
        ? Promise.resolve({
            mode: "demo",
            amount: finalAmount,
          })
        : checkoutType === "buy"
          ? purchaseCar(car._id, token)
          : placeBid(car._id, Number(finalAmount), token);

      const [result] = await Promise.all([action, new Promise((resolve) => setTimeout(resolve, 2200))]);

      setReceipt({
        transaction,
        paymentMethod,
        result,
      });
      setStage("success");
    } catch (error) {
      setStage("review");
      setMessage(error.response?.data?.message || "Checkout could not be completed.");
    }
  };

  if (loading) {
    return (
      <div className="shell">
        <Loader lines={8} />
      </div>
    );
  }

  if (!carId || !car) {
    return (
      <div className="shell">
        <div className="panel p-8">
          <h1 className="text-3xl font-semibold">Checkout unavailable</h1>
          <p className="mt-4 muted">We could not find the vehicle you were trying to check out.</p>
          <Button as={Link} to="/browse" className="mt-6">
            Browse Cars
          </Button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="shell">
        <div className="panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Authentication Required</p>
          <h1 className="mt-3 text-3xl font-semibold">Login before continuing to checkout</h1>
          <p className="mt-4 muted">Your vehicle summary is ready. Sign in first, then return here to complete the flow.</p>
          <Button as={Link} to="/auth" className="mt-6">
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (stage === "processing") {
    return (
      <div className="shell">
        <div className="panel mx-auto max-w-3xl p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Processing</p>
          <h1 className="mt-3 text-3xl font-semibold">Completing your fake payment flow</h1>
          <div className="mx-auto mt-8 h-24 w-24 animate-pulse rounded-full border border-white/10 bg-gradient-to-r from-violet-600/30 to-blue-500/30" />
          <div className="mx-auto mt-8 max-w-md space-y-3 text-left">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-medium">Step 1</p>
              <p className="muted text-sm">Validating checkout amount for {car.title}.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-medium">Step 2</p>
              <p className="muted text-sm">Simulating payment authorization via {paymentMethod}.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="font-medium">Step 3</p>
              <p className="muted text-sm">
                {checkoutType === "buy" ? "Completing purchase order." : "Recording auction bid."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="shell">
        <div className="panel mx-auto max-w-4xl p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Success</p>
              <h1 className="mt-3 text-4xl font-semibold">
                {checkoutType === "buy" ? "Purchase completed successfully" : "Bid confirmed successfully"}
              </h1>
              <p className="mt-4 muted">
                {checkoutType === "buy"
                  ? "The temporary payment simulation is complete and your order has been placed."
                  : "The temporary payment simulation is complete and your bid has been placed."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm muted">Transaction ID</p>
                  <p className="mt-2 text-lg font-semibold">{receipt?.transaction}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm muted">Payment Method</p>
                  <p className="mt-2 text-lg font-semibold">{receipt?.paymentMethod}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm muted">Customer</p>
                  <p className="mt-2 text-lg font-semibold">{user.name}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm muted">Amount</p>
                  <p className="mt-2 text-lg font-semibold text-blue-400">{formatPrice(finalAmount)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button as={Link} to="/dashboard">
                  Open Dashboard
                </Button>
                <Button as={Link} to="/browse" variant="secondary">
                  Continue Browsing
                </Button>
              </div>

              {isDemoCar && (
                <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                  This success was completed in demo mode because the car came from fallback showcase data instead of the database.
                </div>
              )}
            </div>

            <div className="panel p-6">
              <img src={car.images?.[0]} alt={car.title} className="h-56 w-full rounded-3xl object-cover" />
              <h2 className="mt-5 text-2xl font-semibold">{car.title}</h2>
              <p className="mt-2 muted">
                {car.location} - {car.year} - {car.transmission}
              </p>
              <div className="mt-6 rounded-3xl bg-white/5 p-5">
                <p className="text-sm muted">Final Status</p>
                <p className="mt-2 text-lg font-semibold">
                  {checkoutType === "buy" ? "Paid and ordered" : "Bid submitted"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            {checkoutType === "buy" ? "Final Checkout" : "Bid Checkout"}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Review before you confirm</h1>
          <p className="mt-4 muted">
            {checkoutType === "buy"
              ? "Review your order, simulate payment, and confirm the purchase."
              : "Review your bid, simulate payment authorization, and confirm your auction entry."}
          </p>
        </div>

        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{car.title}</h2>
              <p className="mt-2 muted">
                {car.location} - {car.year} - {car.fuelType} - {car.transmission}
              </p>
            </div>
            <p className="text-3xl font-semibold text-blue-400">{formatPrice(finalAmount)}</p>
          </div>

          <img src={car.images?.[0]} alt={car.title} className="mt-6 h-72 w-full rounded-[2rem] object-cover" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm muted">Buyer</p>
              <p className="mt-2 text-lg font-semibold">{user.name}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm muted">Role</p>
              <p className="mt-2 text-lg font-semibold">{user.role}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm muted">Flow</p>
              <p className="mt-2 text-lg font-semibold">
                {checkoutType === "buy" ? "Direct purchase" : "Auction bid"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Payment Method</p>
          <div className="mt-5 grid gap-3">
            {["UPI", "Credit Card", "Net Banking"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  paymentMethod === method ? "border-blue-400 bg-blue-500/10" : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-semibold">{method}</p>
                <p className="mt-1 text-sm muted">Demo method for the fake payment experience.</p>
              </button>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Summary</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="muted">Base amount</span>
              <span>{formatPrice(finalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="muted">Platform fee</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="text-blue-400">{formatPrice(finalAmount)}</span>
            </div>
          </div>

          <Button onClick={handleCheckout} className="mt-6 w-full" disabled={Boolean(checkoutBlockedReason)}>
            {checkoutType === "buy" ? "Pay and Confirm Purchase" : "Pay and Place Bid"}
          </Button>
          <Button as={Link} to={`/cars/${car._id}`} variant="secondary" className="mt-3 w-full">
            Back to Car
          </Button>

          {message && (
            <div className="mt-4 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {message}
            </div>
          )}

          {checkoutBlockedReason && !message && (
            <div className="mt-4 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              {checkoutBlockedReason}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CheckoutPage;
