const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log('DB connection success'))
    .catch((err) => {
        console.log(err.name, err.message);
        process.exit(1);
    });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
