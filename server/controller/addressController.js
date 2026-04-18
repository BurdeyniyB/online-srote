const { Address } = require("../models/models");
const ApiError = require("../error/ApiError");

class AddressController {
  async getAll(req, res, next) {
    try {
      const addresses = await Address.findAll({ where: { userId: req.user.id } });
      return res.json(addresses);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { label, type, full_name, address_line, city, state_province, zip_postal_code, country, phone_number } = req.body;
      const address = await Address.create({
        label, type, full_name, address_line, city, state_province, zip_postal_code, country, phone_number,
        userId: req.user.id,
      });
      return res.json(address);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const address = await Address.findOne({ where: { id, userId: req.user.id } });
      if (!address) return next(ApiError.badRequest("Address not found"));
      const { label, type, full_name, address_line, city, state_province, zip_postal_code, country, phone_number } = req.body;
      await address.update({ label, type, full_name, address_line, city, state_province, zip_postal_code, country, phone_number });
      return res.json(address);
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const address = await Address.findOne({ where: { id, userId: req.user.id } });
      if (!address) return next(ApiError.badRequest("Address not found"));
      await address.destroy();
      return res.json({ message: "Address deleted" });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }
}

module.exports = new AddressController();
