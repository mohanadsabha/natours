const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');
const bookingRouter = require('./routers/bookingRoutes');
const viewRouter = require('./routers/viewRoutes');
const globalEerrorHandler = require('./controllers/errorController');

const app = express();

app.set('trust proxy', 1);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const limiter = rateLimit({
    max: 100, // 100 req from same ip
    windowMs: 60 * 60 * 1000, // in one hour
    message: 'Too many requests from this IP, please try again in an hour',
});

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Security Headers
app.use(helmet());

// Logging ..
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit Requests
app.use('/api', limiter);

// body parser, reading data into req.body
app.use(express.json({ limit: '10kb' })); // limit for the body payload
app.use(cookieParser());

// Data sanitization against NoSQL query injection
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

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/', viewRouter);

// Unhandeld routes
app.all('*', (req, res, next) => {
    // express skips all the next functions and jumps to the error middlware
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handeling Middleware, the first arg is err, express automaticlly identify this as an err handeler
app.use(globalEerrorHandler);

// Start Server
module.exports = app;
