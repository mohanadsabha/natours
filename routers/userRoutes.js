const express = require('express');
const userContoller = require('../controllers/userController');
const authContoller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authContoller.signup);
router.post('/login', authContoller.login);
router.post('/forgotPassword', authContoller.forgotPassword);
router.patch('/resetPassword/:token', authContoller.resetPassword);

// The below routes will be protected
router.use(authContoller.protect);

router.get('/me', userContoller.getMe, userContoller.getUser);
router.patch('/updateMyPassword', authContoller.updatePassword);
router.patch('/updateMe', userContoller.updateMe);
router.delete('/deleteMe', userContoller.deleteMe);

// Admin Only
router.use(authContoller.restrictTo('admin'));

router.route('/').get(userContoller.getAllUsers).post(userContoller.createUser);
router
    .route('/:id')
    .get(userContoller.getUser)
    .patch(userContoller.updateUser)
    .delete(userContoller.deleteUser);

module.exports = router;
