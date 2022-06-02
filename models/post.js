import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
	{
		name: { type: Schema.Types.ObjectId, ref: 'User' },
		text: { type: String, required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
		picture: { type: String },
	},
	{ timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
