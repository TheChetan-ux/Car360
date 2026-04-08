import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [message, setMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="shell grid min-h-[70vh] place-items-center">
      <div className="panel w-full max-w-xl p-8">
        <div className="mb-8 flex rounded-full bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "login" ? "bg-white/10" : ""}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "register" ? "bg-white/10" : ""}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <label className="block">
              <span className="mb-2 block text-sm muted">Full Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm muted">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm muted">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>

          {mode === "register" && (
            <label className="block">
              <span className="mb-2 block text-sm muted">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="dealer">Dealer</option>
              </select>
            </label>
          )}

          <Button type="submit" className="w-full">
            {mode === "login" ? "Continue" : "Create Account"}
          </Button>

          {message && <p className="text-sm text-rose-300">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AuthPage;

