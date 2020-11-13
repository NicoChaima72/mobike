const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", async (req, res) => {
	res.render("pages/home.html", { title: "Inicio", route: "pages.home" });
});

module.exports = router;
