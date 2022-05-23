import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true, minlength: 1 },
		lastName: { type: String, required: true, minlength: 1 },
		email: { type: String, required: true, minlength: 3 },
		password: { type: String, required: true },
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
