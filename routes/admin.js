const express = require("express");
const admin = require("../controllers/admin");
const isAuth = require("../middleware/isauth");

const router = express.Router();

router.get("/register", admin.GetRegister);
router.post("/register", admin.PostRegister);

router.get("/login", admin.GetLogin);
router.post("/login", admin.PostLogin);

router.post("/logout", isAuth, admin.logout);

module.exports = router;
