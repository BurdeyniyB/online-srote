const Router = require("express");
const ratingController = require("../controller/ratingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.post("/", authMiddleware, ratingController.add);
router.get("/", ratingController.getAllDeviceComment);

module.exports = router;
    