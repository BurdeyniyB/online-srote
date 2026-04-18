const Router = require("express");
const router = new Router();
const addressController = require("../controller/addressController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, addressController.getAll);
router.post("/", authMiddleware, addressController.create);
router.put("/:id", authMiddleware, addressController.update);
router.delete("/:id", authMiddleware, addressController.remove);

module.exports = router;
