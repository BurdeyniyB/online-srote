const { OrderDevice, Order } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    const {
      userId,
      devices,
      phoneNumber,
      email,
      country,
      stateProvince,
      zipPostalCode,
      payment,
    } = req.body;

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return next(ApiError.badRequest("Devices list is required"));
    }

    try {
      console.log('Creating order with data:', req.body);

      const order = await Order.create({
        userId: userId,
        phone_number: phoneNumber,
        email,
        country,
        state_province: stateProvince,
        zip_postal_code: zipPostalCode,
        payment,
      });

      // Логування після створення замовлення
      console.log('Order created:', order);

      const orderDevices = await Promise.all(
        devices.map(async ({ deviceId, quantity }) => {
          return await OrderDevice.create({
            orderId: order.id,
            deviceId,
            quantity: quantity || 1,
          });
        })
      );

      return res.json({ order, orderDevices });
    } catch (error) {
      // Логування помилки
      console.error('Error creating order:', error);
      return next(ApiError.internal("Error creating order"));
    }
  }

  async getAll(req, res, next) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;

    try {
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
    } catch (error) {
      return next(ApiError.internal("Error fetching orders"));
    }
  }

  async delete(req, res, next) {
    const { orderId } = req.params;

    if (!orderId) {
      return next(ApiError.badRequest("Order ID is required"));
    }

    try {
      const result = await Order.destroy({ where: { id: orderId } });

      if (result === 0) {
        return next(ApiError.internal("Order not found"));
      }

      return res.json({ message: "Order removed" });
    } catch (error) {
      return next(ApiError.internal("Error deleting order"));
    }
  }

  async updateStatus(req, res, next) {
    const { orderId, isConfirm, inRoad, asComplete } = req.body;

    if (!orderId) {
      return next(ApiError.badRequest("Order ID is required"));
    }

    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        return next(ApiError.badRequest("Order not found"));
      }

      const updatedOrder = await order.update({
        isConfirm: isConfirm !== undefined ? isConfirm : order.isConfirm,
        inRoad: inRoad !== undefined ? inRoad : order.inRoad,
        asComplete: asComplete !== undefined ? asComplete : order.asComplete,
      });

      return res.json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
      return next(ApiError.internal("Error updating order status"));
    }
  }
}

module.exports = new OrderController();
