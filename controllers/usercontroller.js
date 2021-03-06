import 'dotenv/config';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';

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
				return res.status(409).json(errors);
			}
			const { email, password, firstName, lastName } = req.body;

			bcrypt.hash(password, 10, async (err, hashedPassword) => {
				if (err) return next(err);
				await User.create({
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: hashedPassword,
				});
				return res.status(201).json({ status: 'success' });
			});
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
						picture: user.picture,
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

const getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find(
			{},
			'_id firstName lastName picture sentFriendRequest friends friendRequest'
		).sort({ firstName: 1 });
		return res.status(200).json(users);
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

const putUserInfo = [
	body('firstName')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('First name must be at least 1 characters'),
	body('lastName')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Last name must be at least 1 characters'),
	body('email')
		.trim()
		.isLength({ min: 5 })
		.withMessage('Email must be at least 5 characters')
		.isEmail()
		.normalizeEmail(),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json(errors);
			}
			const { password, email, firstName, lastName } = req.body;

			const user = await User.findById(req.params.id);
			const updateEmail = await User.exists({ email: email });
			if (await bcrypt.compare(password, user.password)) {
				if (user.email === email) {
					user.firstName = firstName;
					user.lastName = lastName;
				} else if (updateEmail) {
					return res.status(401).json({
						status: 'failure',
						data: {
							email: 'Email already exists',
						},
					});
				} else {
					user.firstName = firstName;
					user.lastName = lastName;
					user.email = email;
				}
				await user.save();
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
						picture: user.picture,
					},
					expiresIn: 60,
					token,
				};
				return res.status(200).json(returnUser);
			}

			return res
				.status(401)
				.json({ status: 'error', message: 'Failed to update user info' });
		} catch (error) {
			return next(error);
		}
	},
];

const putUserPicture = async (req, res, next) => {
	try {
		const { picture } = req.body;
		await User.findByIdAndUpdate(req.params.id, { picture: picture }).exec();
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const getFriends = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id)
			.populate({
				path: 'friends',
				select: 'firstName lastName _id picture',
				options: { sort: { firstName: 1 } },
			})
			.select('friends');

		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const getFriendRequest = async (req, res, next) => {
	try {
		const friendRequestArray = await User.findById(req.params.id)
			.populate({
				path: 'friendRequest',
				select: 'firstName lastName _id picture',
			})
			.select('friendRequest');
		return res.status(200).json(friendRequestArray);
	} catch (error) {
		next(error);
	}
};

const putFriendRequest = async (req, res, next) => {
	try {
		const [user, friend] = await Promise.all([
			User.findById(req.body.user),
			User.findById(req.body.friend),
		]);

		if (
			friend.friendRequest.includes(req.body.user) ||
			user.sentFriendRequest.includes(req.body.friend)
		) {
			return res.status(409).status({
				status: 'failure',
				message: 'User already sent friend request',
			});
		}

		friend.friendRequest.push(req.body.user);
		await friend.save();
		user.sentFriendRequest.push(req.body.friend);
		await user.save();

		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const deleteFriendRequest = async (req, res, next) => {
	try {
		const [user, friend] = await Promise.all([
			User.findById(req.body.user),
			User.findById(req.body.friend),
		]);
		user.sentFriendRequest.pull(req.body.friend);
		user.friendRequest.pull(req.body.friend);
		await user.save();
		friend.friendRequest.pull(req.body.user);
		friend.sentFriendRequest.pull(req.body.user);
		await friend.save();

		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const putFriend = async (req, res, next) => {
	try {
		const [user, friend] = await Promise.all([
			User.findById(req.body.user),
			User.findById(req.body.friend),
		]);

		if (user.friends.includes(req.body.friend)) {
			return res.status(409).json({
				status: 'failure',
				message: 'User is already friends with this person.',
			});
		}

		user.sentFriendRequest.pull(req.body.friend);
		user.friendRequest.pull(req.body.friend);
		user.friends.push(req.body.friend);
		await user.save();

		friend.friendRequest.pull(req.body.user);
		friend.sentFriendRequest.pull(req.body.user);
		friend.friends.push(req.body.user);
		await friend.save();

		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const deleteFriend = async (req, res, next) => {
	try {
		const [user, friend] = await Promise.all([
			User.findById(req.params.id),
			User.findById(req.body.friend),
		]);

		user.friends.pull(req.body.friend);
		await user.save();
		friend.friends.pull(req.params.id);
		await friend.save();

		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

export {
	registerPost,
	loginPost,
	putUserInfo,
	getProfileInfo,
	putUserPicture,
	putFriendRequest,
	deleteFriendRequest,
	getFriends,
	getFriendRequest,
	putFriend,
	deleteFriend,
	getAllUsers,
};
