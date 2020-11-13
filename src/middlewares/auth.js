const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "No estás autenticado");
		res.redirect("/login");
	}
};

const isNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "Ya estás autenticado");
		res.redirect("/");
	}
};

const isAdmin = (req, res, next) => {
	if (req.user.role === "ADMIN_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
	}

	next();
};

const isUser = (req, res, next) => {
	if (req.user.role === "USER_ROLE") {
		return next();
	} else {
		req.flash("error", "Solo pueden acceder usuarios");
	}

	next();
};

module.exports = { isAuthenticated, isNotAuthenticated, isAdmin, isUser };
