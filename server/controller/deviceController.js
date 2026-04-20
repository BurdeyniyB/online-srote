const uuid = require("uuid");
const path = require("path");
const sequelize = require("../db");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op, literal } = require("sequelize");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, description, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        description,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res) {
    try {
      let { brandId, typeId, minPrice, maxPrice, sortBy, limit, page, search, minRating, inStockOnly, onSaleOnly, outOfStockOnly } =
        req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 20;
      let offset = (page - 1) * limit;
      let devices;

      // Перетворення brandId та typeId у масиви чисел, якщо вони передані
      brandId = brandId
        ? brandId
            .toString()
            .split(",")
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id))
        : [];

      typeId = typeId
        ? typeId
            .toString()
            .split(",")
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id))
        : [];

      const parsedId = parseInt(search, 10);
      const idMatch = !isNaN(parsedId) && String(parsedId) === String(search).trim();
      const searchCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              literal(`"device"."specs"::text ILIKE '%${search.replace(/'/g, "''")}%'`),
              ...(idMatch ? [{ id: parsedId }] : []),
            ],
          }
        : {};

      const priceCondition =
        minPrice && maxPrice
          ? { price: { [Op.between]: [minPrice, maxPrice] } }
          : minPrice
          ? { price: { [Op.gte]: minPrice } }
          : maxPrice
          ? { price: { [Op.lte]: maxPrice } }
          : {};

      const whereCondition = {
        ...searchCondition,
        ...priceCondition,
        ...(brandId && brandId.length ? { brandId: { [Op.in]: brandId } } : {}),
        ...(typeId && typeId.length ? { typeId: { [Op.in]: typeId } } : {}),
        ...(minRating ? { rating: { [Op.gte]: parseFloat(minRating) } } : {}),
        ...(inStockOnly === "true" ? { inStock: true } : {}),
        ...(outOfStockOnly === "true" ? { inStock: false } : {}),
        ...(onSaleOnly === "true" ? { sale: { [Op.gt]: 0 } } : {}),
      };

      let order = [];
      switch(sortBy){
        case "price_asc":
         order.push(["price", "ASC"])
        break;
        case "price_desc":
         order.push(["price", "DESC"])
        break;
        case "date_asc":
          order.push(["createdAt", "ASC"])
          break;
        case "date_desc":
          order.push(["createdAt", "DESC"])
          break;
        default:
          order.push(["createdAt", "DESC"])
      }

      devices = await Device.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order,
      });

      return res.json(devices);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getPriceRange(req, res) {
    try {
      const result = await Device.findOne({
        attributes: [
          [sequelize.fn("MIN", sequelize.col("price")), "min"],
          [sequelize.fn("MAX", sequelize.col("price")), "max"],
        ],
        raw: true,
      });
      return res.json({ min: Number(result.min) || 0, max: Number(result.max) || 50000 });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      let { name, description, price, brandId, typeId, info, inStock, sale } = req.body;
      const device = await Device.findOne({ where: { id } });
      if (!device) return next(ApiError.badRequest("Device not found"));

      if (name !== undefined) device.name = name;
      if (description !== undefined) device.description = description;
      if (price !== undefined) device.price = Number(price);
      if (brandId !== undefined) device.brandId = Number(brandId);
      if (typeId !== undefined) device.typeId = Number(typeId);
      if (inStock !== undefined) device.inStock = inStock === "true" || inStock === true;
      if (sale !== undefined) device.sale = Number(sale) || 0;

      if (req.files && req.files.img) {
        let fileName = uuid.v4() + ".jpg";
        await req.files.img.mv(path.resolve(__dirname, "..", "static", fileName));
        device.img = fileName;
      }

      await device.save();

      if (info !== undefined) {
        await DeviceInfo.destroy({ where: { deviceId: id } });
        const parsedInfo = JSON.parse(info);
        await Promise.all(
          parsedInfo.map((i) =>
            DeviceInfo.create({ title: i.title, description: i.description, deviceId: id })
          )
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await DeviceInfo.destroy({ where: { deviceId: id } });
      await Device.destroy({ where: { id } });
      return res.json({ message: "Device deleted" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new DeviceController();
