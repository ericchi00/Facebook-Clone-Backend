import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import User from '../models/user.js';

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(401, false);
			}

			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			}
			return done(401, false);
		} catch (error) {
			return done(error);
		}
	})
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_TOKEN,
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});
