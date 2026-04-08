import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import { getCars } from "../services/api";

function AuctionPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const loadAuctionCars = async () => {
      const data = await getCars({ isAuction: true });
      setCars(data.filter((car) => car.isAuction));
    };

    loadAuctionCars();
  }, []);

  return (
    <div className="shell space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Live auctions</p>
        <h1 className="section-title mt-2">Compete for standout inventory</h1>
        <p className="mt-3 muted">Browse active auction listings and open a car page to place your bids.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
}

export default AuctionPage;

