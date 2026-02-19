import express from 'express';
import { generateImage } from '../controlers/imageController.js';
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

//add path
imageRouter.post('/generate-image', userAuth , generateImage);//userAuth to get userid

export default imageRouter;