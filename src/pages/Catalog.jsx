import { NavLink, useParams } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import ProductCard from "../components/ProductCard";
import { categories, getCategory, getProducts, hookahSet } from "../data/catalog";
import useTitle from "../useTitle";

export default function Catalog() {
  const { category: categoryId } = useParams();
  const category = categoryId ? getCategory(categoryId) : null;
  const known = !categoryId || Boolean(category);
  const list = known ? getProducts(category?.id) : [];

  useTitle(category ? category.title : "Каталог");

  return (
    <section className="page">
      <div className="wrap">
        <PageIntro
          eyebrow="Каталог"
          title={category ? category.title : "Все позиции"}
          lead={
            category
              ? category.lead
              : "Кальяны и отдельные детали. Цены на карточках — заглушки, заказ уходит в Telegram."
          }
        />
        <div className="chips">
          <NavLink to="/catalog" end className={({ isActive }) => (isActive ? "chip chip-active" : "chip")}>
            Все
          </NavLink>
          {categories.map((item) => (
            <NavLink
              key={item.id}
              to={`/catalog/${item.id}`}
              className={({ isActive }) => (isActive ? "chip chip-active" : "chip")}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        {category?.id === "hookah" ? (
          <p className="set-note">В каждый набор входит: {hookahSet.join(", ")}.</p>
        ) : null}
        {!known ? <p className="empty">Такой категории нет. Выберите раздел выше.</p> : null}
        {known && list.length === 0 ? <p className="empty">В этой категории пока пусто.</p> : null}
        {known ? (
          <div className="card-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
