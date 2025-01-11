const sequelize = require("../db");
const { DataTypes, DATE } = require("sequelize");

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
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING, allowNull: true },
});

const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
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
  phone_number: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
});

const OrderDevice = sequelize.define("order_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Зв’язки
User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

BasketDevice.belongsTo(Device);
Device.hasMany(BasketDevice);

Device.hasMany(DeviceInfo, { as: "info" });
DeviceInfo.belongsTo(Device);

Brand.hasMany(Device); // Один бренд → багато пристроїв
Device.belongsTo(Brand); // Один пристрій → один бренд

Type.hasMany(Device); // Один тип → багато пристроїв
Device.belongsTo(Type); // Один пристрій → один тип

Device.hasMany(Rating); // Один пристрій → багато оцінок
Rating.belongsTo(Device); // Одна оцінка → один пристрій

User.hasMany(Rating); // Один користувач → багато оцінок
Rating.belongsTo(User); // Одна оцінка → один користувач

Order.hasMany(OrderDevice);  
OrderDevice.belongsTo(Order);

Device.hasMany(OrderDevice);  
OrderDevice.belongsTo(Device);

User.hasMany(Order);  // Один користувач може мати багато замовлень
Order.belongsTo(User);  // Одне замовлення належить одному користувачеві

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
  OrderDevice
};
