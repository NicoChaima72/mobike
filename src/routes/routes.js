const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/auth");

router.get("/login", (req, res) => {
	res.json({
		message: "Desplegando rutas login",
	});
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email: email }, async (err, user) => {
		if (err)
			return res.status(500).json({ ok: false, err: "Error del servidor" });
		if (!user)
			return res
				.status(400)
				.json({ ok: false, err: "Usuario y/o contraseña incorrectos" });

		if (user.state === 0) {
			return res.json({ ok: false, err: "Usuario dado de baja" });
		}

		const isMatchPassword = await user.matchPassword(password);
		console.log(isMatchPassword);
		if (!isMatchPassword) {
			return res
				.status(400)
				.json({ ok: false, err: "Usuario y/o contraseña incorrectos" });
		}

		// Si está logueado

		const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
			expiresIn: "48h",
		});

		res.json({ ok: true, user, token });
	});
});

router.get("/register", (req, res) => {});

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

	// Informacion validadada, crear usuario

	const newUser = new User({ name, email, password });
	newUser.password = await newUser.encryptPassword(password);

	await newUser.save();

	res.json({ ok: true, user: newUser });
});

router.get("/users", [verifyToken, isAdmin], async (req, res) => {
	const users = await User.find({ state: 1 });

	res.json({ ok: true, users });
});

router.get("/users/:id", [verifyToken, isAdmin], async (req, res) => {
	const id = req.params.id;

	User.findById(id, (err, user) => {
		if (err)
			return res.status(500).json({ ok: false, err: "Error del servidor" });
		if (!user)
			return res.status(400).json({ ok: false, err: "El usuario no existe" });

		res.json({ ok: true, user });
	});
});

router.put("/users/profile", [verifyToken], async (req, res) => {
	const id = req.user._id;

	const { name } = req.body;
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

	User.findByIdAndUpdate(id, { name }, { new: true }, (err, user) => {
		if (err)
			return res.status(500).json({ ok: false, err: "Error del servidor" });
		if (!user)
			return res.status(400).json({ ok: false, err: "El usuario no existe" });

		res.json({ ok: true, user });
	});
});

router.delete("/users/:id", async (req, res) => {
	const id = req.params.id;

	User.findByIdAndUpdate(id, { state: 0 }, { new: true }, (err, user) => {
		if (err)
			return res.status(500).json({ ok: false, err: "Error del servidor" });
		if (!user)
			return res.status(400).json({ ok: false, err: "El usuario no existe" });

		res.json({ ok: true, user });
	});
});

module.exports = router;
