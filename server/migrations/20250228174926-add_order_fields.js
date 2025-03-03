"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    await queryInterface.removeColumn("orders", "email");
    await queryInterface.removeColumn("orders", "country");
    await queryInterface.removeColumn("orders", "state_province");
    await queryInterface.removeColumn("orders", "zip_postal_code");
    await queryInterface.removeColumn("orders", "payment");
    await queryInterface.removeColumn("orders", "isConfirm");
    await queryInterface.removeColumn("orders", "inRoad");
    await queryInterface.removeColumn("orders", "asComplete");
  },
};
