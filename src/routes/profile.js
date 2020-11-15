const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { isAuthenticated, isUser } = require("../middlewares/auth");

router.get("/profile", [isAuthenticated, isUser], async (req, res) => {
	res.render("profile/index.html", {
		title: "Informacion de cuenta",
		route: "profile.index",
	});
});

router.get("/profile/edit", [isAuthenticated, isUser], async (req, res) => {
	res.render("profile/edit.html", {
		title: "Editar mi perfil",
		route: "profile.index",
	});
});

router.put("/profile", [isAuthenticated, isUser], async (req, res) => {
	const id = req.user._id;

	const { name, phone } = req.body;
	const errors = [];

	if (name.length === 0) {
		errors.push({ text: "El nombre es requerido" });
	}

	if (phone.length != 0 && phone.length != 9) {
		errors.push({ text: "El telefono debe tener 9 digitos" });
	}
	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, phone });
		return res.redirect("/profile/edit");
	}

	User.findByIdAndUpdate(
		id,
		phone.length > 0 ? { name, phone } : { name },
		(err, user) => {
			req.flash("success_msg", "Datos actualizados");
			return res.redirect("/profile");
		}
	);
});

module.exports = router;
