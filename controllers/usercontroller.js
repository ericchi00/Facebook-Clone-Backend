import 'dotenv/config';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
			const { email, password, firstName, lastName } = req.body;
			const user = await User.create({
				firstName,
				lastName,
				email,
				password,
			});
			const token = jwt.sign({ user }, process.env.JWT_TOKEN);
			const returnUser = { ...user.toJSON(), ...{ token } };

			delete returnUser.password;

			return res.status(201).json(returnUser);
		} catch (error) {
			return next(error);
		}
	},
];

const loginPost = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && user.email) {
			if (await bcrypt.compare(password, user.password)) {
				const token = jwt.sign(
					{ id: user._id, email: user.email },
					process.env.JWT_TOKEN,
					{
						expiresIn: '1h',
					}
				);
				const returnUser = {
					authState: {
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
					},
					expiresIn: 60,
					token,
				};
				return res.status(200).json(returnUser);
			}
		}
		throw new Error('Incorrect username or password or does not exist');
	} catch (error) {
		return next(error);
	}
};

const logoutPost = (req, res, next) => {
	try {
		req.logout();
	} catch (error) {
		next(error);
	}
};

const getProfileInfo = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		const returnUser = { ...user.toJSON() };

		delete returnUser.password;

		return res.status(200).json(returnUser);
	} catch (error) {
		next(error);
	}
};

export { registerPost, loginPost, logoutPost, getProfileInfo };
