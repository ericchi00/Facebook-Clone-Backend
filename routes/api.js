import { Router } from 'express';
import passport from 'passport';
import { postUserPost } from '../controllers/postcontroller.js';
import {
	putUserInfo,
	getProfileInfo,
	putUserPicture,
} from '../controllers/usercontroller.js';

const router = Router();

router.post(
	'/posts/:id',
	passport.authenticate('jwt', { session: false }),
	postUserPost
);

router.get(
	'/profile/:id',
	passport.authenticate('jwt', { session: false }),
	getProfileInfo
);

router.put(
	'/profile/:id',
	passport.authenticate('jwt', { session: false }),
	putUserInfo
);

router.put(
	'/profile/picture/:id',
	passport.authenticate('jwt', { session: false }),
	putUserPicture
);

export default router;
