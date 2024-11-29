import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import  userRoutes  from './routes/user.route.js';
import roomRoutes from './routes/room.route.js';
import { app,server } from './lib/socket.js';
import path from 'path';

dotenv.config();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())
app.use(cors({origin: "http://localhost:5173",credentials: true,}));

app.use('/api/user',userRoutes);
app.use('/api/room',roomRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

server.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});