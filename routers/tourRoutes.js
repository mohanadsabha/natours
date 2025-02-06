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

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
// tours-distance?distance=233&center=-20,28&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

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
