const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
};

const isNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/");
	}
};

const isUser = (req, res, next) => {
	if (req.user.role === "USER_ROLE") {
		return next();
	} else {
		res.redirect("/admin");
	}

	next();
};

const isNotUser = (req, res, next) => {
	if (req.user.role !== "USER_ROLE") {
		return next();
	} else {
		res.redirect("/");
	}

	next();
};

const isAdmin = (req, res, next) => {
	if (req.user.role === "ADMIN_ROLE") {
		return next();
	} else {
		res.redirect("/");
	}

	next();
};

const isModerator = (req, res, next) => {
	if (req.user.role === "MODERATOR_ROLE") {
		return next();
	} else {
		res.redirect("/");
	}

	next();
};
module.exports = {
	isAuthenticated,
	isNotAuthenticated,
	isUser,
	isNotUser,
	isAdmin,
	isModerator,
};
