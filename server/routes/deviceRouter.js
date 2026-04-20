const Router = require("express");
const deviceController = require("../controller/deviceController");
const router = new Router();
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), deviceController.create);
router.get("/price-range", deviceController.getPriceRange);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.put("/:id", checkRole("ADMIN"), deviceController.update);
router.delete("/:id", checkRole("ADMIN"), deviceController.remove);

module.exports = router;
