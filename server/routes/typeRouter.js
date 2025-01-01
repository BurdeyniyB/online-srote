const Router = require("express");
const typeController = require("../controller/typeController");
const router = new Router();

router.post("/", typeController.create);
router.get("/", typeController.getAll);

module.exports = router;
