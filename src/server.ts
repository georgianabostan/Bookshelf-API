import 'dotenv/config'
import express, {type Request, type Response} from 'express';
import authRouter from './routes/authRouter.ts'

const port = process.env.PORT || 8000;
const app = express(); 

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(authRouter)



app.listen(port, () => console.log(`Server is running on port ${port}!`));