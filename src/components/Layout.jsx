import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
