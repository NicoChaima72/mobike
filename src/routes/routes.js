const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { isAuthenticated, isUser } = require("../middlewares/auth");

router.get("/", [isAuthenticated, isUser], async (req, res) => {
	res.render("pages/home.html", { title: "Inicio", route: "pages.home" });
});

module.exports = router;
