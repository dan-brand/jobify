import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

import { register, login, updateUser } from '../controllers/authController.js';
import authenticateUser from '../middleware/auth.js'

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);

// 'authenticateUser' is middleware that checks to see it is valid user and 'updateUser' is the controller
router.patch('/updateuser', authenticateUser, updateUser);

export default router;