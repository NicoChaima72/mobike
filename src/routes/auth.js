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
	const emailUser = await User.findOne({ email: email });

	if (emailUser) {
		errors.push({ text: "El email ya está registrado" });
	}

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (password.length < 8) {
		errors.push({ text: "Contraseña de minimo 8 caracteres" });
	}

	if (password !== password_confirm) {
		errors.push({ text: "Las contraseñas no coinciden" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, email });
		return res.redirect("/register");
	}

	const newUser = new User({ name, email, password });
	newUser.password = await newUser.encryptPassword(password);

	await newUser.save();

	req.flash("success_msg", "Ahora existes, inicia sesion");
	return res.redirect("/login");
});

router.post("/logout", (req, res) => {
	req.logOut();
	res.redirect("/");
});

module.exports = router;
