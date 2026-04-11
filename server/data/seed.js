require("dotenv").config();

const sequelize = require("../db");
const { Brand, Type, Device, DeviceInfo } = require("../models/models");

const brands = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Huawei",
  "Lenovo",
  "Sony",
  "JBL",
  "Anker",
  "Logitech",
  "Amazfit",
];

const types = [
  "smartphone",
  "headphone",
  "smart watch",
  "phone charger",
  "mouse",
  "power bank",
];

const products = [
  {
    name: "Apple iPhone 15 Pro",
    description:
      "Флагманський смартфон Apple з потужним чипом, OLED-дисплеєм і преміальним корпусом.",
    price: 49999,
    img: "placeholder-smartphone-1.jpg",
    inStock: true,
    sale: 5,
    isHidden: false,
    brand: "Apple",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.1", OLED, 2556x1179' },
      { title: "Памʼять", description: "128 ГБ" },
      { title: "Камера", description: "48 Мп + 12 Мп + 12 Мп" },
    ],
  },
  {
    name: "Apple iPhone 15",
    description:
      "Сучасний смартфон Apple для щоденного використання з чудовою камерою та автономністю.",
    price: 39999,
    img: "placeholder-smartphone-2.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Apple",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.1", OLED, 2556x1179' },
      { title: "Памʼять", description: "128 ГБ" },
      { title: "Камера", description: "48 Мп + 12 Мп" },
    ],
  },
  {
    name: "Apple iPhone 14",
    description:
      "Надійний смартфон Apple з хорошою продуктивністю та якісним дисплеєм.",
    price: 31999,
    img: "placeholder-smartphone-3.jpg",
    inStock: true,
    sale: 8,
    isHidden: false,
    brand: "Apple",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.1", OLED, 2532x1170' },
      { title: "Памʼять", description: "128 ГБ" },
      { title: "Камера", description: "12 Мп + 12 Мп" },
    ],
  },
  {
    name: "Samsung Galaxy S24",
    description:
      "Преміальний Android-смартфон із яскравим AMOLED-дисплеєм і потужною камерою.",
    price: 44499,
    img: "placeholder-smartphone-4.jpg",
    inStock: true,
    sale: 7,
    isHidden: false,
    brand: "Samsung",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.2", Dynamic AMOLED 2X, 2340x1080' },
      { title: "Памʼять", description: "256 ГБ" },
      { title: "Камера", description: "50 Мп + 12 Мп + 10 Мп" },
    ],
  },
  {
    name: "Samsung Galaxy A55",
    description:
      "Збалансований смартфон середнього класу з великим екраном і хорошою автономністю.",
    price: 18999,
    img: "placeholder-smartphone-5.jpg",
    inStock: true,
    sale: 10,
    isHidden: false,
    brand: "Samsung",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.6", Super AMOLED, 2340x1080' },
      { title: "Памʼять", description: "128 ГБ" },
      { title: "Камера", description: "50 Мп + 12 Мп + 5 Мп" },
    ],
  },
  {
    name: "Xiaomi 14",
    description:
      "Потужний смартфон Xiaomi з флагманськими характеристиками та швидкою зарядкою.",
    price: 28999,
    img: "placeholder-smartphone-6.jpg",
    inStock: true,
    sale: 6,
    isHidden: false,
    brand: "Xiaomi",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.36", AMOLED, 2670x1200' },
      { title: "Памʼять", description: "256 ГБ" },
      { title: "Камера", description: "50 Мп + 50 Мп + 50 Мп" },
    ],
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    description:
      "Популярний смартфон із високою роздільною здатністю камери та якісним AMOLED-екраном.",
    price: 14999,
    img: "placeholder-smartphone-7.jpg",
    inStock: true,
    sale: 12,
    isHidden: false,
    brand: "Xiaomi",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.67", AMOLED, 2712x1220' },
      { title: "Памʼять", description: "256 ГБ" },
      { title: "Камера", description: "200 Мп + 8 Мп + 2 Мп" },
    ],
  },
  {
    name: "Huawei P60 Pro",
    description:
      "Смартфон із преміальною камерою, високою продуктивністю та стильним дизайном.",
    price: 32999,
    img: "placeholder-smartphone-8.jpg",
    inStock: true,
    sale: 9,
    isHidden: false,
    brand: "Huawei",
    type: "smartphone",
    info: [
      { title: "Екран", description: '6.67", OLED, 2700x1220' },
      { title: "Памʼять", description: "256 ГБ" },
      { title: "Камера", description: "48 Мп + 13 Мп + 48 Мп" },
    ],
  },
  {
    name: "Sony WH-1000XM5",
    description:
      "Преміальні повнорозмірні навушники з активним шумозаглушенням.",
    price: 16999,
    img: "placeholder-headphone-1.jpg",
    inStock: true,
    sale: 4,
    isHidden: false,
    brand: "Sony",
    type: "headphone",
    info: [
      { title: "Тип", description: "Накладні бездротові" },
      { title: "Шумозаглушення", description: "Active Noise Cancelling" },
      { title: "Автономність", description: "До 30 годин" },
    ],
  },
  {
    name: "Apple AirPods Pro 2",
    description:
      "Компактні TWS-навушники Apple з активним шумозаглушенням і просторовим аудіо.",
    price: 11999,
    img: "placeholder-headphone-2.jpg",
    inStock: true,
    sale: 3,
    isHidden: false,
    brand: "Apple",
    type: "headphone",
    info: [
      { title: "Тип", description: "TWS" },
      { title: "Шумозаглушення", description: "Active Noise Cancelling" },
      { title: "Автономність", description: "До 6 годин + кейс" },
    ],
  },
  {
    name: "Samsung Galaxy Buds FE",
    description:
      "Зручні бездротові навушники для щоденного використання зі збалансованим звуком.",
    price: 3999,
    img: "placeholder-headphone-3.jpg",
    inStock: true,
    sale: 11,
    isHidden: false,
    brand: "Samsung",
    type: "headphone",
    info: [
      { title: "Тип", description: "TWS" },
      { title: "Шумозаглушення", description: "Є" },
      { title: "Автономність", description: "До 8.5 годин" },
    ],
  },
  {
    name: "JBL Tune 770NC",
    description:
      "Стильні бездротові навушники JBL із фірмовим басом та шумозаглушенням.",
    price: 5499,
    img: "placeholder-headphone-4.jpg",
    inStock: true,
    sale: 15,
    isHidden: false,
    brand: "JBL",
    type: "headphone",
    info: [
      { title: "Тип", description: "Накладні бездротові" },
      { title: "Шумозаглушення", description: "Adaptive Noise Cancelling" },
      { title: "Автономність", description: "До 70 годин" },
    ],
  },
  {
    name: "Xiaomi Redmi Buds 5 Pro",
    description: "Доступні TWS-навушники зі зручним кейсом та підтримкою ANC.",
    price: 2999,
    img: "placeholder-headphone-5.jpg",
    inStock: true,
    sale: 10,
    isHidden: false,
    brand: "Xiaomi",
    type: "headphone",
    info: [
      { title: "Тип", description: "TWS" },
      { title: "Шумозаглушення", description: "До 52 дБ" },
      { title: "Автономність", description: "До 10 годин" },
    ],
  },
  {
    name: "Apple Watch Series 9",
    description:
      "Розумний годинник Apple для спорту, повідомлень та моніторингу здоровʼя.",
    price: 17999,
    img: "placeholder-watch-1.jpg",
    inStock: true,
    sale: 5,
    isHidden: false,
    brand: "Apple",
    type: "smart watch",
    info: [
      { title: "Дисплей", description: '1.9", OLED Retina' },
      { title: "Корпус", description: "Алюміній" },
      { title: "Функції", description: "Пульс, SpO2, GPS, повідомлення" },
    ],
  },
  {
    name: "Samsung Galaxy Watch 6",
    description:
      "Сучасний смарт-годинник Samsung для фітнесу, дзвінків і контролю здоровʼя.",
    price: 12999,
    img: "placeholder-watch-2.jpg",
    inStock: true,
    sale: 9,
    isHidden: false,
    brand: "Samsung",
    type: "smart watch",
    info: [
      { title: "Дисплей", description: '1.5", Super AMOLED' },
      { title: "Корпус", description: "Алюміній" },
      { title: "Функції", description: "Пульс, ЕКГ, GPS, сон" },
    ],
  },
  {
    name: "Amazfit GTR 4",
    description:
      "Стильний смарт-годинник із довгою автономністю та багатьма спортивними режимами.",
    price: 7999,
    img: "placeholder-watch-3.jpg",
    inStock: true,
    sale: 13,
    isHidden: false,
    brand: "Amazfit",
    type: "smart watch",
    info: [
      { title: "Дисплей", description: '1.43", AMOLED' },
      { title: "Автономність", description: "До 14 днів" },
      { title: "Функції", description: "GPS, пульс, SpO2, спорт" },
    ],
  },
  {
    name: "Huawei Watch GT 4",
    description:
      "Елегантний годинник Huawei з точним моніторингом активності та тривалою роботою.",
    price: 9999,
    img: "placeholder-watch-4.jpg",
    inStock: true,
    sale: 6,
    isHidden: false,
    brand: "Huawei",
    type: "smart watch",
    info: [
      { title: "Дисплей", description: '1.43", AMOLED' },
      { title: "Автономність", description: "До 8 днів" },
      { title: "Функції", description: "Пульс, сон, GPS, тренування" },
    ],
  },
  {
    name: "Anker 30W USB-C Charger",
    description:
      "Компактний мережевий зарядний пристрій для смартфонів, навушників і аксесуарів.",
    price: 1299,
    img: "placeholder-charger-1.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Anker",
    type: "phone charger",
    info: [
      { title: "Потужність", description: "30 Вт" },
      { title: "Порт", description: "USB-C" },
      { title: "Підтримка", description: "Power Delivery" },
    ],
  },
  {
    name: "Samsung 25W Super Fast Charger",
    description:
      "Оригінальний зарядний пристрій Samsung для швидкого заряджання смартфонів.",
    price: 899,
    img: "placeholder-charger-2.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Samsung",
    type: "phone charger",
    info: [
      { title: "Потужність", description: "25 Вт" },
      { title: "Порт", description: "USB-C" },
      { title: "Підтримка", description: "Super Fast Charging" },
    ],
  },
  {
    name: "Apple 20W USB-C Power Adapter",
    description:
      "Фірмовий блок живлення Apple для iPhone, iPad та інших сумісних пристроїв.",
    price: 1199,
    img: "placeholder-charger-3.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Apple",
    type: "phone charger",
    info: [
      { title: "Потужність", description: "20 Вт" },
      { title: "Порт", description: "USB-C" },
      { title: "Підтримка", description: "Fast Charge" },
    ],
  },
  {
    name: "Xiaomi 67W Turbo Charger",
    description:
      "Потужний зарядний пристрій Xiaomi для смартфонів і сумісних гаджетів.",
    price: 1499,
    img: "placeholder-charger-4.jpg",
    inStock: true,
    sale: 7,
    isHidden: false,
    brand: "Xiaomi",
    type: "phone charger",
    info: [
      { title: "Потужність", description: "67 Вт" },
      { title: "Порт", description: "USB-A / USB-C" },
      { title: "Підтримка", description: "Turbo Charge" },
    ],
  },
  {
    name: "Logitech MX Master 3S",
    description:
      "Преміальна бездротова миша для роботи, дизайну та щоденного використання.",
    price: 4699,
    img: "placeholder-mouse-1.jpg",
    inStock: true,
    sale: 5,
    isHidden: false,
    brand: "Logitech",
    type: "mouse",
    info: [
      { title: "Тип", description: "Бездротова" },
      { title: "Підключення", description: "Bluetooth / USB Receiver" },
      { title: "Сенсор", description: "8000 DPI" },
    ],
  },
  {
    name: "Logitech G304 Lightspeed",
    description:
      "Ігрова бездротова миша з точною передачею руху та легкою конструкцією.",
    price: 2199,
    img: "placeholder-mouse-2.jpg",
    inStock: true,
    sale: 9,
    isHidden: false,
    brand: "Logitech",
    type: "mouse",
    info: [
      { title: "Тип", description: "Ігрова бездротова" },
      { title: "Підключення", description: "USB Receiver" },
      { title: "Сенсор", description: "12000 DPI" },
    ],
  },
  {
    name: "Lenovo 600 Bluetooth Silent Mouse",
    description: "Зручна тиха миша Lenovo для офісної роботи та ноутбуків.",
    price: 999,
    img: "placeholder-mouse-3.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Lenovo",
    type: "mouse",
    info: [
      { title: "Тип", description: "Бездротова тиха" },
      { title: "Підключення", description: "Bluetooth" },
      { title: "Особливість", description: "Низький рівень шуму" },
    ],
  },
  {
    name: "Xiaomi Mi Dual Mode Wireless Mouse 2",
    description:
      "Компактна бездротова миша Xiaomi для роботи вдома, в офісі та в дорозі.",
    price: 899,
    img: "placeholder-mouse-4.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Xiaomi",
    type: "mouse",
    info: [
      { title: "Тип", description: "Бездротова" },
      { title: "Підключення", description: "Bluetooth / 2.4 GHz" },
      { title: "Сумісність", description: "Windows, macOS" },
    ],
  },
  {
    name: "Anker PowerCore 10000",
    description: "Компактний power bank для заряджання смартфонів у дорозі.",
    price: 1599,
    img: "placeholder-powerbank-1.jpg",
    inStock: true,
    sale: 0,
    isHidden: false,
    brand: "Anker",
    type: "power bank",
    info: [
      { title: "Ємність", description: "10000 мАг" },
      { title: "Порти", description: "USB-A, USB-C" },
      { title: "Особливість", description: "Компактний корпус" },
    ],
  },
  {
    name: "Xiaomi Redmi Power Bank 20000",
    description:
      "Ємний power bank для кількох повних зарядок смартфона або аксесуарів.",
    price: 1899,
    img: "placeholder-powerbank-2.jpg",
    inStock: true,
    sale: 6,
    isHidden: false,
    brand: "Xiaomi",
    type: "power bank",
    info: [
      { title: "Ємність", description: "20000 мАг" },
      { title: "Порти", description: "2x USB-A, microUSB, USB-C" },
      { title: "Особливість", description: "Підтримка швидкої зарядки" },
    ],
  },
  {
    name: "Samsung 10000mAh Battery Pack",
    description:
      "Фірмовий зовнішній акумулятор Samsung з підтримкою швидкої зарядки.",
    price: 1999,
    img: "placeholder-powerbank-3.jpg",
    inStock: true,
    sale: 4,
    isHidden: false,
    brand: "Samsung",
    type: "power bank",
    info: [
      { title: "Ємність", description: "10000 мАг" },
      { title: "Порти", description: "USB-C, USB-A" },
      { title: "Особливість", description: "Super Fast Charging" },
    ],
  },
  {
    name: "Huawei SuperCharge Power Bank 12000",
    description:
      "Надійний power bank Huawei для швидкого підзаряджання смартфонів.",
    price: 2099,
    img: "placeholder-powerbank-4.jpg",
    inStock: true,
    sale: 5,
    isHidden: false,
    brand: "Huawei",
    type: "power bank",
    info: [
      { title: "Ємність", description: "12000 мАг" },
      { title: "Порти", description: "USB-C, USB-A" },
      { title: "Особливість", description: "Підтримка швидкої зарядки" },
    ],
  },
  {
    name: "Sony WF-C700N",
    description:
      "Легкі бездротові навушники Sony для музики, дзвінків і щоденного використання.",
    price: 4999,
    img: "placeholder-headphone-6.jpg",
    inStock: true,
    sale: 8,
    isHidden: false,
    brand: "Sony",
    type: "headphone",
    info: [
      { title: "Тип", description: "TWS" },
      { title: "Шумозаглушення", description: "Є" },
      { title: "Автономність", description: "До 7.5 годин" },
    ],
  },
  {
    name: "JBL Flip Essential 2",
    description:
      "Портативна Bluetooth-колонка JBL для дому, подорожей і зустрічей із друзями.",
    price: 3999,
    img: "placeholder-headphone-7.jpg",
    inStock: true,
    sale: 10,
    isHidden: false,
    brand: "JBL",
    type: "headphone",
    info: [
      { title: "Тип", description: "Портативна Bluetooth-акустика" },
      { title: "Потужність", description: "20 Вт" },
      { title: "Автономність", description: "До 10 годин" },
    ],
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await DeviceInfo.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await Device.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await Brand.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await Type.destroy({ where: {}, force: true, truncate: { cascade: true } });

    const brandMap = {};
    for (const name of brands) {
      const brand = await Brand.create({ name });
      brandMap[name] = brand;
    }

    const typeMap = {};
    for (const name of types) {
      const type = await Type.create({ name });
      typeMap[name] = type;
    }

    for (const item of products) {
      const device = await Device.create({
        name: item.name,
        description: item.description,
        price: item.price,
        img: item.img,
        inStock: item.inStock,
        sale: item.sale,
        isHidden: item.isHidden,
        brandId: brandMap[item.brand].id,
        typeId: typeMap[item.type].id,
      });

      const infoRows = item.info.map((row) => ({
        title: row.title,
        description: row.description,
        deviceId: device.id,
      }));

      await DeviceInfo.bulkCreate(infoRows);
      console.log(`Seeded: ${device.name}`);
    }

    console.log(`Done. Seeded ${products.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
