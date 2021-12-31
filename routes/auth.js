const express = require('express');
const router = express.Router();
var User = require('../models/User');
const { ensureAuthenticated , authorizeRoles} = require('../config/checkAuth')

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Admin Register Route ------------//
router.get('/adminregister',ensureAuthenticated, authorizeRoles("authority"), (req, res) => res.render('adminregister'));

//------------ Admin Register POST Handle ------------//
router.post('/adminregister',ensureAuthenticated, authorizeRoles("authority"), authController.adminregisterHandle);
//------------ Incharge Register Route ------------//
router.get('/inchargeregister',ensureAuthenticated, authorizeRoles("authority"), (req, res) => res.render('inchargeregister'));

//------------ Authority Register Route ------------//
router.get('/authorityregister',ensureAuthenticated, authorizeRoles("authority"), (req, res) => res.render('authorityregister'));

//------------ Authority Register POST Handle ------------//
router.post('/authorityregister',ensureAuthenticated, authorizeRoles("authority"), authController.authorityregisterHandle);


//------------ Incharge Register POST Handle ------------//
router.post('/inchargeregister',ensureAuthenticated, authorizeRoles("authority"), authController.inchargeregisterHandle);
//------------ Incharge Register Route ------------//
router.get('/inchargeregister1',ensureAuthenticated, authorizeRoles("admin"), (req, res) => res.render('inchargeregister1'));

//------------ Incharge Register POST Handle ------------//
router.post('/inchargeregister1',ensureAuthenticated, authorizeRoles("admin"), authController.inchargeregister1Handle);
//------------ User  Register Route ------------//
router.get('/studentregister',ensureAuthenticated, authorizeRoles("admin"), (req, res) => res.render('studentregister'));

//------------ User Register POST Handle ------------//
router.post('/studentregister',ensureAuthenticated, authorizeRoles("admin"), authController.studentregisterHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

//------------ Feedback POST Handle ------------//


router.post('/submit_query', authController.query);
router.post('/assign', authController.assign);
router.get('/make_a_announcement',ensureAuthenticated, authorizeRoles("admin"),(req, res) => res.render('announce'));
router.post('/make_a_announcement',ensureAuthenticated,authorizeRoles("admin"), authController.announce);
router.get('/make_a_announcement1',ensureAuthenticated, authorizeRoles("authority"),(req, res) => res.render('announce1'));
router.post('/make_a_announcement1',ensureAuthenticated,authorizeRoles("authority"), authController.announce1);


router.post('/contact', authController.contact);  
module.exports = router;
