import { body, validationResult } from 'express-validator';
import Comment from '../models/comment.js';
import Post from '../models/post.js';

const postComment = [
	body('text')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Must be at least 1 character long'),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json(errors);
			}

			const postID = req.params.id;

			const comment = await Comment.create({
				name: req.body.name,
				text: req.body.text,
				post: req.params.id,
			});

			const post = await Post.findById(postID);

			post.comments.push(comment._id);
			await post.save();

			return res.status(200).json({ status: 'success' });
		} catch (error) {
			next(error);
		}
	},
];

const getComment = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } },
			populate: {
				path: 'name',
				select: 'firstName lastName _id picture',
			},
		});
		return res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

const putCommentLike = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		comment.likes.push(req.body.name);
		await comment.save();
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

export { postComment, getComment, putCommentLike };
