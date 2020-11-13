const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/users", [isAuthenticated, isAdmin], async (req, res) => {
	const users = await User.find({ state: 1 });

	res.json({ ok: true, users });
});

router.get("/users/:id", [isAuthenticated, isAdmin], async (req, res) => {
	const id = req.params.id;

	User.findById(id, (err, user) => {
		if (err)
			return res.status(500).json({ ok: false, err: "Error del servidor" });
		if (!user)
			return res.status(400).json({ ok: false, err: "El usuario no existe" });

		res.json({ ok: true, user });
	});
});

router.put("/users/profile", [isAuthenticated], async (req, res) => {
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
