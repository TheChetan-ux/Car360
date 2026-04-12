import { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getCars } from "../services/api";

function BrowseCars() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    isAuction: false,
  });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      const data = await getCars({
        ...filters,
        isAuction: filters.isAuction || undefined,
      }, token);
      setCars(data);
      setLoading(false);
    };

    loadCars();
  }, [filters, token]);

  return (
    <div className="shell grid gap-8 lg:grid-cols-[280px,1fr]">
      <FilterSidebar filters={filters} setFilters={setFilters} />

      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Marketplace</p>
          <h1 className="section-title mt-2">Find your next car</h1>
          <p className="mt-3 muted">Browse verified listings, compare specs, and jump into direct buy or auction flow.</p>
        </div>

        {loading ? (
          <Loader lines={6} />
        ) : cars.length === 0 ? (
          <div className="panel p-8">
            <h2 className="text-2xl font-semibold">No cars match this view</h2>
            <p className="mt-3 muted">Verified marketplace listings will appear here once they pass inspection or once your filters are adjusted.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BrowseCars;
