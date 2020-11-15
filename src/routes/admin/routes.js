const express = require("express");
const router = express.Router();

// const User = require("../models/User");
const { isAuthenticated, isNotUser } = require("../../middlewares/auth");

router.get("/admin", [isAuthenticated, isNotUser], async (req, res) => {
	res.redirect("/admin/users");
});

module.exports = router;
