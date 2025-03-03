const { BasketDevice, Basket } = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async create(req, res, next) {
    const { userId, deviceId } = req.body;
    if (!userId || !deviceId) {
      return next(ApiError.badRequest("Missing userId or deviceId"));
    }

    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return next(ApiError.internal("Connect with basket wrong"));
    }

    const order = await BasketDevice.create({ basketId: basket.id, deviceId });
    return res.json(order);
  }

  async setQuantity(req, res, next) {
    const { userId, deviceId, quantity } = req.body;
    
    if (!userId || !deviceId) {
      return next(ApiError.badRequest("Missing userId or deviceId"));
    }
  
    if (!quantity || isNaN(quantity) || quantity < 1) {
      return next(ApiError.badRequest("Invalid quantity value"));
    }
  
    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return next(ApiError.internal("Basket not found"));
    }
  
    let basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });
  
    if (!basketDevice) {
      return next(ApiError.badRequest("Device not found in basket"));
    }

    basketDevice.quantity = Number(quantity);
    await basketDevice.save();
  
    return res.json({ message: "Quantity updated", basketDevice });
  }

  async getAll(req, res, next) {
    const { userId } = req.query;
    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return next(ApiError.internal("Basket not found"));
    }

    const orders = await BasketDevice.findAll({
      where: { basketId: basket.id },
    });
    return res.json(orders);
  }

  async delete(req, res, next) {
    const { userId, deviceId } = req.params; 
    if (!userId || !deviceId) {
      return next(ApiError.badRequest("Missing userId"));
    }
  
    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return next(ApiError.internal("Basket not found"));
    }
  
    const result = await BasketDevice.destroy({
      where: { basketId: basket.id, deviceId },
    });
    if (result === 0) {
      return next(ApiError.internal("Device not found in basket"));
    }
    return res.json({ message: "Device removed from basket" });
  }  
}

module.exports = new BasketController();
