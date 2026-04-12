import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getPendingInspectionCars,
  rejectCarDocuments,
  rejectInspectionCar,
  verifyCarDocuments,
  verifyInspectionCar,
} from "../services/api";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function InspectorDashboard() {
  const { token, user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const loadPendingCars = async () => {
      if (!token || user?.role !== "inspector") {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getPendingInspectionCars(token);
        setCars(data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to load pending inspection cars.");
      } finally {
        setLoading(false);
      }
    };

    loadPendingCars();
  }, [token, user]);

  const handleInspectionDecision = async (carId, action) => {
    setActiveKey(`${carId}:inspection:${action}`);
    setMessage("");

    try {
      if (action === "verify") {
        await verifyInspectionCar(carId, token);
        setMessage("Car approved successfully.");
      } else {
        await rejectInspectionCar(carId, token);
        setMessage("Car rejected successfully.");
      }

      setCars((current) => current.filter((car) => car._id !== carId));
    } catch (error) {
      setMessage(error.response?.data?.message || "Inspection action could not be completed.");
    } finally {
      setActiveKey("");
    }
  };

  const handleDocumentDecision = async (carId, action) => {
    setActiveKey(`${carId}:documents:${action}`);
    setMessage("");

    try {
      const updatedCar =
        action === "verify"
          ? await verifyCarDocuments(carId, token)
          : await rejectCarDocuments(carId, token);

      setCars((current) => current.map((car) => (car._id === carId ? updatedCar : car)));
      setMessage(action === "verify" ? "Documents verified successfully." : "Documents rejected successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Document review could not be completed.");
    } finally {
      setActiveKey("");
    }
  };

  if (!token || !user) {
    return (
      <div className="shell">
        <div className="panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Inspector Access</p>
          <h1 className="mt-3 text-3xl font-semibold">Login to review pending vehicle inspections</h1>
          <p className="mt-4 muted">Only inspector accounts can approve or reject newly submitted listings.</p>
          <Button as={Link} to="/auth" className="mt-6">
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "inspector") {
    return (
      <div className="shell">
        <div className="panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Access Restricted</p>
          <h1 className="mt-3 text-3xl font-semibold">This dashboard is for inspectors only</h1>
          <p className="mt-4 muted">Your current role does not have permission to review pending vehicle inspections.</p>
          <Button as={Link} to="/dashboard" className="mt-6">
            Open Main Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="shell space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Inspector Dashboard</p>
        <h1 className="section-title mt-2">Pending vehicle reviews</h1>
        <p className="mt-3 muted">Review submitted listings, confirm the vehicle details, and decide whether they should go live in the marketplace.</p>
      </div>

      {message && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
          {message}
        </div>
      )}

      {loading ? (
        <Loader lines={6} />
      ) : cars.length === 0 ? (
        <div className="panel p-8">
          <h2 className="text-2xl font-semibold">No pending cars right now</h2>
          <p className="mt-3 muted">Once sellers add new listings, they will appear here for inspection.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {cars.map((car) => {
            const isBusy = activeKey.startsWith(`${car._id}:`);

            return (
              <article key={car._id} className="panel overflow-hidden">
                <img src={car.images?.[0]} alt={car.title} className="h-64 w-full object-cover" />
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{car.title}</h2>
                      <p className="mt-2 muted">
                        {car.location} - {car.year} - {car.fuelType}
                      </p>
                    </div>
                    <p className="text-xl font-semibold text-blue-400">{formatPrice(car.price)}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="font-semibold">{car.brand}</p>
                      <p className="muted text-xs">Brand</p>
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm muted">Inspection Status</p>
                      <p className="mt-2 font-semibold capitalize">{car.status}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm muted">Document Status</p>
                      <p className="mt-2 font-semibold capitalize">{car.documentStatus || "pending"}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["RC", car.documents?.rc],
                      ["Insurance", car.documents?.insurance],
                      ["ID Proof", car.documents?.idProof],
                    ].map(([label, href]) =>
                      href ? (
                        <Button
                          key={label}
                          as="a"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          variant="ghost"
                          className="w-full"
                        >
                          {label}
                        </Button>
                      ) : (
                        <div key={label} className="rounded-full border border-white/10 px-4 py-3 text-center text-sm muted">
                          {label} Missing
                        </div>
                      )
                    )}
                  </div>

                  <p className="leading-7 muted">
                    {car.description || "No additional description was provided with this listing."}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleDocumentDecision(car._id, "verify")}
                      disabled={isBusy || car.documentStatus === "verified"}
                    >
                      Verify Documents
                    </Button>
                    <Button
                      onClick={() => handleDocumentDecision(car._id, "reject")}
                      variant="secondary"
                      disabled={isBusy || car.documentStatus === "rejected"}
                    >
                      Reject Documents
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleInspectionDecision(car._id, "verify")}
                      disabled={isBusy || car.documentStatus !== "verified"}
                    >
                      Approve Inspection
                    </Button>
                    <Button
                      onClick={() => handleInspectionDecision(car._id, "reject")}
                      variant="secondary"
                      disabled={isBusy}
                    >
                      Reject Inspection
                    </Button>
                    <Button as={Link} to={`/cars/${car._id}`} variant="ghost">
                      View Details
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InspectorDashboard;
