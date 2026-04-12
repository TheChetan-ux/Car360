import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboard, getBuyerDashboard, getSellerDashboard } from "../services/api";

function Dashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token || !user) return;
      setLoading(true);

      if (user.role === "buyer") {
        setData(await getBuyerDashboard(token));
      } else if (user.role === "admin") {
        setData(await getAdminDashboard(token));
      } else if (user.role === "inspector") {
        setData(null);
      } else {
        setData(await getSellerDashboard(token));
      }

      setLoading(false);
    };

    loadDashboard();
  }, [token, user]);

  if (!token || !user) {
    return (
      <div className="shell">
        <div className="panel p-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-4 muted">Login to view role-based dashboard data for buyers, sellers, dealers, admins, or inspectors.</p>
        </div>
      </div>
    );
  }

  if (user.role === "inspector") {
    return <Navigate to="/inspector" replace />;
  }

  return (
    <div className="shell space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Role dashboard</p>
        <h1 className="section-title mt-2">Welcome back, {user.name}</h1>
        <p className="mt-3 muted">Your current role is {user.role}. The panels below adapt to your permissions.</p>
      </div>

      {loading ? (
        <Loader lines={8} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {user.role === "buyer" && (
            <>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">Orders</h2>
                <p className="mt-4 text-4xl font-semibold text-blue-400">{data?.orders?.length || 0}</p>
                <p className="mt-2 muted">Completed purchases</p>
              </div>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">Bids</h2>
                <p className="mt-4 text-4xl font-semibold text-violet-300">{data?.bids?.length || 0}</p>
                <p className="mt-2 muted">Auction bids placed</p>
              </div>
            </>
          )}

          {(user.role === "seller" || user.role === "dealer") && (
            <>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">Listings</h2>
                <p className="mt-4 text-4xl font-semibold text-blue-400">{data?.totalListings || 0}</p>
                <p className="mt-2 muted">Cars you currently manage</p>
              </div>
              <div className="panel p-6">
                <h2 className="text-xl font-semibold">Latest Cars</h2>
                <div className="mt-4 space-y-3">
                  {(data?.cars || []).slice(0, 3).map((car) => (
                    <div key={car._id} className="rounded-2xl bg-white/5 p-3">
                      <p className="font-medium">{car.title}</p>
                      <p className="muted text-sm capitalize">
                        {car.documentStatus || "pending"} documents | {car.status} inspection | {car.availabilityStatus || "available"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {user.role === "admin" && (
            <>
              {[
                ["Users", data?.users || 0],
                ["Cars", data?.cars || 0],
                ["Bids", data?.bids || 0],
                ["Orders", data?.orders || 0],
              ].map(([label, value]) => (
                <div key={label} className="panel p-6">
                  <h2 className="text-xl font-semibold">{label}</h2>
                  <p className="mt-4 text-4xl font-semibold text-blue-400">{value}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
