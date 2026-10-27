import { Link } from "react-router-dom";
import { categories } from "../data/catalog";
import { telegramUrl } from "../data/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="logo-word">Lounge54</p>
          <p>Витрина для посетителей старше 18 лет. Заказ оформляется в Telegram.</p>
        </div>
        <nav aria-label="Категории">
          <p className="footer-label">Каталог</p>
          {categories.map((category) => (
            <Link key={category.id} to={`/catalog/${category.id}`}>
              {category.title}
            </Link>
          ))}
        </nav>
        <nav aria-label="Страницы">
          <p className="footer-label">Ещё</p>
          <Link to="/brand">О бренде</Link>
          <Link to="/catering">Кейтеринг</Link>
          <Link to="/rental">Аренда</Link>
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </nav>
      </div>
      <div className="wrap footer-note">Цены на витрине — временные заглушки.</div>
    </footer>
  );
}
