const { randomBytes } = require("crypto");
const { OrderDevice, Order, Device } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(randomBytes(8), (b) => chars[b % chars.length]).join("");
}

class OrderController {
  async create(req, res, next) {
    const {
      userId,
      devices,
      phoneNumber,
      email,
      firstName,
      lastName,
      country,
      stateProvince,
      zipPostalCode,
      addressLine,
      payment,
      deliveryMethod,
      deliveryDate,
      deliveryPriority,
      paymentStatus,
      customerComment,
      total,
    } = req.body;

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
      return next(ApiError.badRequest("Devices list is required"));
    }

    try {
      const order = await Order.create({
        order_number: generateOrderNumber(),
        userId,
        phone_number: phoneNumber,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        country,
        state_province: stateProvince,
        zip_postal_code: zipPostalCode,
        address_line: addressLine || null,
        payment,
        delivery_method: deliveryMethod || "standard",
        delivery_date: deliveryDate || null,
        delivery_priority: deliveryPriority || "standard",
        payment_status: paymentStatus || "unpaid",
        customer_comment: customerComment || null,
        total: total || null,
        status_history: [
          {
            timestamp: new Date().toISOString(),
            changed_by: "System",
            changes: { status: { from: null, to: "new" } },
          },
        ],
      });

      const orderDevices = await Promise.all(
        devices.map(({ deviceId, quantity }) =>
          OrderDevice.create({ orderId: order.id, deviceId, quantity: quantity || 1 })
        )
      );

      return res.json({ order, orderDevices });
    } catch (error) {
      console.error("Error creating order:", error);
      return next(ApiError.internal("Error creating order"));
    }
  }

  async getAll(req, res, next) {
    let {
      page,
      limit,
      search,
      status,
      payment_status,
      delivery_status,
      payment,
      date_from,
      date_to,
      amount_min,
      amount_max,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};

    if (search && search.trim()) {
      const s = search.trim();
      const isNum = !isNaN(parseInt(s));
      const like = `%${s}%`;
      where[Op.or] = [
        ...(isNum ? [{ id: parseInt(s) }] : []),
        { phone_number: { [Op.iLike]: like } },
        { email: { [Op.iLike]: like } },
        { first_name: { [Op.iLike]: like } },
        { last_name: { [Op.iLike]: like } },
      ];
    }

    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;
    if (delivery_status) where.delivery_status = delivery_status;
    if (payment) where.payment = payment;

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt[Op.gte] = new Date(date_from);
      if (date_to) {
        const to = new Date(date_to);
        to.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = to;
      }
    }

    if (amount_min || amount_max) {
      where.total = {};
      if (amount_min) where.total[Op.gte] = parseFloat(amount_min);
      if (amount_max) where.total[Op.lte] = parseFloat(amount_max);
    }

    try {
      const orders = await Order.findAndCountAll({
        where,
        include: [
          {
            model: OrderDevice,
            include: [
              { model: Device, attributes: ["id", "name", "price", "img", "sale"] },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        distinct: true,
      });

      return res.json({
        orders: orders.rows,
        total: orders.count,
        currentPage: page,
        totalPages: Math.ceil(orders.count / limit),
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return next(ApiError.internal("Error fetching orders"));
    }
  }

  async delete(req, res, next) {
    const { orderId } = req.params;
    if (!orderId) return next(ApiError.badRequest("Order ID is required"));

    try {
      const result = await Order.destroy({ where: { id: orderId } });
      if (result === 0) return next(ApiError.internal("Order not found"));
      return res.json({ message: "Order removed" });
    } catch (error) {
      return next(ApiError.internal("Error deleting order"));
    }
  }

  async updateStatus(req, res, next) {
    const { orderId, status, payment_status, delivery_status, changed_by } = req.body;
    if (!orderId) return next(ApiError.badRequest("Order ID is required"));

    try {
      const order = await Order.findByPk(orderId);
      if (!order) return next(ApiError.badRequest("Order not found"));

      const historyEntry = {
        timestamp: new Date().toISOString(),
        changed_by: changed_by || "Admin",
        changes: {},
      };

      const updates = {};

      if (status !== undefined && status !== order.status) {
        historyEntry.changes.status = { from: order.status, to: status };
        updates.status = status;
      }
      if (payment_status !== undefined && payment_status !== order.payment_status) {
        historyEntry.changes.payment_status = { from: order.payment_status, to: payment_status };
        updates.payment_status = payment_status;
      }
      if (delivery_status !== undefined && delivery_status !== order.delivery_status) {
        historyEntry.changes.delivery_status = { from: order.delivery_status, to: delivery_status };
        updates.delivery_status = delivery_status;
      }

      if (Object.keys(historyEntry.changes).length > 0) {
        updates.status_history = [...(order.status_history || []), historyEntry];
      }

      const updatedOrder = await order.update(updates);
      return res.json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
      return next(ApiError.internal("Error updating order status"));
    }
  }

  async updateTracking(req, res, next) {
    const { orderId, tracking_number } = req.body;
    if (!orderId) return next(ApiError.badRequest("Order ID is required"));

    try {
      const order = await Order.findByPk(orderId);
      if (!order) return next(ApiError.badRequest("Order not found"));

      const historyEntry = {
        timestamp: new Date().toISOString(),
        changed_by: "Admin",
        changes: { tracking_number: { from: order.tracking_number, to: tracking_number } },
      };

      await order.update({
        tracking_number,
        status_history: [...(order.status_history || []), historyEntry],
      });

      return res.json({ message: "Tracking updated", order });
    } catch (error) {
      return next(ApiError.internal("Error updating tracking"));
    }
  }

  async updateNotes(req, res, next) {
    const { orderId, manager_notes } = req.body;
    if (!orderId) return next(ApiError.badRequest("Order ID is required"));

    try {
      const order = await Order.findByPk(orderId);
      if (!order) return next(ApiError.badRequest("Order not found"));

      await order.update({ manager_notes });
      return res.json({ message: "Notes updated", order });
    } catch (error) {
      return next(ApiError.internal("Error updating notes"));
    }
  }
}

module.exports = new OrderController();
