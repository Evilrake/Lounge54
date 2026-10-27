import { Link, useParams } from "react-router-dom";
import Price from "../components/Price";
import ProductVisual from "../components/ProductVisual";
import TelegramLink from "../components/TelegramLink";
import { getCategory, getProduct } from "../data/catalog";
import useTitle from "../useTitle";

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  const category = product ? getCategory(product.category) : null;
  useTitle(product ? product.name : "Товар");

  if (!product) {
    return (
      <section className="page">
        <div className="wrap page-intro">
          <h1>Товар не найден</h1>
          <p className="lead">Такой позиции в каталоге нет.</p>
          <div className="page-actions">
            <Link className="button" to="/catalog">
              В каталог
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="wrap product-layout">
        <ProductVisual category={product.category} />
        <div className="product-info">
          <Link className="back-link" to={`/catalog/${product.category}`}>
            {category?.title}
          </Link>
          <h1>{product.name}</h1>
          <Price product={product} />
          <p className="lead">{product.description}</p>
          {product.specs?.length ? (
            <ul className="specs">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          ) : null}
          {product.set ? (
            <div className="set-block">
              <h2>Что входит в набор</h2>
              <ul className="set-list">
                {product.set.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <TelegramLink className="button" text={`Хочу купить: ${product.name}`}>
            Купить в Telegram
          </TelegramLink>
        </div>
      </div>
    </section>
  );
}
