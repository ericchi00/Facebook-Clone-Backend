import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true, minlength: 1 },
		lastName: { type: String, required: true, minlength: 1 },
		email: { type: String, required: true, minlength: 5 },
		password: { type: String, required: true },
		friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		friendRequest: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		picture: { type: Schema.Types.ObjectId, ref: 'Img' },
	},
	{ timestamps: true }
);

userSchema.pre('save', function (next) {
	const user = this;
	if (user.password) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);

				user.salt = salt;
				user.password = hash;
				next();
			});
		});
	}
});

const User = mongoose.model('User', userSchema);

export default User;
