import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductVisual from "../components/ProductVisual";
import TelegramLink from "../components/TelegramLink";
import { categories, products } from "../data/catalog";
import { catering, rental } from "../data/site";
import useTitle from "../useTitle";

export default function Home() {
  useTitle("Кальяны и комплектующие");
  const featured = products.filter((product) => product.featured);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Lounge54</p>
            <h1>Кальяны и комплектующие</h1>
            <p className="lead">
              Готовые наборы и отдельные детали: чаши, калауды, колбы, шахты и сетки. Покупка, кейтеринг и
              аренда оформляются в Telegram.
            </p>
            <div className="page-actions">
              <Link className="button" to="/catalog">
                Открыть каталог
              </Link>
              <TelegramLink className="button button-ghost" text="Хочу купить кальян Lounge54">
                Купить в Telegram
              </TelegramLink>
            </div>
          </div>
          <ProductVisual category="hookah" />
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2 className="section-title">Категории</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.id} to={`/catalog/${category.id}`} className="category-tile">
                <ProductVisual category={category.id} />
                <span>{category.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2 className="section-title">В каталоге</h2>
          <div className="card-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} titleLevel="h3" />
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2 className="section-title">Услуги</h2>
          <div className="service-grid">
            <Link to="/catering" className="service-card">
              <p className="eyebrow">Выезд</p>
              <h3>{catering.title}</h3>
              <p>{catering.lead}</p>
            </Link>
            <Link to="/rental" className="service-card">
              <p className="eyebrow">На время</p>
              <h3>{rental.title}</h3>
              <p>{rental.lead}</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
