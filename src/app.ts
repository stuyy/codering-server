import express from 'express';
import session from 'express-session';
import SessionStore from 'connect-mongo';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import apiRoute from './routes/index';

config();

const MongoStore = SessionStore(session);
mongoose.connect(process.env.MONGODB || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const github = require('./strategies/github.strategy');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ verify: (req: any, res, buf: Buffer) => {
  req.rawBody = buf;
}}));

app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'some secret',
  cookie: {
    maxAge: 3600000 * 24 * 7
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoute);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}.`));