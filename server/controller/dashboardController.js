const { Op } = require("sequelize");
const sequelize = require("../db");
const { Order, User } = require("../models/models");

const getStats = async (req, res) => {
  try {
    const period = req.query.period || "30d";
    const daysMap = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
    const days = daysMap[period] || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalRevenue,
      uniqueBuyers,
      totalUsers,
      revenueByDay,
      ordersByStatus,
      salesByType,
      salesByBrand,
      topProducts,
      topCountries,
      topStates,
    ] = await Promise.all([
      Order.count({ where: { status: { [Op.ne]: "cancelled" } } }),
      Order.sum("total", {
        where: { status: { [Op.ne]: "cancelled" }, total: { [Op.not]: null } },
      }),
      Order.count({
        distinct: true,
        col: "userId",
        where: { status: { [Op.ne]: "cancelled" } },
      }),
      User.count(),

      // Revenue by day (period-filtered)
      sequelize.query(
        `SELECT DATE("createdAt") AS date,
                COALESCE(SUM(total), 0)::float AS revenue,
                COUNT(id)::int AS count
         FROM orders
         WHERE "createdAt" >= :since
           AND status != 'cancelled'
           AND total IS NOT NULL
         GROUP BY DATE("createdAt")
         ORDER BY DATE("createdAt") ASC`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Orders by status — period-filtered
      sequelize.query(
        `SELECT status, COUNT(id)::int AS count
         FROM orders
         WHERE "createdAt" >= :since
         GROUP BY status
         ORDER BY count DESC`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Revenue by product type — period-filtered via order date
      sequelize.query(
        `SELECT t.name,
                COALESCE(SUM(od.quantity), 0)::int           AS "totalQty",
                COALESCE(SUM(od.quantity * d.price), 0)::float AS revenue
         FROM types t
         LEFT JOIN devices d      ON d."typeId" = t.id
         LEFT JOIN order_devices od ON od."deviceId" = d.id
         LEFT JOIN orders o       ON o.id = od."orderId"
                                  AND o.status != 'cancelled'
                                  AND o."createdAt" >= :since
         GROUP BY t.name
         ORDER BY revenue DESC`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Revenue by brand — period-filtered
      sequelize.query(
        `SELECT b.name,
                COALESCE(SUM(od.quantity), 0)::int            AS "totalQty",
                COALESCE(SUM(od.quantity * d.price), 0)::float AS revenue
         FROM brands b
         LEFT JOIN devices d       ON d."brandId" = b.id
         LEFT JOIN order_devices od ON od."deviceId" = d.id
         LEFT JOIN orders o        ON o.id = od."orderId"
                                   AND o.status != 'cancelled'
                                   AND o."createdAt" >= :since
         GROUP BY b.name
         ORDER BY revenue DESC
         LIMIT 10`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Top products by units sold — period-filtered
      sequelize.query(
        `SELECT d.id, d.name, d.price, d.img,
                COALESCE(SUM(od.quantity), 0)::int            AS "totalQty",
                COALESCE(SUM(od.quantity * d.price), 0)::float AS revenue
         FROM devices d
         LEFT JOIN order_devices od ON od."deviceId" = d.id
         LEFT JOIN orders o         ON o.id = od."orderId"
                                    AND o.status != 'cancelled'
                                    AND o."createdAt" >= :since
         GROUP BY d.id, d.name, d.price, d.img
         HAVING COALESCE(SUM(od.quantity), 0) > 0
         ORDER BY "totalQty" DESC
         LIMIT 10`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Top countries — period-filtered
      sequelize.query(
        `SELECT country, COUNT(id)::int AS count
         FROM orders
         WHERE status != 'cancelled'
           AND "createdAt" >= :since
         GROUP BY country
         ORDER BY count DESC
         LIMIT 10`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),

      // Top states/provinces — period-filtered
      sequelize.query(
        `SELECT state_province, COUNT(id)::int AS count
         FROM orders
         WHERE status != 'cancelled'
           AND "createdAt" >= :since
         GROUP BY state_province
         ORDER BY count DESC
         LIMIT 10`,
        { replacements: { since }, type: sequelize.QueryTypes.SELECT }
      ),
    ]);

    return res.json({
      summary: {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        uniqueBuyers,
        totalUsers,
        avgOrderValue:
          totalOrders > 0 ? (totalRevenue || 0) / totalOrders : 0,
      },
      revenueByDay,
      ordersByStatus,
      salesByType,
      salesByBrand,
      topProducts,
      topCountries,
      topStates,
    });
  } catch (e) {
    console.error("Dashboard stats error:", e);
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getStats };
