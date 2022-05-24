import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true, minlength: 1 },
		lastName: { type: String, required: true, minlength: 1 },
		email: { type: String, required: true, minlength: 5 },
		password: { type: String, required: true },
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		friendRequest: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		picture: { type: Schema.Types.ObjectId, ref: 'Img' },
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
