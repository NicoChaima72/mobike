const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const token = req.get("Authorization");
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(401).json({ ok: false, err: "Token no valido" });

		req.user = decoded.user;

		next();
	});
};

const isAdmin = (req, res, next) => {
	const user = req.user;

	if (user.role !== "ADMIN_ROLE") {
		return res.status(401).json({ ok: false, err: "No eres administrador" });
	}

	next();
};

module.exports = { verifyToken, isAdmin };
