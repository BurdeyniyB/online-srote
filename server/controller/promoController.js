const { PromoCode } = require("../models/models");

class PromoController {
  async getAll(req, res) {
    try {
      const promos = await PromoCode.findAll({ order: [["createdAt", "DESC"]] });
      return res.json(promos);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      const { code, discount, description, isActive } = req.body;
      if (!code || discount == null) {
        return res.status(400).json({ message: "code and discount are required" });
      }
      const promo = await PromoCode.create({
        code: code.trim().toUpperCase(),
        discount: Number(discount),
        description: description || null,
        isActive: isActive !== false,
      });
      return res.json(promo);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Promo code already exists" });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, discount, description, isActive } = req.body;
      const promo = await PromoCode.findByPk(id);
      if (!promo) return res.status(404).json({ message: "Not found" });

      await promo.update({
        code: code ? code.trim().toUpperCase() : promo.code,
        discount: discount != null ? Number(discount) : promo.discount,
        description: description !== undefined ? description : promo.description,
        isActive: isActive !== undefined ? isActive : promo.isActive,
      });
      return res.json(promo);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Promo code already exists" });
      }
      return res.status(500).json({ message: e.message });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const promo = await PromoCode.findByPk(id);
      if (!promo) return res.status(404).json({ message: "Not found" });
      await promo.destroy();
      return res.json({ message: "Deleted" });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async validate(req, res) {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ message: "code is required" });

      const promo = await PromoCode.findOne({
        where: { code: code.trim().toUpperCase(), isActive: true },
      });

      if (!promo) {
        return res.status(404).json({ message: "Invalid promo code" });
      }
      return res.json({ code: promo.code, discount: promo.discount });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new PromoController();
