const Router = require("express");
const router = new Router();
const checkRole = require("../middleware/checkRoleMiddleware");
const { getStats } = require("../controller/dashboardController");

router.get("/stats", checkRole("ADMIN"), getStats);

module.exports = router;
