import express from 'express';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Finbotics Reboot Service is running');
});

export default app;
