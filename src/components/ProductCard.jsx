import { Link } from "react-router-dom";
import { getCategory } from "../data/catalog";
import Price from "./Price";
import ProductVisual from "./ProductVisual";
import TelegramLink from "./TelegramLink";

export default function ProductCard({ product, titleLevel = "h2" }) {
  const Title = titleLevel;
  const category = getCategory(product.category);

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-media">
          <ProductVisual category={product.category} />
        </div>
        <div className="card-body">
          <p className="card-kicker">{category?.title}</p>
          <Title className="card-title">{product.name}</Title>
          <p className="card-text">{product.summary}</p>
          {product.set ? (
            <ul className="set-list">
              {product.set.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <Price product={product} />
        </div>
      </Link>
      <div className="card-actions">
        <TelegramLink className="button" text={`Хочу купить: ${product.name}`}>
          Купить в Telegram
        </TelegramLink>
      </div>
    </article>
  );
}
