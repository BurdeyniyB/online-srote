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
  comment: { type: DataTypes.STRING, allowNull: false },
});

const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER, allowNull: false },
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

const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

BasketDevice.hasMany(Basket);
Basket.belongsTo(BasketDevice);

BasketDevice.hasOne(Device);
Device.belongsTo(BasketDevice);

Device.hasMany(DeviceInfo);
DeviceInfo.belongsTo(Device);

Device.hasMany(Brand);
Brand.belongsTo(Device);

Device.hasMany(Type);
Type.belongsTo(Device);

Device.hasOne(Rating);
Rating.belongsTo(Device);

Rating.hasMany(User);
User.belongsTo(Rating);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Basket,
  BasketDevice,
  Rating,
  Device,
  DeviceInfo,
  Type,
  Brand,
  TypeBrand
};
