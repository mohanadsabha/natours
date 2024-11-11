const express = require('express');
const tourController = require('../controllers/tourController');
const authContoller = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

// aliasing
router
    .route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

// aggregation pipeline
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// CRUD
router
    .route('/')
    .get(authContoller.protect, tourController.getAllTours)
    .post(tourController.creatTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authContoller.protect,
        authContoller.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour,
    );

module.exports = router;
