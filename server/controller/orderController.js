const { OrderDevice, Order } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrdrerController {
  async create(req, res, next) {
    const { userId, devicesId, phoneNumber, address } = req.body;
    if (
      !userId ||
      !devicesId ||
      !Array.isArray(devicesId) ||
      devicesId.length === 0
    ) {
      return next(ApiError.badRequest("Missing userId or deviceId"));
    }

    const order = await Order.create({
      phone_number: phoneNumber,
      address,
      userId,
    });
    if (!order) {
      return next(ApiError.internal("Connect with order wrong"));
    }

    const orderDevices = [];
    for (const deviceId of devicesId) {
      const orderDevice = await OrderDevice.create({
        orderId: order.id,
        deviceId,
      });
      orderDevices.push(orderDevice);
    }
    return res.json({ order, orderDevices });
  }

  async getAll(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;

    const orders = await Order.findAndCountAll({
      include: [{ model: OrderDevice }],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json({
      orders: orders.rows,
      total: orders.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(orders.count / limit),
    });
  }

  async delete(req, res) {
    const { orderId } = req.params;
    const result = await Order.destroy({ where: {id: orderId} });

    if (result === 0) {
      return next(ApiError.internal("Order not found"));
    }
    return res.json({ message: "Order removed" });
  }
}

module.exports = new OrdrerController();
