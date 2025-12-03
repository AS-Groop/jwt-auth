require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
// app.use(cookieParser());

const start = async () => {
    try {
        app.listen(PORT, (err)=>{
            console.log(`Listening on ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();

