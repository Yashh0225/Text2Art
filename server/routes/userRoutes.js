import express from 'express';
import {registerUser, loginUser, userCredits} from '../controlers/userControler.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();
//create in point
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);

export default userRouter;

//http://localhost:4000/api/users/register
//http://localhost:4000/api/users/login