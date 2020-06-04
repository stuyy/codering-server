import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { config } from 'dotenv';
import database from './database/database';
import authRoute from './routes/auth';
import githubRoute from './routes/github/github';

config();
const github = require('./strategies/github.strategy');

// const discord = require('./strategies/discord.strategy');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ verify: (req: any, res, buf: Buffer) => {
  req.rawBody = buf;
}}));

app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: ['http://localhost:4200'],
  credentials: true,
}));

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'some secret',
  cookie: {
    maxAge: 3600000 * 24 * 7
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/intellectual/auth', authRoute);
app.use('/api/intellectual/github', githubRoute);

(async () => {
  console.log(process.env.ENVIRONMENT);
  const db = await database();
  db.on('open', () => console.log('Connected to DB'));
  db.on('error', () => console.log('Error with DB'));
  app.listen(PORT, () => console.log(`Listening on Port ${PORT}.`));
})();