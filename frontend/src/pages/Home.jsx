import { Link } from "react-router-dom";
import Button from "../components/Button";
import CarCard from "../components/CarCard";
import fallbackCars from "../data/fallbackCars";

function Home() {
  return (
    <div className="space-y-24">
      <section className="shell">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-cover bg-center px-6 py-20 sm:px-10 lg:px-16"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(2, 6, 23, 0.78), rgba(49, 46, 129, 0.48)), url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80)",
          }}
        >
          <div className="max-w-3xl animate-fadeIn space-y-7">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
              Premium used car marketplace
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
              Buy, sell, and auction remarkable cars with confidence.
            </h1>
            <p className="max-w-2xl text-lg muted">
              Car360 gives buyers a premium browsing experience while helping sellers and dealers manage trusted listings with real backend functionality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button as={Link} to="/browse">
                Explore Cars
              </Button>
              <Button as={Link} to="/sell" variant="secondary">
                List Your Car
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="shell space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Featured fleet</p>
            <h2 className="section-title">Curated inventory for modern buyers</h2>
          </div>
          <Link to="/browse" className="muted text-sm hover:text-white">
            View all cars
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {fallbackCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>

      <section className="shell">
        <div className="panel relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-blue-500/10" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Seller tools</p>
              <h2 className="section-title mt-3">Launch a polished listing in minutes</h2>
              <p className="mt-4 muted">
                From direct sales to live auction-ready listings, Car360 gives dealers and private sellers a clean workflow with role-based dashboards.
              </p>
            </div>
            <Button as={Link} to="/dashboard">
              Open Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

