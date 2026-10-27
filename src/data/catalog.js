/** Цены ниже — заглушки. Замените числа и снимите priceIsPlaceholder, когда появятся реальные. */
export const hookahSet = [
  "Шахта",
  "Колба",
  "Шланг",
  "Чаша",
  "Блюдце",
  "Щипцы",
  "Мундштук",
];

export const categories = [
  {
    id: "hookah",
    title: "Кальян",
    menuText: "Готовый набор и его состав",
    lead: "Собранный комплект для стола. В каждый набор входит шахта, колба, шланг, чаша, блюдце, щипцы и мундштук.",
  },
  {
    id: "bowls",
    title: "Чаши",
    menuText: "Фанел, классика и глубокая забивка",
    lead: "Керамические чаши под разную забивку. Сок, жар и плотность табака зависят от формы.",
  },
  {
    id: "kalouds",
    title: "Калауды",
    menuText: "Крышки для контроля жара",
    lead: "Калауды держат угли над чашей и дают крутить жар, не снимая угли щипцами каждую минуту.",
  },
  {
    id: "flasks",
    title: "Колбы",
    menuText: "Стекло под шахту Lounge54",
    lead: "Сменные колбы с посадкой под шахты Lounge54. Отличаются объёмом, стеклом и формой основания.",
  },
  {
    id: "shafts",
    title: "Шахты",
    menuText: "Сталь, стандарт и тонкая трубка",
    lead: "Нержавеющие шахты. Тяга и высота комплекта меняются вместе с трубкой, колба остаётся своей.",
  },
  {
    id: "meshes",
    title: "Сетки",
    menuText: "Чтобы табак не проваливался",
    lead: "Сетки в чашу. Мелкое плетение для сухой забивки, плотное — для сочной.",
  },
];

export const products = [
  {
    id: "classic",
    category: "hookah",
    name: "Lounge54 Classic",
    summary: "Домашний набор средней высоты для компании до четырёх человек.",
    description:
      "Спокойная тяга и колба на 1,2 литра. Ниже состав, с которым набор уходит заказчику.",
    price: 12900,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Высота набора: средняя", "Колба: 1,2 л"],
    set: hookahSet,
  },
  {
    id: "night",
    category: "hookah",
    name: "Lounge54 Night",
    summary: "Высокая шахта и более объёмная колба для долгой посадки.",
    description:
      "Набор для длинного вечера. Шахта выше, чем у Classic, колба 1,5 л, шланг длиннее.",
    price: 18400,
    priceIsPlaceholder: true,
    specs: ["Высота набора: высокая", "Колба: 1,5 л"],
    set: hookahSet,
  },
  {
    id: "compact",
    category: "hookah",
    name: "Lounge54 Compact",
    summary: "Невысокий комплект для небольшого стола.",
    description:
      "Компактный набор, который проще хранить и брать с собой. Колба 0,9 л.",
    price: 9700,
    priceIsPlaceholder: true,
    specs: ["Высота набора: низкая", "Колба: 0,9 л"],
    set: hookahSet,
  },
  {
    id: "phunnel",
    category: "bowls",
    name: "Lounge54 Phunnel",
    summary: "Чаша-фанел: сок остаётся в бортике и не стекает в шахту.",
    description:
      "Подходит для сочной забивки. Отверстие приподнято, поэтому сироп дольше остаётся в чаше.",
    price: 1890,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Тип: фанел", "Материал: керамика"],
  },
  {
    id: "open",
    category: "bowls",
    name: "Lounge54 Open",
    summary: "Классическая чаша с открытым дном.",
    description:
      "Простая чаша для привычной забивки. Хорошо стыкуется с калаудом Lounge54 Heat.",
    price: 1450,
    priceIsPlaceholder: true,
    specs: ["Тип: классическая", "Материал: керамика"],
  },
  {
    id: "deep",
    category: "bowls",
    name: "Lounge54 Deep",
    summary: "Глубокая чаша для плотной забивки.",
    description: "Больше табака и выше борт. Имеет смысл, если компания сидит долго.",
    price: 2150,
    priceIsPlaceholder: true,
    specs: ["Тип: глубокая", "Материал: керамика"],
  },
  {
    id: "heat",
    category: "kalouds",
    name: "Lounge54 Heat",
    summary: "Калауд на три угля с крышкой, которая меняет тягу.",
    description:
      "Ставится на чашу вместо фольги. Крышку можно сдвигать, чтобы убавить или добавить жар.",
    price: 2490,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Угли: 3", "Материал: металл"],
  },
  {
    id: "heat-mini",
    category: "kalouds",
    name: "Lounge54 Heat Mini",
    summary: "Низкий калауд на два угля для небольшой чаши.",
    description: "Меньше масса и ниже посадка. Удобен на Lounge54 Compact.",
    price: 2190,
    priceIsPlaceholder: true,
    specs: ["Угли: 2", "Материал: металл"],
  },
  {
    id: "clear",
    category: "flasks",
    name: "Lounge54 Clear",
    summary: "Прозрачная колба с посадкой под шахту Lounge54.",
    description: "Видно уровень воды. Объём близок к колбе из набора Classic.",
    price: 3200,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Стекло: прозрачное", "Объём: 1,2 л"],
  },
  {
    id: "smoke",
    category: "flasks",
    name: "Lounge54 Smoke",
    summary: "Матовое стекло: на колбе меньше видны разводы.",
    description: "Та же посадка, что у Clear. Матовый слой прячет следы воды между промывками.",
    price: 3600,
    priceIsPlaceholder: true,
    specs: ["Стекло: матовое", "Объём: 1,2 л"],
  },
  {
    id: "craft",
    category: "flasks",
    name: "Lounge54 Craft",
    summary: "Конус устойчивее стоит на низком столе.",
    description: "Широкое основание и посадка под шахты Lounge54. Объём чуть больше домашнего набора.",
    price: 4100,
    priceIsPlaceholder: true,
    specs: ["Форма: конус", "Объём: 1,5 л"],
  },
  {
    id: "stem",
    category: "shafts",
    name: "Lounge54 Stem",
    summary: "Стальная шахта стандартной высоты.",
    description: "Разборное соединение с колбой. Высота как у набора Classic.",
    price: 6800,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Материал: нержавеющая сталь", "Высота: стандарт"],
  },
  {
    id: "stem-slim",
    category: "shafts",
    name: "Lounge54 Stem Slim",
    summary: "Тонкая шахта легче стандартной при той же посадке чаши.",
    description: "Уже внутренний канал и меньше вес. Колбы Lounge54 подходят без переходника.",
    price: 7400,
    priceIsPlaceholder: true,
    specs: ["Материал: нержавеющая сталь", "Канал: узкий"],
  },
  {
    id: "mesh",
    category: "meshes",
    name: "Lounge54 Mesh",
    summary: "Мелкая сетка, чтобы табак не проваливался в шахту.",
    description: "Кладётся на дно чаши перед забивкой. Подходит для Lounge54 Open и Phunnel.",
    price: 390,
    priceIsPlaceholder: true,
    featured: true,
    specs: ["Плетение: мелкое", "Назначение: дно чаши"],
  },
  {
    id: "mesh-pro",
    category: "meshes",
    name: "Lounge54 Mesh Pro",
    summary: "Плотное плетение для сочной забивки.",
    description: "Держит тяжёлый табак и меньше тянется после промывки.",
    price: 520,
    priceIsPlaceholder: true,
    specs: ["Плетение: плотное", "Назначение: дно чаши"],
  },
];

export function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function getCategory(id) {
  return categories.find((category) => category.id === id);
}

export function getProduct(id) {
  return products.find((product) => product.id === id);
}

export function getProducts(categoryId) {
  if (!categoryId) return products;
  return products.filter((product) => product.category === categoryId);
}

export function searchProducts(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return products.filter((product) => {
    const category = getCategory(product.category);
    return (
      product.name.toLowerCase().includes(needle) ||
      category?.title.toLowerCase().includes(needle)
    );
  });
}
