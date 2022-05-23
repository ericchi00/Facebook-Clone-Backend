import mongoose from 'mongoose';

const { Schema } = mongoose;

const likesSchema = new Schema({
	post: { type: Schema.Types.ObjectId, ref: 'Post' },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const PostLike = mongoose.model('PostLike', likesSchema);

export default PostLike;
