import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
// eslint-disable-next-line import/extensions
import User from '../models/user.js';

const applyPassportStrategy = (passport) => {
	passport.use(
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_TOKEN,
			},
			async (token, done) => {
				try {
					const user = await User.findOne({ email: token.email });
					if (user) {
						return done(null, {
							email: user.email,
							// eslint-disable-next-line no-underscore-dangle
							id: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
						});
					}
					return done(null, false);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

export default applyPassportStrategy;
