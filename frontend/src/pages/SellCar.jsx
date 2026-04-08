import { useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { createCar } from "../services/api";

const initialState = {
  title: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  location: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  mileage: "",
  images: "",
  description: "",
  isAuction: false,
};

function SellCar() {
  const { token, user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login as a seller, dealer, or admin to create a listing.");
      return;
    }

    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      images: form.images.split(",").map((item) => item.trim()).filter(Boolean),
    };

    await createCar(payload, token);
    setMessage("Listing created successfully.");
    setForm(initialState);
  };

  return (
    <div className="shell grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Seller suite</p>
        <h1 className="section-title">Create a premium listing</h1>
        <p className="muted">
          Sellers and dealers can launch direct-sale or auction-ready car listings with structured specs and image URLs.
        </p>
        <div className="panel p-5">
          <p className="text-sm muted">Current role</p>
          <p className="mt-2 text-xl font-semibold">{user?.role || "Guest"}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="panel grid gap-4 p-6 sm:grid-cols-2">
        {[
          ["title", "Listing title"],
          ["brand", "Brand"],
          ["model", "Model"],
          ["year", "Year"],
          ["price", "Price"],
          ["location", "Location"],
          ["mileage", "Mileage"],
          ["images", "Image URLs (comma separated)"],
        ].map(([key, label]) => (
          <label key={key} className={key === "images" ? "sm:col-span-2" : ""}>
            <span className="mb-2 block text-sm muted">{label}</span>
            <input
              required={key !== "images"}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>
        ))}

        <label>
          <span className="mb-2 block text-sm muted">Transmission</span>
          <select
            value={form.transmission}
            onChange={(e) => updateField("transmission", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm muted">Fuel Type</span>
          <select
            value={form.fuelType}
            onChange={(e) => updateField("fuelType", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          >
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm muted">Description</span>
          <textarea
            rows="5"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
        </label>

        <label className="sm:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isAuction}
            onChange={(e) => updateField("isAuction", e.target.checked)}
          />
          Create as auction listing
        </label>

        <div className="sm:col-span-2">
          <Button type="submit">Publish Listing</Button>
        </div>

        {message && <p className="sm:col-span-2 text-sm text-blue-300">{message}</p>}
      </form>
    </div>
  );
}

export default SellCar;

