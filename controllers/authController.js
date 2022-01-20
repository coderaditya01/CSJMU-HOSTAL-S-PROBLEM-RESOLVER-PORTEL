const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive2002";
const JWT_RESET_KEY = "jwtreset2002";

//------------ User Model ------------//
const User = require('../models/User');
const Queryy = require('../models/Query');
const Contacts = require('../models/Contact');
const Announces = require('../models/Annouce');

//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const { name, email, phoneno,phoneno1, password, password2,course,batch ,hostal_room_no,hostal,dob,gender,address } = req.body;
    const {role}="admin";
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !hostal || !course || !batch || !gender || !phoneno ||!hostal_room_no || !password ||!address ||!address ||!password2) {
        errors.push({ msg: 'Please enter required fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (phoneno.length < 10 || phoneno.length > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }
    if (phoneno1.length < 10 || phoneno.length1 > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            hostal,
            phoneno,
            phoneno1,
            course,
            hostal_room_no,
            batch,
            dob,
            gender,
            password,
            password2,
            added_by:"Self",
            role:"user",
            address
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    name,
                    email,
                    hostal,
                    phoneno,
                    phoneno1,
                    course,
                    hostal_room_no,
                    batch,
                    dob,
                    gender,
                    password,
                    password2,
                    added_by:"Self",
                    role:"user",
                    address
                });
            } else {

                const oauth2Client = new OAuth2(
                    "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email,course,batch, phoneno,phoneno1,gender,dob,hostal,hostal_room_no, password,address }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "atul.etoos111@gmail.com",
                        clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error_msg',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/login');
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/register');
            }
            else {
                const { name, email,course,batch, phoneno,phoneno1,gender,dob,hostal,hostal_room_no, password,address } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/login');
                    } else {
                        const newUser = new User({
                            name,
                            name,
                            email,
                            hostal,
                            phoneno,
                            phoneno1,
                            course,
                            hostal_room_no,
                            batch,
                            dob,
                            gender,
                            password,
                            added_by:"Self",
                            role:"user",
                            address
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                    const oauth2Client = new OAuth2(
                                            "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                                            "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", // Client Secret
                                            "https://developers.google.com/oauthplayground" // Redirect URL
                                        );
                        
                                        oauth2Client.setCredentials({
                                            refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                                        });
                                        const accessToken = oauth2Client.getAccessToken()
                                        const CLIENT_URL = 'http://' + req.headers.host;
                        
                                        const output = `
                                        <h2>Congratulations !!! </h2?
                                        <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                                        <p>Email-id :${email}</p>
                                        <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                                        
                                        `;
                        
                                        const transporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                type: "OAuth2",
                                                user: "atul.etoos111@gmail.com",
                                                clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                                                clientSecret: "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",
                                                refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                                                accessToken: accessToken
                                            },
                                        });
                        
                                        // send mail with defined transport object
                                        const mailOptions = {
                                            from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                                            to: email, // list of receivers
                                            subject: "Account Confirmation ", // Subject line
                                            generateTextFromHTML: true,
                                            html: output, // html body
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                console.log(error);
                                               ;
                                            }
                                            else {
                                                console.log('Mail sent : %s', info.response);
                                                
                                            }
                                        })
                                        res.redirect('/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('forgot', {
            errors,
            email
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'User with Email ID does not exist!' });
                res.render('forgot', {
                    errors,
                    email
                });
            } else {
                const oauth2Client = new OAuth2(
                    "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        errors.push({ msg: 'Error resetting password!' });
                        res.render('forgot', {
                            errors,
                            email
                        });
                    }
                    else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "atul.etoos111@gmail.com",
                        clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                        accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Password Reset", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error_msg',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.redirect('/forgot');
                            }
                            else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                res.redirect('/login');
                            }
                        })
                    }
                })

            }
        });
    }
}

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please try again.'
                );
                res.redirect('/login');
            }
            else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {
                        req.flash(
                            'error_msg',
                            'User with email ID does not exist! Please try again.'
                        );
                        res.redirect('login');
                    }
                    else {
                        res.redirect(`/reset/${_id}`)
                    }
                })
            }
        })
    }
    else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        res.redirect(`/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error_msg',
            'Password must be at least 8 characters.'
        );
        res.redirect(`/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        res.redirect(`/reset/${id}`);
    }

    else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate(
                    { _id: id },
                    { password },
                    function (err, result) {
                        if (err) {
                            req.flash(
                                'error_msg',
                                'Error resetting password!'
                            );
                            res.redirect(`/reset/${id}`);
                        } else {
                            req.flash(
                                'success_msg',
                                'Password reset successfully!'
                            );
                            res.redirect('/login');
                        }
                    }
                );

            });
        });
    }
}



//------------ Login Handle ------------//
exports.loginHandle = function(req, res, next){
    passport.authenticate('local',function(err, user, info) {
        
        if ( err ) {
            next(err);
            return
        }
        // User does not exist
        if ( ! user ) {
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
            return
        }
        req.logIn(user, function(err) {
            // Invalid password
            if ( err ) {
                req.flash('error', 'Invalid email or password');
                next(err);
                return
            }
            console.log(req.user.role)
            if( req.user.role == "user")
            res.redirect(req.session.redirectTo || '/dashboard');
            if( req.user.role == "admin")
            res.redirect(req.session.redirectTo || '/admin_dashboard');
            if( req.user.role == "incharge")
            res.redirect(req.session.redirectTo || '/incharge_dashboard');
            if( req.user.role == "authority")
            res.redirect(req.session.redirectTo || '/authority_dashboard');
            return
        });
    })(req, res, next);
}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
}
exports.announce = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    const Announce = new Announces({
        email: req.user.email,
        name: req.user.name,
        phone_no:req.user.phone_no,
        post:req.user.post,
        hostal:req.body.hostal, 
        announce:req.body.announce 
    })

    // save user in the database
       Announce.save(Announce)
        .then(data => {
            //res.send(data)
            req.flash('success_msg', 'Announcement Submitted !!!');
            res.redirect('/announcement1');
        })
        .catch(err => {
            req.flash('error_msg', 'Some Error pccurs!!!');
            res.redirect('/make_a_announcement');
        });

}
exports.announce1 = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    const Announce = new Announces({
        email: req.user.email,
        name: req.user.name,
        phone_no:req.user.phone_no,
        post:req.user.post,
        hostal:req.body.hostal, 
        announce:req.body.announce 
    })

    // save user in the database
       Announce.save(Announce)
        .then(data => {
            //res.send(data)
            req.flash('success_msg', 'Announcement Submitted !!!');
            res.redirect('/announcement2');
        })
        .catch(err => {
            req.flash('error_msg', 'Some Error pccurs!!!');
            res.redirect('/make_a_announcement1');
        });

}
var moment = require('moment');
exports.index = function(req, res) {
    res.render('index', { moment: moment });
}
exports.query = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    const Query = new Queryy({
        email1: req.user.email,
        name:req.user.name,
        query: req.body.query,
        status: req.body.status,
        phone_no:req.user.phoneno,
        phone_no1:req.body.phone_no1,
        hostal:req.user.hostal,
        hostal_room_no:req.user.hostal_room_no,
        hostal_room_no:req.user.hostal_room_no,
        related_to:req.body.related_to,
        assigner_reply: req.body.assigner_reply,
        incharge_reply: req.body.incharge_reply,
        final_feedback: req.body.final_feedback,
        incharge_name: req.body.incharge_name,
        incharge_email: req.body.incharge_email,
        incharge_field: req.body.incharge_field,
        incharge_phone_no:req.body.incharge_phone_no,
        assigner_name: req.body.assigner_name,
        assigner_post: req.body.assigner_post,
        assigner_email: req.body.assigner_email,
        assigner_phone_no: req.body.assigner_phone_no,
        
    })

    // save user in the database
       Query.save(Query)
        .then(data => {
            //res.send(data)
            req.flash('success_msg', 'Query Submitted !!!');
            res.redirect('/view_query');
        })
        .catch(err => {
            req.flash('error_msg', 'Query Not Submitted !!!');
            console.log(err)
            res.redirect('/submit_query');
        });

}
exports.index = function(req, res) {
    res.render('index', { moment: moment });
}
exports.assign = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new user
    const Map = new Mapp({
        _id: req.body._id,
        assign_to: req.body.assign_to,
        assign_by: req.body.assign_by,
        assigner_post: req.body.assigner_post,
        assigner_phone_no: req.body.assigner_phone_no,
        work_category: req.body.work_category
        
    })

    // save user in the database
       Map.save(Map)
        .then(data => {
            //res.send(data)
            req.flash('success_msg', 'Query Assigned Successfully !!!');
            res.redirect('/view_query');
        })
        .catch(err => {
            req.flash('error_msg', 'Some Error Occured !!!');
            console.log(err);
            res.redirect('/submit_query');
        });

}
exports.contact = (req, res) => {
    // validate request
    if (!req.body) {
        req.flash('error_msg', 'Please Enter All Fields !!!');
        return;
    }

    // new user
    const Contact = new Contacts({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        message: req.body.message,
       
    
        
    })

    // save user in the database
       Contact.save(Contact)
        .then(data => {
            //res.send(data)
            req.flash('success_msg', 'Message Submitted !!!');
            res.redirect('/contact');
        })
        .catch(err => {
            req.flash('error_msg', 'Message Not Submitted !!!');
            res.redirect('/contact');
        });

}

//------------ Admin Register Handle ------------//
exports.adminregisterHandle = (req, res) => {
    const { name, email, phoneno,phoneno1, password, password2 ,hostal,post,dob,gender,address } = req.body;
    const {added_by }=req.user.name;
    const {role}="admin";
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !hostal || !post || !gender || !phoneno || !password ||!address ||!password2) {
        errors.push({ msg: 'Please enter required fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (phoneno.length < 10 || phoneno.length > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }
    if (phoneno1.length < 10 || phoneno.length1 > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }

    if (errors.length > 0) {
        res.render('adminregister', {
            errors,
            name,
            email,
            hostal,
            phoneno,
            phoneno1,
            post,
            dob,
            gender,
            password,
            password2,
            added_by:req.user.name,
            role:"admin",
            address
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('adminregister', {
                    errors,
                    name,
                    email,
                    hostal,
                    phoneno,
                    phoneno1,
                    post,
                    dob,
                    gender,
                    password,
                    added_by:req.user.name,
                    role:"admin",
                    address
                });
            } else {
                        const newUser = new User({
                            name,
                            email,
                            hostal,
                            phoneno,
                            phoneno1,
                            post,
                            dob,
                            gender,
                            password,
                            added_by:req.user.name,
                            role:"admin",
                            address
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        
                const oauth2Client = new OAuth2(
                    "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                });
                const accessToken = oauth2Client.getAccessToken()
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Congratulations !!! </h2?
                <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                <p>Email-id :${email}</p>
                <p>Password : ${password}</p>
                <h2>Note:</h2><p>Please Change Your Password From Forgot Password Menu.<p>${CLIENT_URL}/forgot</p></P>
                <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "atul.etoos111@gmail.com",
                        clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Confirmation ", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                       ;
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        
                    }
                })
                                      req.flash(
                                            'success_msg',
                                            'Admin Registered Successfully.'
                                        );
                                        res.redirect('/view_all_admins');
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        req.flash(
                                            'error_msg',
                                            'Admin Not Registered.Please Try Again.'
                                        );
                                        res.redirect('/adminregister');
                                    });
                            });
                        });
                    }
                });
            }

     
    }
//------------ Student Register Handle ------------//
exports.studentregisterHandle = (req, res) => {
    const { name, email, phoneno,phoneno1, password, password2,course,batch ,hostal_room_no,hostal,dob,gender,address } = req.body;
    const {added_by }=req.user.name;
    const {role}="admin";
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !hostal || !course || !batch || !gender || !phoneno ||!hostal_room_no || !password ||!address ||!password2) {
        errors.push({ msg: 'Please enter required fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (phoneno.length < 10 || phoneno.length > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }
    if (phoneno1.length < 10 || phoneno.length1 > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }

    if (errors.length > 0) {
        res.render('userregister', {
            errors,
            name,
            email,
            hostal,
            phoneno,
            phoneno1,
            course,
            hostal_room_no,
            batch,
            dob,
            gender,
            password,
            password2,
            added_by:req.user.name,
            role:"user",
            address
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('userregister', {
                    errors,
                    name,
                    email,
                    hostal,
                    phoneno,
                    phoneno1,
                    course,
                    batch,
                    dob,
                    hostal_room_no,
                    gender,
                    password,
                    added_by:req.user.name,
                    role:"user",
                    address
                });
            } else {
                        const newUser = new User({
                            name,
                            email,
                            hostal,
                            phoneno,
                            phoneno1,
                            course,
                            batch,
                            dob,
                            hostal_room_no,
                            gender,
                            password,
                            added_by:req.user.name,
                            role:"user",
                            address
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        
                const oauth2Client = new OAuth2(
                    "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                });
                const accessToken = oauth2Client.getAccessToken()
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Congratulations !!! </h2?
                <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                <p>Email-id :${email}</p>
                <p>Password : ${password}</p>
                <h2>Note:</h2><p>Please Change Your Password From Forgot Password Menu.<p>${CLIENT_URL}/forgot</p></P>
                <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "atul.etoos111@gmail.com",
                        clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Confirmation ", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                       ;
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        
                    }
                })
                                      req.flash(
                                            'success_msg',
                                            'Student Registered Successfully.'
                                        );
                                        res.redirect('/view_all_students1');
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        req.flash(
                                            'error_msg',
                                            'student Not Registered.Please Try Again.'
                                        );
                                        res.redirect('/studentregister');
                                    });
                            });
                        });
                    }
                });
            }

     
    }
//------------ Register Handle ------------//
exports.inchargeregisterHandle = (req, res) => {
    const { name, email, phoneno,phoneno1, password, password2 ,hostal,field,dob,gender,address } = req.body;
    const {added_by }=req.user.name;
    const {role}="incharge";
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !hostal || !field || !gender || !phoneno || !password ||!address ||!password2) {
        errors.push({ msg: 'Please enter required fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (phoneno.length < 10 || phoneno.length > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }
    if (phoneno1.length < 10 || phoneno.length1 > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }

    if (errors.length > 0) {
        res.render('inchargeregister', {
            errors,
            name,
            email,
            hostal,
            phoneno,
            phoneno1,
            field,
            dob,
            gender,
            password,
            password2,
            added_by:req.user.name,
            role:"incharge",
            address
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('inchargeregister', {
                    errors,
                    name,
                    email,
                    hostal,
                    phoneno,
                    phoneno1,
                    field,
                    dob,
                    gender,
                    password,
                    added_by:req.user.name,
                    role:"incharge",
                    address
                });
            } else {
                        const newUser = new User({
                            name,
                            email,
                            hostal,
                            phoneno,
                            phoneno1,
                            field,
                            dob,
                            gender,
                            password,
                            added_by:req.user.name,
                            role:"incharge",
                            address
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        
                                        const oauth2Client = new OAuth2(
                                            "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                                            "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", // Client Secret
                                            "https://developers.google.com/oauthplayground" // Redirect URL
                                        );
                        
                                        oauth2Client.setCredentials({
                                            refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                                        });
                                        const accessToken = oauth2Client.getAccessToken()
                                        const CLIENT_URL = 'http://' + req.headers.host;
                        
                                        const output = `
                                        <h2>Congratulations !!! </h2?
                                        <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                                        <p>Email-id :${email}</p>
                                        <p>Password : ${password}</p>
                                        <h2>Note:</h2><p>Please Change Your Password From Forgot Password Menu.<p>${CLIENT_URL}/forgot</p></P>
                                        <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                                        
                                        `;
                        
                                        const transporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                type: "OAuth2",
                                                user: "atul.etoos111@gmail.com",
                                                clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                                                clientSecret: "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",
                                                refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                                                accessToken: accessToken
                                            },
                                        });
                        
                                        // send mail with defined transport object
                                        const mailOptions = {
                                            from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                                            to: email, // list of receivers
                                            subject: "Account Confirmation ", // Subject line
                                            generateTextFromHTML: true,
                                            html: output, // html body
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                console.log(error);
                                               ;
                                            }
                                            else {
                                                console.log('Mail sent : %s', info.response);
                                                
                                            }
                                        })
                                    req.flash(
                                            'success_msg',
                                            'Incharge Registered Successfully.'
                                        );
                                        res.redirect('/view_all_incharges');
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        req.flash(
                                            'error_msg',
                                            'Incharge Not Registered.Please Try Again.'
                                        );
                                        res.redirect('/inchargeregister');
                                    });
                            });
                        });
                    }
                });
            }

     
    }
    exports.inchargeregister1Handle = (req, res) => {
        const { name, email, phoneno,phoneno1, password, password2 ,hostal,field,dob,gender,address } = req.body;
        const {added_by }=req.user.name;
        const {role}="incharge";
        let errors = [];
    
        //------------ Checking required fields ------------//
        if (!name || !email || !hostal || !field || !gender || !phoneno || !password ||!address ||!password2) {
            errors.push({ msg: 'Please enter required fields' });
        }
    
        //------------ Checking password mismatch ------------//
        if (password != password2) {
            errors.push({ msg: 'Passwords do not match' });
        }
        //------------ Checking password length ------------//
        if (password.length < 8) {
            errors.push({ msg: 'Password must be at least 8 characters' });
        }
        if (phoneno.length < 10 || phoneno.length > 10) {
            errors.push({ msg: 'Phone No must be 10 digit' });
        }
        if (phoneno1.length < 10 || phoneno.length1 > 10) {
            errors.push({ msg: 'Phone No must be 10 digit' });
        }
    
        if (errors.length > 0) {
            res.render('inchargeregister1', {
                errors,
                name,
                email,
                hostal,
                phoneno,
                phoneno1,
                field,
                dob,
                gender,
                password,
                password2,
                added_by:req.user.name,
                role:"incharge",
                address
            });
        } else {
            //------------ Validation passed ------------//
            User.findOne({ email: email }).then(user => {
                if (user) {
                    //------------ User already exists ------------//
                    errors.push({ msg: 'Email ID already registered' });
                    res.render('inchargeregister1', {
                        errors,
                        name,
                        email,
                        hostal,
                        phoneno,
                        phoneno1,
                        field,
                        dob,
                        gender,
                        password,
                        added_by:req.user.name,
                        role:"incharge",
                        address
                    });
                } else {
                            const newUser = new User({
                                name,
                                email,
                                hostal,
                                phoneno,
                                phoneno1,
                                field,
                                dob,
                                gender,
                                password,
                                added_by:req.user.name,
                                role:"incharge",
                                address
                            });
    
                            bcryptjs.genSalt(10, (err, salt) => {
                                bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser
                                        .save()
                                        .then(user => {
                                            
                                            const oauth2Client = new OAuth2(
                                                "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                                                "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", // Client Secret
                                                "https://developers.google.com/oauthplayground" // Redirect URL
                                            );
                            
                                            oauth2Client.setCredentials({
                                                refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                                            });
                                            const accessToken = oauth2Client.getAccessToken()
                                            const CLIENT_URL = 'http://' + req.headers.host;
                            
                                            const output = `
                                            <h2>Congratulations !!! </h2?
                                            <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                                            <p>Email-id :${email}</p>
                                            <p>Password : ${password}</p>
                                            <h2>Note:</h2><p>Please Change Your Password From Forgot Password Menu.<p>${CLIENT_URL}/forgot</p></P>
                                            <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                                            
                                            `;
                            
                                            const transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    type: "OAuth2",
                                                    user: "atul.etoos111@gmail.com",
                                                    clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                                                    clientSecret: "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",
                                                    refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                                                    accessToken: accessToken
                                                },
                                            });
                            
                                            // send mail with defined transport object
                                            const mailOptions = {
                                                from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                                                to: email, // list of receivers
                                                subject: "Account Confirmation ", // Subject line
                                                generateTextFromHTML: true,
                                                html: output, // html body
                                            };
                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    console.log(error);
                                                   ;
                                                }
                                                else {
                                                    console.log('Mail sent : %s', info.response);
                                                    
                                                }
                                            })
                                        req.flash(
                                                'success_msg',
                                                'Incharge Registered Successfully.'
                                            );
                                            res.redirect('/view_all_incharges1');
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            req.flash(
                                                'error_msg',
                                                'Incharge Not Registered.Please Try Again.'
                                            );
                                            res.redirect('/inchargeregister1');
                                        });
                                });
                            });
                        }
                    });
                }
    
         
        }
    //------------ Authority Register Handle ------------//
exports.authorityregisterHandle = (req, res) => {
    const { name, email, phoneno,phoneno1, password, password2 ,hostal,post,dob,gender,address } = req.body;
    const {added_by }=req.user.name;
    const {role}="authority";
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !hostal || !post || !gender || !phoneno || !password ||!address ||!password2) {
        errors.push({ msg: 'Please enter required fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (phoneno.length < 10 || phoneno.length > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }
    if (phoneno1.length < 10 || phoneno.length1 > 10) {
        errors.push({ msg: 'Phone No must be 10 digit' });
    }

    if (errors.length > 0) {
        res.render('authorityregister', {
            errors,
            name,
            email,
            hostal,
            phoneno,
            phoneno1,
            post,
            dob,
            gender,
            password,
            password2,
            added_by:req.user.name,
            role:"authority",
            address
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('authorityregister', {
                    errors,
                    name,
                    email,
                    hostal,
                    phoneno,
                    phoneno1,
                    post,
                    dob,
                    gender,
                    password,
                    added_by:req.user.name,
                    role:"authority",
                    address
                });
            } else {
                        const newUser = new User({
                            name,
                            email,
                            hostal,
                            phoneno,
                            phoneno1,
                            post,
                            dob,
                            gender,
                            password,
                            added_by:req.user.name,
                            role:"authority",
                            address
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        
                const oauth2Client = new OAuth2(
                    "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os"
                });
                const accessToken = oauth2Client.getAccessToken()
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Congratulations !!! </h2?
                <h2>You are Registered On CSJMU Hostal's Problem Resolver Portel</h2>
                <p>Email-id :${email}</p>
                <p>Password : ${password}</p>
                <h2>Note:</h2><p>Please Change Your Password From Forgot Password Menu.<p>${CLIENT_URL}/forgot</p></P>
                <p>Visit Our Site Here : ${CLIENT_URL}/</p>
                
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "atul.etoos111@gmail.com",
                        clientId: "213207826462-2dpeqbdjt1sfqeb6dkii5fmsemsf5ahs.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04SF-TLZK0wRiCgYIARAAGAQSNwF-L9Ir5S4WdwLaKQbz25crI2A3Eqd3Vq-3zkiPgLyofnVsqpTf0lSbEnoHJTobg-_X9D542Os",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"CSJMU Hostals Problem Resolver Portel" <atul.etoos111@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Account Confirmation ", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                       ;
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        
                    }
                })
                                      req.flash(
                                            'success_msg',
                                            'Authority Registered Successfully.'
                                        );
                                        res.redirect('/authority_dashboard');
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        req.flash(
                                            'error_msg',
                                            'Authority Not Registered.Please Try Again.'
                                        );
                                        res.redirect('/authorityregister');
                                    });
                            });
                        });
                    }
                });
            }

     
    }
    
