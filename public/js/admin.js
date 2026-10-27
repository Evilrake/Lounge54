const key = "lounge54-admin";
let token = sessionStorage.getItem(key) || "";
let state = null;
let tab = "products";
let message = "";

const folders = [
  ["hookah", "Кальян"],
  ["bowls", "Чаши"],
  ["kalouds", "Калауды"],
  ["flasks", "Колбы"],
  ["shafts", "Шахты"],
  ["meshes", "Сетки"],
  ["files", "Файлы сайта"],
];

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 && !url.endsWith("/login")) {
    token = "";
    sessionStorage.removeItem(key);
    paint();
    throw new Error("Нужен вход");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Ошибка");
  return data;
}

async function load() {
  state = await api("/api/admin/state");
  paint();
}

function paint() {
  const root = document.getElementById("admin");
  if (!token) {
    root.innerHTML = `<form class="login" id="login"><h1>Админка Lounge54</h1><p class="muted">Пароль лежит в data/admin.json на сервере.</p><label>Пароль<input name="password" type="password" required></label><button class="button" type="submit">Войти</button><p class="error" id="login-error"></p></form>`;
    return;
  }
  if (!state) {
    root.innerHTML = `<p>Загрузка…</p>`;
    return;
  }
  root.innerHTML = `<div class="row"><h1>Админка</h1><a class="ghost" href="/">На витрину</a><button class="ghost" type="button" id="logout">Выйти</button></div>
    <div class="tabs">${[
      ["products", "Товары"],
      ["brands", "Бренды"],
      ["photos", "Фото"],
      ["files", "Файлы"],
      ["stock", "Наличие"],
      ["orders", "Заказы"],
      ["texts", "Тексты"],
    ].map(([id, label]) => `<button class="tab${tab === id ? " active" : ""}" type="button" data-tab="${id}">${label}</button>`).join("")}</div>
    <p class="muted">${esc(message)}</p>
    <div class="stack">${view()}</div>`;
}

function view() {
  if (tab === "products") return productsView();
  if (tab === "brands") return brandsView();
  if (tab === "photos") return filesView("photos");
  if (tab === "files") return filesView("files");
  if (tab === "stock") return stockView();
  if (tab === "orders") return ordersView();
  return textsView();
}

function productsView() {
  return `${state.products.map((product) => `<form class="card stack" data-product="${esc(product.id)}">
      <h2>${esc(product.name)}</h2>
      <div class="row">
        <label>Название<input name="name" value="${esc(product.name)}"></label>
        <label>Цена<input name="price" type="number" value="${product.price}"></label>
        <label>Категория<select name="category">${state.categories.map((category) => `<option value="${category.id}"${category.id === product.category ? " selected" : ""}>${esc(category.title)}</option>`).join("")}</select></label>
        <label>Бренд<select name="brandId">${state.brands.map((brand) => `<option value="${brand.id}"${brand.id === product.brandId ? " selected" : ""}>${esc(brand.name)}</option>`).join("")}</select></label>
      </div>
      <label>Кратко<input name="summary" value="${esc(product.summary)}"></label>
      <label>Описание<textarea name="description">${esc(product.description)}</textarea></label>
      <label>Характеристики, каждая с новой строки<textarea name="specs">${esc((product.specs || []).join("\n"))}</textarea></label>
      <label>Состав набора, каждая строка отдельно<textarea name="set">${esc((product.set || []).join("\n"))}</textarea></label>
      <label>Фото из папки категории<select name="image"><option value="">Без фото</option>${(state.folders[product.category] || []).map((file) => `<option value="${esc(file)}"${file === product.image ? " selected" : ""}>${esc(file)}</option>`).join("")}</select></label>
      <label class="row"><input name="featured" type="checkbox"${product.featured ? " checked" : ""}> На главной</label>
      <label class="row"><input name="priceIsPlaceholder" type="checkbox"${product.priceIsPlaceholder ? " checked" : ""}> Цена-заглушка</label>
      <div class="actions"><button class="button" type="submit">Сохранить</button><button class="ghost" type="button" data-delete-product="${esc(product.id)}">Удалить</button></div>
    </form>`).join("")}
    <form class="card stack" id="new-product"><h2>Новый товар</h2><label>Артикул латиницей<input name="id" required placeholder="nova"></label><label>Название<input name="name" required></label><button class="button" type="submit">Добавить</button></form>`;
}

function brandsView() {
  return `${state.brands.map((brand) => `<form class="card stack" data-brand="${esc(brand.id)}">
      <h2>${esc(brand.name)}</h2>
      <div class="row">
        <label>Название<input name="name" value="${esc(brand.name)}"></label>
        <label>Лет на рынке<input name="years" type="number" value="${brand.years}"></label>
        <label>Город<input name="city" value="${esc(brand.city)}"></label>
      </div>
      <label>Что выпускает<input name="makes" value="${esc(brand.makes)}"></label>
      <label>Коротко<input name="summary" value="${esc(brand.summary)}"></label>
      <label>Текст, абзацы с новой строки<textarea name="about">${esc((brand.about || []).join("\n"))}</textarea></label>
      <div class="actions"><button class="button" type="submit">Сохранить</button><button class="ghost" type="button" data-delete-brand="${esc(brand.id)}">Удалить</button></div>
    </form>`).join("")}
    <form class="card stack" id="new-brand"><h2>Новый бренд</h2><label>Код латиницей<input name="id" required></label><label>Название<input name="name" required></label><button class="button" type="submit">Добавить</button></form>`;
}

function filesView(mode) {
  const list = mode === "files" ? [["files", "Файлы сайта"]] : folders.filter(([id]) => id !== "files");
  return list.map(([id, title]) => `<section class="card stack"><h2>${esc(title)}</h2><p class="muted">Папка uploads/${esc(id)}</p>
      <form data-upload="${esc(id)}" class="row"><input name="file" type="file" ${id === "files" ? "" : 'accept="image/*"'} required><button class="button" type="submit">Загрузить</button></form>
      <div class="grid">${(state.folders[id] || []).map((file) => `<div class="file">${id === "files" ? `<a href="/uploads/${esc(id)}/${encodeURIComponent(file)}">${esc(file)}</a>` : `<img src="/uploads/${esc(id)}/${encodeURIComponent(file)}" alt="">`}<button class="ghost" type="button" data-delete-file="${esc(id)}/${esc(file)}">Удалить</button></div>`).join("") || "<p class=\"muted\">Пока пусто</p>"}</div>
    </section>`).join("");
}

function stockView() {
  return `<section class="card stack"><h2>Таблица наличия</h2>
      <p class="muted">Это файл data/stock.xlsx. Витрина читает его при каждом открытии. Если артикула нет в таблице или количество 0, на сайте будет «Нет в наличии». Подтверждение заказа уменьшает количество на купленное число.</p>
      <div class="actions"><button class="button" type="button" id="save-stock">Сохранить таблицу</button><button class="ghost" type="button" id="download-stock">Скачать Excel</button><button class="ghost" type="button" id="reload-stock">Перечитать файл</button></div>
      <table><thead><tr><th>Артикул</th><th>Название</th><th>Категория</th><th>Бренд</th><th>Количество</th></tr></thead>
      <tbody>${state.stock.map((row, index) => `<tr>
          <td><input data-stock="${index}" data-col="Артикул" value="${esc(row["Артикул"])}"></td>
          <td><input data-stock="${index}" data-col="Название" value="${esc(row["Название"])}"></td>
          <td><input data-stock="${index}" data-col="Категория" value="${esc(row["Категория"])}"></td>
          <td><input data-stock="${index}" data-col="Бренд" value="${esc(row["Бренд"])}"></td>
          <td><input data-stock="${index}" data-col="Количество" type="number" value="${esc(row["Количество"])}"></td>
        </tr>`).join("")}</tbody></table>
    </section>`;
}

function ordersView() {
  if (!state.orders.length) return `<p class="muted">Заявок пока нет.</p>`;
  return state.orders.map((order) => `<article class="card stack"><h2>${esc(order.name)} · ${order.qty} шт.</h2><p class="muted">${esc(order.status)} · ${esc(order.createdAt)} · ${esc(order.id)}</p>${order.status === "pending" ? `<div class="actions"><button class="button" type="button" data-confirm="${esc(order.id)}">Подтвердить покупку</button><button class="ghost" type="button" data-cancel="${esc(order.id)}">Отменить</button></div>` : ""}</article>`).join("");
}

function textsView() {
  const { pages } = state;
  return `<form class="card stack" id="pages">
      <label>Telegram<input name="telegramUrl" value="${esc(pages.telegramUrl)}"></label>
      <h2>Кейтеринг</h2>
      <label>Заголовок<input name="cateringTitle" value="${esc(pages.catering.title)}"></label>
      <label>Лид<textarea name="cateringLead">${esc(pages.catering.lead)}</textarea></label>
      <h2>Аренда</h2>
      <label>Заголовок<input name="rentalTitle" value="${esc(pages.rental.title)}"></label>
      <label>Лид<textarea name="rentalLead">${esc(pages.rental.lead)}</textarea></label>
      <button class="button" type="submit">Сохранить тексты</button>
    </form>`;
}

function formData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.featured = Boolean(form.featured?.checked);
  data.priceIsPlaceholder = Boolean(form.priceIsPlaceholder?.checked);
  return data;
}

document.body.addEventListener("click", async (event) => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    tab = tabButton.dataset.tab;
    message = "";
    paint();
    return;
  }
  if (event.target.id === "logout") {
    token = "";
    sessionStorage.removeItem(key);
    paint();
    return;
  }
  const deleteProduct = event.target.closest("[data-delete-product]");
  if (deleteProduct) {
    await api(`/api/admin/products/${deleteProduct.dataset.deleteProduct}`, { method: "DELETE" });
    message = "Товар удалён";
    await load();
    return;
  }
  const deleteBrand = event.target.closest("[data-delete-brand]");
  if (deleteBrand) {
    await api(`/api/admin/brands/${deleteBrand.dataset.deleteBrand}`, { method: "DELETE" });
    message = "Бренд удалён";
    await load();
    return;
  }
  const deleteFile = event.target.closest("[data-delete-file]");
  if (deleteFile) {
    const [folder, name] = deleteFile.dataset.deleteFile.split("/");
    await api(`/api/admin/files/${folder}/${encodeURIComponent(name)}`, { method: "DELETE" });
    message = "Файл удалён";
    await load();
    return;
  }
  const confirmOrder = event.target.closest("[data-confirm]");
  if (confirmOrder) {
    try {
      await api(`/api/admin/orders/${confirmOrder.dataset.confirm}/confirm`, { method: "POST" });
      message = "Покупка подтверждена, количество в Excel уменьшено";
      await load();
    } catch (error) {
      message = error.message;
      paint();
    }
    return;
  }
  const cancelOrder = event.target.closest("[data-cancel]");
  if (cancelOrder) {
    await api(`/api/admin/orders/${cancelOrder.dataset.cancel}/cancel`, { method: "POST" });
    message = "Заявка отменена, таблица не менялась";
    await load();
    return;
  }
  if (event.target.id === "save-stock") {
    const rows = state.stock.map((row, index) => {
      const next = { ...row };
      document.querySelectorAll(`[data-stock="${index}"]`).forEach((input) => {
        next[input.dataset.col] = input.dataset.col === "Количество" ? Number(input.value) : input.value;
      });
      return next;
    });
    state.stock = await api("/api/admin/stock", { method: "PUT", body: JSON.stringify({ rows }) });
    message = "Таблица наличия сохранена";
    await load();
    return;
  }
  if (event.target.id === "reload-stock") {
    state.stock = await api("/api/admin/stock");
    message = "Файл перечитан";
    paint();
    return;
  }
  if (event.target.id === "download-stock") {
    const response = await fetch("/api/admin/stock.xlsx", { headers: { Authorization: `Bearer ${token}` } });
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lounge54-nalichie.xlsx";
    link.click();
  }
});

document.body.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (event.target.id === "login") {
      const payload = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: new FormData(event.target).get("password") }),
      });
      token = payload.token;
      sessionStorage.setItem(key, token);
      await load();
      return;
    }
    const productForm = event.target.closest("[data-product]");
    if (productForm) {
      await api(`/api/admin/products/${productForm.dataset.product}`, {
        method: "PUT",
        body: JSON.stringify(formData(productForm)),
      });
      message = "Товар сохранён";
      await load();
      return;
    }
    if (event.target.id === "new-product") {
      await api("/api/admin/products", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.target))) });
      message = "Товар добавлен. В таблице наличия у него 0, пока не укажете количество.";
      await load();
      return;
    }
    const brandForm = event.target.closest("[data-brand]");
    if (brandForm) {
      await api(`/api/admin/brands/${brandForm.dataset.brand}`, {
        method: "PUT",
        body: JSON.stringify(formData(brandForm)),
      });
      message = "Бренд сохранён";
      await load();
      return;
    }
    if (event.target.id === "new-brand") {
      await api("/api/admin/brands", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.target))) });
      message = "Бренд добавлен";
      await load();
      return;
    }
    const uploadForm = event.target.closest("[data-upload]");
    if (uploadForm) {
      const body = new FormData(uploadForm);
      await api(`/api/admin/upload?folder=${uploadForm.dataset.upload}`, { method: "POST", body });
      message = "Файл сохранён в папку";
      await load();
      return;
    }
    if (event.target.id === "pages") {
      const data = Object.fromEntries(new FormData(event.target));
      await api("/api/admin/pages", {
        method: "PUT",
        body: JSON.stringify({
          telegramUrl: data.telegramUrl,
          catering: { ...state.pages.catering, title: data.cateringTitle, lead: data.cateringLead },
          rental: { ...state.pages.rental, title: data.rentalTitle, lead: data.rentalLead },
        }),
      });
      message = "Тексты сохранены";
      await load();
    }
  } catch (error) {
    const slot = document.getElementById("login-error");
    if (slot) slot.textContent = error.message;
    else {
      message = error.message;
      paint();
    }
  }
});

if (token) load().catch(() => paint());
else paint();
