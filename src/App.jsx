import { BrowserRouter, Route, Routes } from "react-router-dom";
import AgeGate from "./components/AgeGate";
import Layout from "./components/Layout";
import Brand from "./pages/Brand";
import Catalog from "./pages/Catalog";
import Catering from "./pages/Catering";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Rental from "./pages/Rental";

export default function App() {
  return (
    <BrowserRouter>
      <AgeGate />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:category" element={<Catalog />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="brand" element={<Brand />} />
          <Route path="catering" element={<Catering />} />
          <Route path="rental" element={<Rental />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
