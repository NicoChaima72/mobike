const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("../models/User");

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				req.flash("data", { email, password });
				req.flash("error", "Usuario y/o contraseña incorrecta");
				return done(null, false, {});
			}
			const match = await user.matchPassword(password);

			if (!match) {
				req.flash("error", "Usuario y/o contraseña incorrecta");
				req.flash("data", { email, password });
				return done(null, false, {});
			}

			if (user.state === 0) {
				req.flash("error", "Cuenta dada de baja permanentemente");
				req.flash("data", { email, password });
				return done(null, false, {});
			}

			return done(null, user);
		}
	)
);

// si se loguea se almacena en sesion
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// utilizar los datos de la sesion
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});
