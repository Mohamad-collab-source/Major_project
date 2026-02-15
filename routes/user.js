const express =  require("express");
const router = express.Router();
const User = require('../models/user.js')
// requirint wrapasync funtion 
const WrapAsync =require('../Utily/Wrapasync.js');
// passport
const passport = require('passport');

// middle ware for redirecturl
const { SaveredirectUrl } = require('../middleware.js');

// usercontroller file 
const userController = require('../controllers/user.js');

// to get data from form  signup
router.route('/signup')
   .get(userController.getsignupform)
   .post(userController.signupuser);

   // login user
   router.route('/login')
    .get(userController.getloginform)
    .post(
    SaveredirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
   }),userController.loginuser);

// logout user
router.get('/logout',userController.logoutuser);

module.exports = router;