const Router = require("express");
const promoController = require("../controller/promoController");
const checkRole = require("../middleware/checkRoleMiddleware");

const router = new Router();

router.get("/", checkRole("ADMIN"), promoController.getAll);
router.post("/", checkRole("ADMIN"), promoController.create);
router.put("/:id", checkRole("ADMIN"), promoController.update);
router.delete("/:id", checkRole("ADMIN"), promoController.remove);
router.post("/validate", promoController.validate);

module.exports = router;
