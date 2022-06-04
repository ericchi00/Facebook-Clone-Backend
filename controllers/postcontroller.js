import { body, validationResult } from 'express-validator';
import Post from '../models/post.js';

const getAllPosts = async (req, res, next) => {
	try {
		const list = await Post.find()
			.populate('name', 'firstName lastName picture likes')
			.populate({
				path: 'comments',
				populate: { path: 'name', select: 'firstName lastName _id picture' },
				options: { sort: { createdAt: -1 } },
			})
			.sort([['createdAt', 'descending']]);
		return res.status(200).json(list);
	} catch (error) {
		next(error);
	}
};

const postUserPost = [
	body('userPost')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Must be at least 1 character long'),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json(errors);
			}

			const { userPost, picture } = req.body;
			await Post.create({
				name: req.params.id,
				text: userPost,
				picture: picture,
			});
			return res.status(200).json({ status: 'success' });
		} catch (error) {
			next(error);
		}
	},
];

const putPostLike = async (req, res, next) => {
	try {
		const { name } = req.body;
		const post = await Post.findById(req.params.id);
		if (post.likes.includes(name)) {
			post.likes.pull(name);
		} else {
			post.likes.push(name);
		}
		post.save();
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

export { getAllPosts, postUserPost, putPostLike };
