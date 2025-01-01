const Router = require("express");
const deviceController = require("../controller/deviceController");
const router = new Router();

router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);

module.exports = router;
