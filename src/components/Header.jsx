import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { categories, searchProducts } from "../data/catalog";
import { BurgerIcon, MoonIcon, SearchIcon, SunIcon, TelegramIcon } from "./icons";
import TelegramLink from "./TelegramLink";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");

  const results = searchProducts(query).slice(0, 8);

  useEffect(() => {
    setCatalogOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!event.target.closest(".site-header")) {
        setCatalogOpen(false);
        setSearchOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setCatalogOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("lounge54-theme", next);
    setTheme(next);
  }

  function onSearchSubmit(event) {
    event.preventDefault();
    if (!results[0]) return;
    navigate(`/product/${results[0].id}`);
  }

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="logo" aria-label="Lounge54, на главную">
          <span className="logo-mark">54</span>
          <span className="logo-word">Lounge54</span>
        </Link>

        <button
          className="catalog-toggle"
          type="button"
          aria-expanded={catalogOpen}
          aria-controls="catalog-menu"
          onClick={() => {
            setCatalogOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          <BurgerIcon open={catalogOpen} />
          Каталог
        </button>

        <NavLink to="/brand" className={({ isActive }) => (isActive ? "brand-link active" : "brand-link")}>
          О бренде
        </NavLink>

        <form className="search" role="search" onSubmit={onSearchSubmit}>
          <label className="sr-only" htmlFor="site-search">
            Поиск
          </label>
          <SearchIcon />
          <input
            id="site-search"
            className="search-input"
            placeholder="Я ищу..."
            value={query}
            autoComplete="off"
            aria-expanded={searchOpen && query.trim().length > 0}
            aria-controls="search-results"
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
              setCatalogOpen(false);
            }}
            onFocus={() => {
              setSearchOpen(true);
              setCatalogOpen(false);
            }}
          />
          {searchOpen && query.trim() ? (
            results.length > 0 ? (
              <ul className="search-panel" id="search-results">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link to={`/product/${item.id}`}>
                      <span>{item.name}</span>
                      <small>{categories.find((category) => category.id === item.category)?.title}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="search-panel search-empty" id="search-results">
                Ничего не нашлось
              </p>
            )
          ) : null}
        </form>

        <TelegramLink className="icon-button header-tg" aria-label="Написать в Telegram">
          <TelegramIcon />
        </TelegramLink>

        <button
          className="icon-button header-theme"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {catalogOpen ? (
        <div className="catalog-panel" id="catalog-menu">
          <div className="wrap">
            <div className="catalog-panel-grid">
              {categories.map((category) => {
                const active = location.pathname === `/catalog/${category.id}`;
                return (
                  <Link
                    key={category.id}
                    to={`/catalog/${category.id}`}
                    className={active ? "catalog-link active" : "catalog-link"}
                    onClick={() => setCatalogOpen(false)}
                  >
                    <span className="catalog-link-title">{category.title}</span>
                    <span className="catalog-link-text">{category.menuText}</span>
                  </Link>
                );
              })}
            </div>
            <Link className="catalog-all" to="/catalog" onClick={() => setCatalogOpen(false)}>
              Весь каталог
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
