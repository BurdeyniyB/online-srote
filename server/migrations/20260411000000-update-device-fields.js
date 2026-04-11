"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change price from INTEGER to FLOAT
    await queryInterface.changeColumn("devices", "price", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    // Remove description (moved to specs.description)
    await queryInterface.removeColumn("devices", "description");

    // Add new columns
    await queryInterface.addColumn("devices", "amazonId", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "source", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "priceText", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "rating", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "reviewCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "availability", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "imageUrls", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "imagesCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("devices", "specs", {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("devices", "amazonId");
    await queryInterface.removeColumn("devices", "source");
    await queryInterface.removeColumn("devices", "priceText");
    await queryInterface.removeColumn("devices", "rating");
    await queryInterface.removeColumn("devices", "reviewCount");
    await queryInterface.removeColumn("devices", "availability");
    await queryInterface.removeColumn("devices", "imageUrls");
    await queryInterface.removeColumn("devices", "imagesCount");
    await queryInterface.removeColumn("devices", "specs");

    await queryInterface.changeColumn("devices", "price", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn("devices", "description", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
