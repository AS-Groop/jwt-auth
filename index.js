import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routers/router.js';
import mongoose from 'mongoose';
import errorMiddleware from "./middlewares/error-middleware.js";


const PORT = process.env.PORT || 5000;


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT_URL,
    }
));
app.use('/api',router);
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, (err) => {
            console.log(`Listening on port ${PORT}`);
        })
    } catch (e) {

    }
}

start();

