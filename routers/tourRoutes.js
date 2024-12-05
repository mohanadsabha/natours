const express = require('express');
const tourController = require('../controllers/tourController');
const authContoller = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// aliasing
router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

// aggregation pipeline
router.route('/tour-stats').get(tourController.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        authContoller.protect,
        authContoller.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );

// CRUD
router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authContoller.protect,
        authContoller.restrictTo('admin', 'lead-guide'),
        tourController.creatTour,
    );
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authContoller.protect,
        authContoller.restrictTo('admin', 'lead-guide'),
        tourController.updateTour,
    )
    .delete(
        authContoller.protect,
        authContoller.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour,
    );

module.exports = router;
