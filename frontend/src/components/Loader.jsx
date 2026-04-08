function Loader({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-5 animate-pulse rounded-full bg-white/10" />
      ))}
    </div>
  );
}

export default Loader;
