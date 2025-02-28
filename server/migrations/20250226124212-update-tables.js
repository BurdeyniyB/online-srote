"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("devices", "inStock", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn("devices", "sale", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "isHidden", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("basket_devices", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn("order_devices", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.removeColumn("orders", "address");

    await queryInterface.addColumn("orders", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "country", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "state_province", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "zip_postal_code", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "payment", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("orders", "isConfirm", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("orders", "inRoad", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("orders", "asComplete", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("devices", "inStock");
    await queryInterface.removeColumn("devices", "sale");
    await queryInterface.removeColumn("devices", "isHidden");
    await queryInterface.removeColumn("basket_devices", "quantity");
    await queryInterface.removeColumn("order_devices", "quantity");

    await queryInterface.removeColumn("orders", "phone_number");
    await queryInterface.removeColumn("orders", "email");
    await queryInterface.removeColumn("orders", "country");
    await queryInterface.removeColumn("orders", "state_province");
    await queryInterface.removeColumn("orders", "zip_postal_code");
    await queryInterface.removeColumn("orders", "payment");
    await queryInterface.removeColumn("orders", "isConfirm");
    await queryInterface.removeColumn("orders", "inRoad");
    await queryInterface.removeColumn("orders", "asComplete");

    await queryInterface.addColumn("orders", "address", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
