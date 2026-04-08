import { Link } from "react-router-dom";
import Button from "../components/Button";

function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center">
      <div className="panel max-w-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold">This road ends here.</h1>
        <p className="mt-4 muted">The page you are looking for does not exist yet or has been moved.</p>
        <Button as={Link} to="/" className="mt-6">
          Back Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
