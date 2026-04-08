function FilterSidebar({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <aside className="panel h-fit space-y-5 p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Filters</p>
        <h3 className="mt-2 text-xl font-semibold">Refine Your Search</h3>
      </div>

      <label className="block space-y-2">
        <span className="text-sm muted">Brand</span>
        <select
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
        >
          <option value="">All brands</option>
          <option value="BMW">BMW</option>
          <option value="Tesla">Tesla</option>
          <option value="Audi">Audi</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm muted">Fuel Type</span>
        <select
          value={filters.fuelType}
          onChange={(e) => updateFilter("fuelType", e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
        >
          <option value="">Any fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={filters.isAuction}
          onChange={(e) => updateFilter("isAuction", e.target.checked)}
          className="h-4 w-4 rounded border-white/10"
        />
        Auction cars only
      </label>
    </aside>
  );
}

export default FilterSidebar;

