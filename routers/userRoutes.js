const express = require('express');
const userContoller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// The below routes will be protected
router.use(authController.protect);

router.get('/me', userContoller.getMe, userContoller.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
    '/updateMe',
    userContoller.uploadUserPhoto,
    userContoller.resizeUserPhoto,
    userContoller.updateMe,
);
router.delete('/deleteMe', userContoller.deleteMe);

// Admin Only
router.use(authController.restrictTo('admin'));

router.route('/').get(userContoller.getAllUsers).post(userContoller.createUser);
router
    .route('/:id')
    .get(userContoller.getUser)
    .patch(userContoller.updateUser)
    .delete(userContoller.deleteUser);

module.exports = router;
