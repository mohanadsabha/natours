const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');
const globalEerrorHandler = require('./controllers/errorController');
const mongoSanitize = require('express-mongo-sabitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const limiter = rateLimit({
    max: 100, // 100 req from same ip
    windowMs: 60 * 60 * 1000, // in one hour
    message: 'Too many requests from this IP, please try again in an hour',
});

// console.log(app.get('env'));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Global Middlewares

// Security Headers
app.use(helmet());
// Limit Requests
app.use('/api', limiter);

// body parser, reading data into req.body
app.use(express.json({ limit: '10kb' })); // limit for the body payload

// Data sanitization against NoSQL query injection
// npm i express-mongo-sabitize xss-clean hpp
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'price',
            'difficulty',
        ],
    }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandeld routes
app.all('*', (req, res, next) => {
    // express skips all the next functions and jumps to the error middlware
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handeling Middleware, the first arg is err, express automaticlly identify this as an err handeler
app.use(globalEerrorHandler);

// Start Server
module.exports = app;
