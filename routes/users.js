import { Router } from 'express';
import passport from 'passport';
import {
	registerPost,
	loginPost,
	putUserInfo,
	getProfileInfo,
	putUserPicture,
} from '../controllers/usercontroller.js';

const router = Router();

router.post('/register', registerPost);

router.post('/login', loginPost);

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

router.get(
	'/profile/:id',
	passport.authenticate('jwt', { session: false }),
	getProfileInfo
);

export default router;
