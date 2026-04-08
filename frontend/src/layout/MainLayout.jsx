import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
