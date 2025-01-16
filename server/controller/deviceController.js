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
    let { brandId, typeId, limit, page, search } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    const searchCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },  
          ],
        }
      : {};

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: searchCondition,
        limit,
        offset,
      });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, ...searchCondition },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, ...searchCondition },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, typeId, ...searchCondition },
        limit,
        offset,
      });
    }

    return res.json(devices);
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
