const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // Додаємо кількість товару
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING, allowNull: true },
});

const Device = sequelize.define("device", {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amazonId:     { type: DataTypes.STRING,  unique: true, allowNull: true },
  source:       { type: DataTypes.STRING,  allowNull: true },
  name:         { type: DataTypes.STRING,  unique: true, allowNull: false },
  price:        { type: DataTypes.FLOAT,   allowNull: false },
  priceText:    { type: DataTypes.STRING,  allowNull: true },
  rating:       { type: DataTypes.FLOAT,   allowNull: true },
  reviewCount:  { type: DataTypes.INTEGER, allowNull: true },
  availability: { type: DataTypes.STRING,  allowNull: true },
  img:          { type: DataTypes.STRING,  allowNull: false },
  imageUrls:    { type: DataTypes.JSONB,   allowNull: true },
  imagesCount:  { type: DataTypes.INTEGER, allowNull: true },
  specs:        { type: DataTypes.JSONB,   allowNull: true },
  inStock:      { type: DataTypes.BOOLEAN, defaultValue: true },
  sale:         { type: DataTypes.INTEGER, defaultValue: 0 },
  isHidden:     { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const DeviceInfo = sequelize.define("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_number: { type: DataTypes.STRING(8), unique: true, allowNull: true },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: false },
  state_province: { type: DataTypes.STRING, allowNull: false },
  zip_postal_code: { type: DataTypes.STRING, allowNull: false },
  address_line: { type: DataTypes.STRING, allowNull: true },
  payment: { type: DataTypes.STRING, allowNull: false },
  delivery_method: { type: DataTypes.STRING, defaultValue: "standard" },
  delivery_date: { type: DataTypes.DATEONLY, allowNull: true },
  delivery_priority: { type: DataTypes.STRING, defaultValue: "standard" },
  status: { type: DataTypes.STRING, defaultValue: "new" },
  payment_status: { type: DataTypes.STRING, defaultValue: "unpaid" },
  delivery_status: { type: DataTypes.STRING, defaultValue: "pending" },
  tracking_number: { type: DataTypes.STRING, allowNull: true },
  customer_comment: { type: DataTypes.TEXT, allowNull: true },
  manager_notes: { type: DataTypes.TEXT, allowNull: true },
  status_history: { type: DataTypes.JSONB, defaultValue: [] },
  total: { type: DataTypes.FLOAT, allowNull: true },
  // kept for backward compatibility
  isConfirm: { type: DataTypes.BOOLEAN, defaultValue: false },
  inRoad: { type: DataTypes.BOOLEAN, defaultValue: false },
  asComplete: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const OrderDevice = sequelize.define("order_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

const Address = sequelize.define("address", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: "HOME" },
  full_name: { type: DataTypes.STRING, allowNull: false },
  address_line: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: true },
  state_province: { type: DataTypes.STRING, allowNull: true },
  zip_postal_code: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: false },
  phone_number: { type: DataTypes.STRING, allowNull: false },
});

// 🔗 **Зв’язки**
User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

BasketDevice.belongsTo(Device);
Device.hasMany(BasketDevice);

Device.hasMany(DeviceInfo, { as: "info" });
DeviceInfo.belongsTo(Device);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Type.hasMany(Device);
Device.belongsTo(Type);

Device.hasMany(Rating);
Rating.belongsTo(Device);

User.hasMany(Rating);
Rating.belongsTo(User);

Order.hasMany(OrderDevice);
OrderDevice.belongsTo(Order);

Device.hasMany(OrderDevice);
OrderDevice.belongsTo(Device);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Address);
Address.belongsTo(User);

module.exports = {
  User,
  Basket,
  BasketDevice,
  Rating,
  Device,
  DeviceInfo,
  Type,
  Brand,
  Order,
  OrderDevice,
  Address,
};
