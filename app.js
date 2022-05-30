import 'dotenv/config';
import express from 'express';
import httpErrors from 'http-errors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import applyPassportStrategy from './auth/passport.js';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(bodyParser.json({ limit: '16mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '16mb', extended: true }));
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(
	cors({
		credentials: true,
		origin: true,
	})
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

applyPassportStrategy(passport);

app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(compression());
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
	next(httpErrors(404));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json(err);
});

export default app;
