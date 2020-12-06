const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
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

router.get("/cards", [isAuthenticated, isUser], async (req, res) => {
	const cards = await Card.find({ user_id: req.user._id })
		.sort({
			default: -1,
		})
		.lean({ virtuals: true });
	console.log(cards);
	res.render("cards/index.html", {
		title: "Mis tarjetas",
		route: "profile.index",
		cards,
	});
});

router.get("/cards/add", [isAuthenticated, isUser], async (req, res) => {
	res.render("cards/create.html", {
		title: "Agregar tarjeta",
		route: "profile.index",
	});
});

router.post("/cards", [isAuthenticated, isUser], async (req, res) => {
	const { type, name, number, expire, cvc } = req.body;
	const user_id = req.user._id;
	const errors = [];
	const userCard = await Card.find({ number: number, user_id: user_id });
	console.log(userCard);
	if (userCard.length > 0) {
		errors.push({ text: "La tarjeta ya está registrada" });
	}
	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, number });
		return res.redirect("/cards/add");
	}
	const card = { user_id, type, name, number, expire, cvc };
	await Card.update({ user_id: user_id }, { default: false }, { multi: true });
	await Card.create(card);
	req.flash("success_msg", "Tarjeta agregada");
	res.redirect("/cards");
});

router.post("/cards/:card_id/default", async (req, res) => {
	await Card.update(
		{ user_id: req.user._id },
		{ default: false },
		{ multi: true }
	);
	await Card.findByIdAndUpdate(req.params.card_id, { default: true });
	req.flash("success_msg", "Tarjeta seleccionada");
	res.redirect("/cards");
});

router.delete("/cards/:card_id", async (req, res) => {
	await Card.findByIdAndRemove(req.params.card_id);
	req.flash("success_msg", "Tarjeta eliminada");
	res.redirect("/cards");
});

module.exports = router;
