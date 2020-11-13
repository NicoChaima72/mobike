const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");

router.get("/login", (req, res) => {
	res.render("auth/login.html", { title: "Iniciar sesion" });
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
});

router.get("/register", (req, res) => {
	res.render("auth/register.html", { title: "Registrarme" });
});

router.post("/register", async (req, res) => {
	const { email, name, password, password_confirm } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (errors.length > 0) {
		res.status(400).json({
			ok: false,
			error: errors,
		});
	}

	const newUser = new User({ name, email, password });
	newUser.password = await newUser.encryptPassword(password);

	await newUser.save();

	res.json({ ok: true, user: newUser });
});

router.post("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

module.exports = router;
