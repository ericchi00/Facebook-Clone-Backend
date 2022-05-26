import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true, minlength: 1 },
		lastName: { type: String, required: true, minlength: 1 },
		email: { type: String, unique: true, required: true, minlength: 5 },
		password: { type: String, required: true },
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		friendRequest: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		picture: { type: Schema.Types.ObjectId, ref: 'Img' },
	},
	{ timestamps: true }
);

userSchema.pre('save', async function () {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
});

userSchema.pre('save', function (next) {
	const user = this;
	user.firstName =
		user.firstName.charAt(0).toUpperCase() +
		user.firstName.slice(1).toLowerCase();
	user.lastName =
		user.lastName.charAt(0).toUpperCase() +
		user.lastName.slice(1).toLowerCase();
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
