const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

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
      let { brandId, typeId, minPrice, maxPrice, sortBy, limit, page, search } =
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

      const searchCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { description: { [Op.iLike]: `%${search}%` } },
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

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }
}

module.exports = new DeviceController();
