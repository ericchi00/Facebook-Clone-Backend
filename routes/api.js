import { Router } from 'express';
import passport from 'passport';
import {
	getAllPosts,
	postUserPost,
	putPostLike,
	getUserPosts,
} from '../controllers/postcontroller.js';
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
	getAllUsers,
} from '../controllers/usercontroller.js';
import {
	postComment,
	getComment,
	putCommentLike,
} from '../controllers/commentcontroller.js';

const router = Router();

router.get(
	'/posts',
	passport.authenticate('jwt', { session: false }),
	getAllPosts
);

router.get(
	'/profile/:id/posts',
	passport.authenticate('jwt', { session: false }),
	getUserPosts
);

router.post(
	'/posts/:id',
	passport.authenticate('jwt', { session: false }),
	postUserPost
);

router.put(
	'/posts/:id',
	passport.authenticate('jwt', { session: false }),
	putPostLike
);

router.post(
	'/posts/:id/comments',
	passport.authenticate('jwt', { session: false }),
	postComment
);

router.get(
	'/posts/:id/comments',
	passport.authenticate('jwt', { session: false }),
	getComment
);

router.put(
	'/posts/comments/:id',
	passport.authenticate('jwt', { session: false }),
	putCommentLike
);

router.get(
	'/profile/:id',
	passport.authenticate('jwt', { session: false }),
	getProfileInfo
);

router.get(
	'/profiles/:id',
	passport.authenticate('jwt', { session: false }),
	getAllUsers
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
