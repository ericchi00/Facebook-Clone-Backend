import { Router } from 'express';
import passport from 'passport';
import { getProfileInfo } from '../controllers/usercontroller.js';

const router = Router();

router.get(
	'/profile/:id',
	passport.authenticate('jwt', { session: false }),
	getProfileInfo
);

export default router;
