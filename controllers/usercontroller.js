import 'dotenv/config';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const registerPost = [
	body('email')
		.trim()
		.isLength({ min: 5 })
		.withMessage('Email must be at least 5 characters')
		.isEmail()
		.normalizeEmail()
		.custom((value) =>
			User.exists({ email: value }).then((user) => {
				if (user) {
					return Promise.reject(new Error('Email already taken.'));
				}
				return true;
			})
		),
	body('firstName')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('First name must be at least 1 characters')
		.custom((value) =>
			User.exists({ email: value }).then((user) => {
				if (user) {
					return Promise.reject(new Error('Username already taken.'));
				}
				return true;
			})
		),
	body('lastName')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Last name must be at least 1 characters'),

	body('password')
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 characters'),

	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json(errors);
			}
			const firstName =
				req.body.firstName.charAt(0).toUpperCase() +
				req.body.firstName.slice(1).toLowerCase();
			const lastName =
				req.body.lastName.charAt(0).toUpperCase() +
				req.body.lastName.slice(1).toLowerCase();
			bcrypt.hash(req.body.password, 10, async (error, hashedPassword) => {
				if (error) return next(error);
				const user = new User({
					firstName,
					lastName,
					email: req.body.email,
					password: hashedPassword,
				});
				await user.save();
				res.json('success');
			});
		} catch (error) {
			next(error);
		}
	},
];

const loginPost = async (req, res, next) => {
	passport.authenticate('local', async (err, user, info) => {
		try {
			if (err || !user) {
				return next(err);
			}

			req.login(user, { session: false }, (error) => {
				if (error) {
					return next(error);
				}
				const token = jwt.sign({ user }, process.env.JWT_TOKEN, {
					expiresIn: '15m',
				});
				return res.json({
					authState: {
						email: user.email,
						id: user._id,
					},
					expiresIn: 15,
					token,
				});
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

const logoutPost = (req, res, next) => {
	try {
		req.logout();
	} catch (error) {
		next(error);
	}
};

export { registerPost, loginPost, logoutPost };
