import { Router } from 'express';
import passport from 'passport';
import { postUserPost } from '../controllers/postcontroller.js';
import {
	putUserInfo,
	getProfileInfo,
	putUserPicture,
	putFriendRequest,
	getFriends,
	getFriendRequest,
	putFriend,
	deleteFriend,
	deleteFriendRequest,
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

router.get(
	'/friends/:id',
	passport.authenticate('jwt', { session: false }),
	getFriends
);

router.get(
	'/friends/request/:id',
	passport.authenticate('jwt', { session: false }),
	getFriendRequest
);

router.put(
	'/friends/request',
	passport.authenticate('jwt', { session: false }),
	putFriendRequest
);

router.put(
	'/friends/request/:id',
	passport.authenticate('jwt', { session: false }),
	putFriend
);

router.delete(
	'/friends/request',
	passport.authenticate('jwt', { session: false }),
	deleteFriendRequest
);

router.delete(
	'/friends/:id',
	passport.authenticate('jwt', { session: false }),
	deleteFriend
);

export default router;
