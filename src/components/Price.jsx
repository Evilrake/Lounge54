import { formatPrice } from "../data/catalog";

export default function Price({ product }) {
  return (
    <p className="price">
      <span>{formatPrice(product.price)}</span>
      {product.priceIsPlaceholder ? <span className="placeholder-tag">заглушка</span> : null}
    </p>
  );
}
