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
				// done(error, return usuario, mensaje)
				req.flash("data", { email, password });
				return done(null, false, {
					message: "Email y/o contraseña incorrectos",
				});
			} else {
				const match = await user.matchPassword(password);
				if (match) {
					return done(null, user);
				} else {
					req.flash("data", { email, password });
					return done(null, false, {
						message: "Email y/o contraseña incorrectos",
					});
				}
			}
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
