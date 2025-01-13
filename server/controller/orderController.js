const { OrderDevice, Order } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrdrerController {
  async create(req, res, next) {
    const { userId, devicesId, phone_number, address } = req.body;
    if (!userId || !devicesId || !Array.isArray(devicesId) || devicesId.length === 0) {
      return next(ApiError.badRequest("Missing userId or deviceId"));
    }

    const order = await Order.create({phone_number, address, userId});
    if(!order){
        return next(ApiError.internal("Connect with order wrong"));
    }

    const orderDevices = []
    for(const deviceId of devicesId){
        const orderDevice = await OrderDevice.create({orderId: order.id, deviceId});
        orderDevices.push(orderDevice);
    }
    return res.json({order, orderDevices});
  }

  async getAll(req, res) {
    const orders = await Order.findAll({
        include: [{model: OrderDevice}]
    });

    return res.json(orders)
  }

  async delete(req, res){
    const { orderId } = req.query;
    const result = await Order.destroy({where: orderId})

    if (result === 0) {
        return next(ApiError.internal("Order not found"));
      }
      return res.json({ message: "Order removed" });
  }
}

module.exports = new OrdrerController();
