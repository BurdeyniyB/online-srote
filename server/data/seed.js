require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const sequelize = require("../db");
const { Brand, Type, Device, DeviceInfo } = require("../models/models");
const data = require("./data.json");

function cleanCategoryName(categoryName) {
  return categoryName.replace(/_\d+$/, "").replace(/_/g, " ");
}

function parseFeatures(featuresText) {
  if (!featuresText) return [];
  return featuresText
    .split(" | ")
    .map((feature) => {
      const colonIdx = feature.indexOf(":");
      if (colonIdx === -1) return null;
      return {
        title: feature.substring(0, colonIdx).trim().substring(0, 255),
        description: feature.substring(colonIdx + 1).trim().substring(0, 255),
      };
    })
    .filter((f) => f && f.title && f.description)
    .slice(0, 5);
}

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await DeviceInfo.destroy({ where: {}, truncate: { cascade: true } });
    await Device.destroy({ where: {}, truncate: { cascade: true } });
    await Brand.destroy({ where: {}, truncate: { cascade: true } });
    await Type.destroy({ where: {}, truncate: { cascade: true } });

    // Types from unique category_name
    const categorySet = new Set(data.map((item) => item.category_name));
    const typeMap = {};
    for (const categoryName of categorySet) {
      const [type] = await Type.findOrCreate({
        where: { name: cleanCategoryName(categoryName) },
      });
      typeMap[categoryName] = type;
    }
    console.log(`Created ${categorySet.size} types.`);

    // Brands from unique brand
    const brandSet = new Set(data.map((item) => item.brand));
    const brandMap = {};
    for (const brandName of brandSet) {
      const [brand] = await Brand.findOrCreate({ where: { name: brandName } });
      brandMap[brandName] = brand;
    }
    console.log(`Created ${brandSet.size} brands.`);

    // Devices
    let seeded = 0;
    let skipped = 0;
    for (const item of data) {
      if (item.price == null) {
        skipped++;
        continue;
      }
      try {
        const device = await Device.create({
          amazonId:     item.id,
          source:       item.source,
          name:         item.title.substring(0, 255),
          price:        item.price,
          priceText:    item.price_text,
          rating:       item.rating ?? null,
          reviewCount:  item.review_count ?? null,
          availability: item.availability,
          img:          item.image_urls?.[0] ?? "",
          imageUrls:    item.image_urls ?? [],
          imagesCount:  item.images_count ?? 0,
          specs:        item.specs ?? null,
          inStock:      item.availability === "In Stock",
          sale:         0,
          isHidden:     false,
          brandId:      brandMap[item.brand].id,
          typeId:       typeMap[item.category_name].id,
        });

        const features = parseFeatures(item.specs?.features_text);
        if (features.length > 0) {
          await DeviceInfo.bulkCreate(
            features.map((f) => ({ ...f, deviceId: device.id }))
          );
        }

        seeded++;
        if (seeded % 50 === 0) console.log(`Seeded ${seeded}/${data.length}...`);
      } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
          skipped++;
        } else {
          throw e;
        }
      }
    }

    console.log(`Done. Seeded: ${seeded}, skipped duplicates: ${skipped}.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
