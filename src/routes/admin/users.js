const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Journey = require("../../models/Journey");
const {
	isAuthenticated,
	isNotUser,
	isAdmin,
} = require("../../middlewares/auth");

router.get("/admin/users", [isAuthenticated, isNotUser], async (req, res) => {
	const users = await User.find({ state: 1 });

	res.render("admin/users/index.html", {
		title: "Listar usuarios",
		route: "admin.users",
		users: users.filter((user) => user.role == "USER_ROLE"),
		moderators: users.filter((user) => user.role == "MODERATOR_ROLE"),
	});
});

router.get(
	"/admin/users/create",
	[isAuthenticated, isAdmin],
	async (req, res) => {
		res.render("admin/users/create.html", {
			title: "Agregar usuario",
			route: "admin.users",
		});
	}
);

router.post("/admin/users", [isAuthenticated, isAdmin], async (req, res) => {
	const { name, username, type, password, password_confirm } = req.body;
	const errors = [];

	const email = `${username}@mobike.com`;
	const emailUser = await User.findOne({ email });

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

	if (!(type == "normal" || type == "moderator")) {
		errors.push({ text: "El tipo de usuario es invalido" });
	}

	if (errors.length > 0) {
		req.flash("error_msg", errors);
		req.flash("data", { name, username, type, password, password_confirm });
		return res.redirect("/admin/users/create");
	}

	const role = type == "normal" ? "USER_ROLE" : "MODERATOR_ROLE";
	const newUser = new User({ name, email, role, password });
	newUser.password = await newUser.encryptPassword(password);

	await newUser.save();

	req.flash("success_msg", "Usuario creado correctamente");
	return res.redirect("/admin/users");
});

router.get(
	"/admin/users/:id",
	// [isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		User.findById(id, async (err, user) => {
			if (user.role !== "USER_ROLE") {
				req.flash("error", "El usuario no existe");
				return res.redirect("/admin/users");
			}

			const journeys = await Journey.find({ user_id: user._id }).lean({
				virtuals: true,
			});
			console.log(journeys);

			res.render("admin/users/view.html", {
				title: "Ver usuario",
				route: "admin.users",
				user,
				journeys: journeys.reverse(),
			});
		});
	}
);

router.delete(
	"/admin/users/:id",
	[isAuthenticated, isNotUser],
	async (req, res) => {
		const id = req.params.id;

		User.findByIdAndUpdate(id, { state: 0 }, { new: true }, (err, user) => {
			if (err)
				return res.status(500).json({ ok: false, err: "Error del servidor" });
			if (!user)
				return res.status(400).json({ ok: false, err: "El usuario no existe" });

			req.flash("success_msg", "Usuario dado de baja");
			res.redirect("/admin/users");
		});
	}
);

module.exports = router;
