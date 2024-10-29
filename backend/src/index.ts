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

app.use(express.static('frontend'));

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



import path from 'path';

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/api', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'api.html'));
});



if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;