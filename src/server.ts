import 'dotenv/config'
import express, {type Request, type Response} from 'express';
import userRouter from './routes/user.ts'

import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.env.PORT || 8000;
const app = express(); 

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(userRouter)



app.listen(port, () => console.log(`Server is running on port ${port}!`));