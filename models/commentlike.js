import mongoose from 'mongoose';

const { Schema } = mongoose;

const likesSchema = new Schema(
	{
		comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const CommentLike = mongoose.model('CommentLike', likesSchema);

export default CommentLike;
