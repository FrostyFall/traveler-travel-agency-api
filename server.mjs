import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import apiRouter from './routes/api_v1.mjs';
dotenv.config();

const app = express();
const port = process.env.PORT ?? 8080;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('assets'));
app.use('/api/v1/', apiRouter);

app.use((req, res) => res.status(404).json({ error: 'Wrong Path' }));

app.listen(port, () => console.log(`Listening on port ${port}...`));
