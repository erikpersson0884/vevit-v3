import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { initiateDataFiles } from './util';
initiateDataFiles();

import authRouter from './routes/authRouter'
import vevRouter from './routes/vevRouter';
import peopleRouter from './routes/peopleRouter';


dotenv.config();

const app = express();



app.use(express.static('public'));
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [];

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,    
};
app.use(cors(corsOptions));



app.use(express.json());

app.use('/api/auth/', authRouter)
app.use('/api/vev/', vevRouter)
app.use('/api/people/', peopleRouter)





app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html');
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;