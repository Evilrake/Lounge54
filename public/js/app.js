const state = { data: null, catalogOpen: false, query: "", searchOpen: false, buyNotice: null };

const visuals = {
  hookah: `<path d="M58 22c10 8 12 16 8 26H46c-3-10 0-18 12-26Z" fill="currentColor" fill-opacity="0.14"/><path d="M40 48h36M58 48v16M30 64h56M58 64v24"/><path d="M38 112c0-16 8-26 20-26s20 10 20 26c0 14-8 26-20 26s-20-12-20-26Z" fill="currentColor" fill-opacity="0.14"/><path d="M78 74c18 2 26 14 28 32M106 106v10"/>`,
  bowls: `<path d="M34 58h52l-8 42c-2 16-10 26-18 26s-16-10-18-26L34 58Zm8 0c2-14 8-22 18-22s16 8 18 22" fill="currentColor" fill-opacity="0.14"/>`,
  kalouds: `<circle cx="60" cy="78" r="30" fill="currentColor" fill-opacity="0.14"/><circle cx="60" cy="78" r="30"/><path d="M60 48v60M30 78h60M40 58l40 40M40 98 80 58"/><circle cx="60" cy="78" r="8"/>`,
  flasks: `<path d="M48 28h24v20c16 8 24 24 24 42 0 24-14 40-36 40S24 114 24 90c0-18 8-34 24-42V28Z" fill="currentColor" fill-opacity="0.14"/>`,
  shafts: `<rect x="48" y="18" width="24" height="124" rx="12" fill="currentColor" fill-opacity="0.14"/><path d="M44 36h32M44 124h32"/>`,
  meshes: `<circle cx="60" cy="80" r="34" fill="currentColor" fill-opacity="0.14"/><circle cx="60" cy="80" r="34"/><path d="M34 62h52M34 80h52M34 98h52M46 46v68M60 46v68M74 46v68"/>`,
};

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function money(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function visual(category) {
  return `<div class="visual">${svg(category)}</div>`;
}

function svg(category) {
  return `<svg viewBox="0 0 120 160" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${visuals[category] || visuals.hookah}</svg>`;
}

function media(product, large) {
  if (product.imageUrl) {
    return `<img class="photo${large ? " large" : ""}" src="${esc(product.imageUrl)}" alt="">`;
  }
  return visual(product.category);
}

function stockLabel(product) {
  if (product.inStock) return `<p class="stock-ok">В наличии: ${product.qty}</p>`;
  return `<p class="stock-out">Нет в наличии</p>`;
}

function priceBlock(product) {
  return `<p class="price"><span>${money(product.price)}</span>${product.priceIsPlaceholder ? '<span class="placeholder-tag">заглушка</span>' : ""}</p>`;
}

function route() {
  const url = new URL(location.href);
  const parts = url.pathname.split("/").filter(Boolean);
  return { parts, params: url.searchParams };
}

function go(href) {
  history.pushState(null, "", href);
  state.catalogOpen = false;
  state.searchOpen = false;
  state.query = "";
  state.buyNotice = null;
  paint();
  window.scrollTo(0, 0);
}

function telegram(text) {
  const base = state.data.pages.telegramUrl;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

async function load() {
  const response = await fetch("/api/bootstrap");
  state.data = await response.json();
  paint();
}

function paint() {
  paintAge();
  paintHeader();
  paintPage();
  paintFooter();
}

function paintAge() {
  const root = document.getElementById("age");
  if (localStorage.getItem("lounge54-age") === "yes") {
    root.innerHTML = "";
    document.body.style.overflow = "";
    return;
  }
  document.body.style.overflow = "hidden";
  const denied = localStorage.getItem("lounge54-age") === "no";
  root.innerHTML = `<div class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
    <div class="age-card">
      <p class="eyebrow">18+</p>
      <h2 id="age-title">Вам уже есть 18 лет?</h2>
      <p class="card-text">Lounge54 показывает кальяны и комплектующие. Витрина открыта для посетителей старше 18 лет.</p>
      ${denied ? "<p class=\"card-text\">Посмотреть витрину можно с 18 лет. Если возраст указан по ошибке, подтвердите его ниже.</p>" : ""}
      <div class="age-actions">
        <button class="button" type="button" data-age="yes">Да, мне есть 18 лет</button>
        <button class="button button-ghost" type="button" data-age="no">Мне меньше 18</button>
      </div>
    </div>
  </div>`;
}

function paintHeader() {
  const { parts } = route();
  const onBrand = parts[0] === "brand";
  const results = searchProducts(state.query).slice(0, 8);
  const panel = state.searchOpen && state.query.trim()
    ? results.length
      ? `<ul class="search-panel" id="search-results">${results.map((item) => `<li><a href="/product/${esc(item.id)}"><span>${esc(item.name)}</span><small>${esc(item.categoryTitle)}</small></a></li>`).join("")}</ul>`
      : `<p class="search-panel search-empty" id="search-results">Ничего не нашлось</p>`
    : "";
  document.getElementById("header").innerHTML = `<div class="wrap header-inner">
      <a class="logo" href="/" aria-label="Lounge54, на главную"><span class="logo-mark">54</span><span class="logo-word">Lounge54</span></a>
      <button class="catalog-toggle" type="button" aria-expanded="${state.catalogOpen}" aria-controls="catalog-menu">${burger(state.catalogOpen)} Каталог</button>
      <a class="brand-link${onBrand ? " active" : ""}" href="/brand">О бренде</a>
      <form class="search" role="search">
        <label class="sr-only" for="site-search">Поиск</label>
        ${searchIcon()}
        <input id="site-search" class="search-input" placeholder="Я ищу..." value="${esc(state.query)}" autocomplete="off">
        ${panel}
      </form>
      <a class="icon-button header-tg" href="${esc(state.data.pages.telegramUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">${telegramIcon()}</a>
      <button class="icon-button header-theme" type="button" aria-label="${document.documentElement.dataset.theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}">${document.documentElement.dataset.theme === "dark" ? sun() : moon()}</button>
    </div>
    ${state.catalogOpen ? `<div class="catalog-panel" id="catalog-menu"><div class="wrap"><div class="catalog-panel-grid">${state.data.categories.map((category) => `<a class="catalog-link${location.pathname === `/catalog/${category.id}` ? " active" : ""}" href="/catalog/${esc(category.id)}"><span class="catalog-link-title">${esc(category.title)}</span><span class="catalog-link-text">${esc(category.menuText)}</span></a>`).join("")}</div><a class="catalog-all" href="/catalog">Весь каталог</a></div></div>` : ""}`;
  const input = document.getElementById("site-search");
  if (state.searchOpen) {
    input.focus();
    const length = input.value.length;
    input.setSelectionRange(length, length);
  }
}

function paintFooter() {
  document.getElementById("footer").innerHTML = `<div class="wrap footer-grid">
      <div class="footer-brand"><p class="logo-word">Lounge54</p><p>Витрина для посетителей старше 18 лет. Заказ оформляется в Telegram.</p></div>
      <nav aria-label="Категории"><p class="footer-label">Каталог</p>${state.data.categories.map((category) => `<a href="/catalog/${esc(category.id)}">${esc(category.title)}</a>`).join("")}</nav>
      <nav aria-label="Страницы"><p class="footer-label">Ещё</p><a href="/brand">О бренде</a><a href="/catering">Кейтеринг</a><a href="/rental">Аренда</a><a href="${esc(state.data.pages.telegramUrl)}" target="_blank" rel="noopener noreferrer">Telegram</a><a href="/admin.html">Админка</a></nav>
    </div>
    <div class="wrap footer-note">Цены на витрине — временные заглушки. Наличие берётся из таблицы Excel.</div>`;
}

function paintPage() {
  const { parts, params } = route();
  const app = document.getElementById("app");
  let title = "Кальяны и комплектующие";
  if (!parts.length) app.innerHTML = home();
  else if (parts[0] === "catalog") {
    const category = state.data.categories.find((item) => item.id === parts[1]);
    title = category ? category.title : "Каталог";
    app.innerHTML = parts[1] && !category ? notFound("Такой категории нет") : catalog(category, params);
  } else if (parts[0] === "product") {
    const product = state.data.products.find((item) => item.id === parts[1]);
    title = product ? product.name : "Товар";
    app.innerHTML = product ? productPage(product) : notFound("Такой позиции в каталоге нет");
  } else if (parts[0] === "brand") {
    const brand = state.data.brands.find((item) => item.id === parts[1]);
    title = brand ? brand.name : "О бренде";
    app.innerHTML = brandsPage(brand);
  } else if (parts[0] === "catering") {
    title = state.data.pages.catering.title;
    app.innerHTML = servicePage(state.data.pages.catering);
  } else if (parts[0] === "rental") {
    title = state.data.pages.rental.title;
    app.innerHTML = servicePage(state.data.pages.rental);
  } else {
    title = "Страница не найдена";
    app.innerHTML = notFound("Такого адреса на витрине нет");
  }
  document.title = `${title} — Lounge54`;
}

function home() {
  const featured = state.data.products.filter((product) => product.featured);
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-copy">
        <p class="eyebrow">Lounge54</p>
        <h1>Кальяны и комплектующие</h1>
        <p class="lead">Готовые наборы и отдельные детали: чаши, калауды, колбы, шахты и сетки. Покупка, кейтеринг и аренда оформляются в Telegram.</p>
        <div class="page-actions"><a class="button" href="/catalog">Открыть каталог</a><a class="button button-ghost" href="${esc(telegram("Хочу купить кальян Lounge54"))}" target="_blank" rel="noopener noreferrer">Купить в Telegram</a></div>
      </div>${visual("hookah")}</div></section>
    <section class="block"><div class="wrap"><h2 class="section-title">Категории</h2><div class="category-grid">${state.data.categories.map((category) => `<a class="category-tile" href="/catalog/${esc(category.id)}">${visual(category.id)}<span>${esc(category.title)}</span></a>`).join("")}</div></div></section>
    <section class="block"><div class="wrap"><h2 class="section-title">В каталоге</h2><div class="card-grid">${featured.map((product) => card(product, "h3")).join("")}</div></div></section>
    <section class="block"><div class="wrap"><h2 class="section-title">Услуги</h2><div class="service-grid">
        <a class="service-card" href="/catering"><p class="eyebrow">Выезд</p><h3>${esc(state.data.pages.catering.title)}</h3><p>${esc(state.data.pages.catering.lead)}</p></a>
        <a class="service-card" href="/rental"><p class="eyebrow">На время</p><h3>${esc(state.data.pages.rental.title)}</h3><p>${esc(state.data.pages.rental.lead)}</p></a>
      </div></div></section>`;
}

function catalog(category, params) {
  const q = (params.get("q") || "").trim().toLowerCase();
  const brand = params.get("brand") || "";
  const sort = params.get("sort") || "";
  let list = state.data.products.filter((product) => !category || product.category === category.id);
  if (brand) list = list.filter((product) => product.brandId === brand);
  if (q) {
    list = list.filter((product) => `${product.name} ${product.categoryTitle} ${product.brandName}`.toLowerCase().includes(q));
  }
  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "brand") return a.brandName.localeCompare(b.brandName, "ru") || a.name.localeCompare(b.name, "ru");
    if (sort === "name") return a.name.localeCompare(b.name, "ru");
    return 0;
  });
  const base = category ? `/catalog/${category.id}` : "/catalog";
  return `<section class="page"><div class="wrap">
      <header class="page-intro"><p class="eyebrow">Каталог</p><h1>${esc(category ? category.title : "Все позиции")}</h1><p class="lead">${esc(category ? category.lead : "Кальяны и отдельные детали. Цены на карточках — заглушки, наличие приходит из таблицы Excel.")}</p></header>
      <div class="chips"><a class="chip${category ? "" : " chip-active"}" href="/catalog">Все</a>${state.data.categories.map((item) => `<a class="chip${category?.id === item.id ? " chip-active" : ""}" href="/catalog/${esc(item.id)}">${esc(item.title)}</a>`).join("")}</div>
      <form class="toolbar" data-catalog-form data-base="${esc(base)}">
        <input name="q" value="${esc(params.get("q") || "")}" placeholder="Поиск по каталогу" aria-label="Поиск по каталогу">
        <select name="brand" aria-label="Бренд">${brandOptions(brand)}</select>
        <select name="sort" aria-label="Сортировка">
          <option value=""${sort === "" ? " selected" : ""}>Порядок каталога</option>
          <option value="price-asc"${sort === "price-asc" ? " selected" : ""}>Сначала дешевле</option>
          <option value="price-desc"${sort === "price-desc" ? " selected" : ""}>Сначала дороже</option>
          <option value="brand"${sort === "brand" ? " selected" : ""}>По бренду</option>
          <option value="name"${sort === "name" ? " selected" : ""}>По названию</option>
        </select>
      </form>
      ${category?.id === "hookah" ? `<p class="set-note">В каждый набор входит: шахта, колба, шланг, чаша, блюдце, щипцы, мундштук.</p>` : ""}
      ${list.length ? `<div class="card-grid">${list.map((product) => card(product)).join("")}</div>` : `<p class="empty">По этому запросу ничего нет.</p>`}
    </div></section>`;
}

function brandOptions(selected) {
  return `<option value="">Все бренды</option>${state.data.brands.map((brand) => `<option value="${esc(brand.id)}"${brand.id === selected ? " selected" : ""}>${esc(brand.name)}</option>`).join("")}`;
}

function card(product) {
  const set = product.set?.length ? `<ul class="set-list">${product.set.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : "";
  const buy = product.inStock
    ? `<a class="button" href="/product/${esc(product.id)}">Смотреть и купить</a>`
    : `<button class="button" type="button" disabled>Нет в наличии</button>`;
  return `<article class="card"><a class="card-link" href="/product/${esc(product.id)}"><div class="card-media">${media(product)}</div><div class="card-body">
        <p class="card-kicker">${esc(product.categoryTitle)} · ${esc(product.brandName)}</p>
        <h2 class="card-title">${esc(product.name)}</h2>
        <p class="card-text">${esc(product.summary)}</p>
        ${set}
        ${priceBlock(product)}
        ${stockLabel(product)}
      </div></a><div class="card-actions">${buy}</div></article>`;
}

function productPage(product) {
  const specs = product.specs?.length ? `<ul class="specs">${product.specs.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : "";
  const set = product.set?.length ? `<div class="set-block"><h2>Что входит в набор</h2><ul class="set-list">${product.set.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>` : "";
  const buy = product.inStock
    ? `<form class="page-actions" data-buy="${esc(product.id)}"><input class="qty-input" name="qty" type="number" min="1" max="${product.qty}" value="1" aria-label="Количество"><button class="button" type="submit">Купить в Telegram</button></form>`
    : `<button class="button" type="button" disabled>Нет в наличии</button>`;
  const notice = state.buyNotice?.id === product.id ? `<p class="notice">${esc(state.buyNotice.text)}</p>` : `<p class="notice" data-buy-note></p>`;
  return `<section class="page"><div class="wrap product-layout">${media(product, true)}<div class="product-info">
      <a class="back-link" href="/catalog/${esc(product.category)}">${esc(product.categoryTitle)}</a>
      <h1>${esc(product.name)}</h1>
      <a class="back-link" href="/brand/${esc(product.brandId)}">${esc(product.brandName)}</a>
      ${priceBlock(product)}
      ${stockLabel(product)}
      <p class="lead">${esc(product.description)}</p>
      ${specs}${set}${buy}
      ${notice}
    </div></div></section>`;
}

function brandsPage(selected) {
  const cards = state.data.brands.map((brand) => `<button class="card brand-card${selected?.id === brand.id ? " active" : ""}" type="button" data-brand="${esc(brand.id)}">
      <div class="card-media card-media-brand" aria-hidden="true"><span>${esc(brand.years)}</span></div>
      <div class="card-body"><p class="card-kicker">${esc(brand.city)}</p><h2 class="card-title">${esc(brand.name)}</h2><p class="card-text">${esc(brand.years)} лет на рынке. ${esc(brand.summary)}</p></div>
    </button>`).join("");
  const detail = selected ? `<article class="detail">
      <p class="eyebrow">${esc(selected.city)}</p>
      <h2>${esc(selected.name)}</h2>
      <div class="detail-meta"><span class="placeholder-tag">${esc(selected.years)} лет на рынке</span><span class="placeholder-tag">${esc(selected.makes)}</span></div>
      ${selected.about.map((paragraph) => `<p class="card-text">${esc(paragraph)}</p>`).join("")}
      <div class="page-actions"><a class="button" href="/catalog?brand=${esc(selected.id)}">Товары бренда</a></div>
    </article>` : `<p class="notice">Выберите карточку, чтобы прочитать о производителе.</p>`;
  return `<section class="page"><div class="wrap">
      <header class="page-intro"><p class="eyebrow">Производители</p><h1>О бренде</h1><p class="lead">Здесь компании, которые делают кальяны и детали на витрине: сколько лет они на рынке и чем занимаются.</p></header>
      <div class="card-grid">${cards}</div>
      ${detail}
    </div></section>`;
}

function servicePage(page) {
  return `<section class="page"><div class="wrap">
      <header class="page-intro"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.title)}</h1><p class="lead">${esc(page.lead)}</p></header>
      <div class="card-grid">${page.sections.map((section) => `<article class="card"><div class="card-body"><h2 class="card-title">${esc(section.title)}</h2><p class="card-text">${esc(section.text)}</p>${section.items ? `<ul class="plain-list">${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</div></article>`).join("")}</div>
      <div class="page-actions"><a class="button" href="${esc(telegram(page.telegramText))}" target="_blank" rel="noopener noreferrer">Написать в Telegram</a></div>
    </div></section>`;
}

function notFound(text) {
  return `<section class="page"><div class="wrap page-intro"><h1>Страница не найдена</h1><p class="lead">${esc(text)}</p><div class="page-actions"><a class="button" href="/">На главную</a></div></div></section>`;
}

function searchProducts(query) {
  const needle = query.trim().toLowerCase();
  if (!needle || !state.data) return [];
  return state.data.products.filter((product) => `${product.name} ${product.categoryTitle} ${product.brandName}`.toLowerCase().includes(needle));
}

function burger(open) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">${open ? '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' : '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'}</svg>`;
}
function searchIcon() {
  return `<svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}
function telegramIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.5 4.4 2.8 11.2c-1 .4-1 1-.2 1.3l4.8 1.5 1.8 5.5c.3.8.2 1.1.9 1.1.4 0 .6-.2.9-.5l2.6-2.5 5.4 4c1 .6 1.7.3 2-.9l2.4-14.2c.3-1.3-.5-1.9-1.9-1.4Z"/></svg>`;
}
function sun() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}
function moon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" stroke="currentColor" stroke-width="2"/></svg>`;
}

document.body.addEventListener("click", (event) => {
  const age = event.target.closest("[data-age]");
  if (age) {
    localStorage.setItem("lounge54-age", age.dataset.age);
    paintAge();
    return;
  }
  const brand = event.target.closest("[data-brand]");
  if (brand) {
    go(`/brand/${brand.dataset.brand}`);
    return;
  }
  if (event.target.closest(".catalog-toggle")) {
    state.catalogOpen = !state.catalogOpen;
    state.searchOpen = false;
    paintHeader();
    return;
  }
  if (event.target.closest(".header-theme")) {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("lounge54-theme", next);
    paintHeader();
    return;
  }
  const link = event.target.closest("a[href]");
  if (!link) return;
  const url = new URL(link.href, location.origin);
  if (url.origin !== location.origin || link.target === "_blank" || url.pathname.endsWith(".html")) return;
  event.preventDefault();
  go(`${url.pathname}${url.search}`);
});

document.body.addEventListener("input", (event) => {
  if (event.target.id !== "site-search") return;
  state.query = event.target.value;
  state.searchOpen = true;
  state.catalogOpen = false;
  paintHeader();
});

document.body.addEventListener("submit", async (event) => {
  if (event.target.closest(".search")) {
    event.preventDefault();
    const found = searchProducts(state.query);
    if (found[0]) go(`/product/${found[0].id}`);
    return;
  }
  const catalogForm = event.target.closest("[data-catalog-form]");
  if (catalogForm) {
    event.preventDefault();
    const data = new FormData(catalogForm);
    const params = new URLSearchParams();
    if (data.get("q")) params.set("q", data.get("q"));
    if (data.get("brand")) params.set("brand", data.get("brand"));
    if (data.get("sort")) params.set("sort", data.get("sort"));
    const query = params.toString();
    go(`${catalogForm.dataset.base}${query ? `?${query}` : ""}`);
    return;
  }
  const buy = event.target.closest("[data-buy]");
  if (!buy) return;
  event.preventDefault();
  const qty = new FormData(buy).get("qty");
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: buy.dataset.buy, qty: Number(qty) }),
  });
  const payload = await response.json();
  if (!response.ok) {
    state.buyNotice = { id: buy.dataset.buy, text: payload.error || "Не удалось оформить заявку" };
    paintPage();
    return;
  }
  state.buyNotice = { id: buy.dataset.buy, text: "Заявка создана. Количество спишется из таблицы после подтверждения в админке." };
  window.open(payload.telegramUrl, "_blank", "noopener");
  await load();
});

document.body.addEventListener("change", (event) => {
  if (event.target.closest("[data-catalog-form]") && event.target.tagName === "SELECT") {
    event.target.form.requestSubmit();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) {
    if (!state.catalogOpen && !state.searchOpen) return;
    state.catalogOpen = false;
    state.searchOpen = false;
    paintHeader();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    state.catalogOpen = false;
    state.searchOpen = false;
    paintHeader();
  }
});

window.addEventListener("popstate", () => paint());

load();
