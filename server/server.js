import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mogodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
//ShjhtPVuj8axhz8d
const PORT = process.env.PORT || 4000
const app = express();

app.use(express.json());
app.use(cors());//using middleware
await connectDB();

app.use('/api/users',userRouter );//user routes
app.use('/api/image',imageRouter );
app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});