import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		name: { type: Schema.Types.ObjectId, ref: 'User' },
		text: { type: String, required: true, minlength: 1 },
		post: { type: Schema.Types.ObjectId, ref: 'Post' },
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
