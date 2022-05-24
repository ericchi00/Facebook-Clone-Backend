import { Router } from 'express';
import {
	registerPost,
	loginPost,
	logoutPost,
} from '../controllers/usercontroller.js';

const router = Router();

router.post('/register', registerPost);

router.post('/login', loginPost);

router.post('/logout', logoutPost);

export default router;
