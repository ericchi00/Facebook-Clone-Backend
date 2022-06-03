import sanitizeHtml from 'sanitize-html';
import { body, validationResult } from 'express-validator';
import Post from '../models/post.js';

const getAllPosts = async (req, res, next) => {
	try {
		const list = Post.find().populate({
			path: 'comments',
			populate: { path: 'name', select: ['firstName', 'lastName'] },
		});
	} catch (error) {
		next(error);
	}
};

const postUserPost = [
	body('userPost')
		.isLength({ min: 1 })
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

export { getAllPosts, postUserPost };
