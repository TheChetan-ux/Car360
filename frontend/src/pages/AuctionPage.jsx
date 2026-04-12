import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getCars } from "../services/api";

function AuctionPage() {
  const { token } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuctionCars = async () => {
      setLoading(true);
      const data = await getCars({ isAuction: true }, token);
      setCars(data.filter((car) => car.isAuction));
      setLoading(false);
    };

    loadAuctionCars();
  }, [token]);

  return (
    <div className="shell space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Live auctions</p>
        <h1 className="section-title mt-2">Compete for standout inventory</h1>
        <p className="mt-3 muted">Browse active auction listings and open a car page to place your bids.</p>
      </div>

      {loading ? (
        <Loader lines={6} />
      ) : cars.length === 0 ? (
        <div className="panel p-8">
          <h2 className="text-2xl font-semibold">No auction cars available</h2>
          <p className="mt-3 muted">Auction listings will appear here after they clear inspection and are published.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AuctionPage;
