const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview,
    );

module.exports = router;

// TODO: test create and get reviews, test get 1 tour to see the populated reviews and tours to not populate
// Test: add Geospatial data, add tour guides and test for them.
