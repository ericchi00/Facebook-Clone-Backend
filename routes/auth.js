import { Router } from 'express';
import { registerPost, loginPost } from '../controllers/usercontroller.js';

const router = Router();

router.post('/register', registerPost);

router.post('/login', loginPost);

export default router;
