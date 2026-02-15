const User = require('../models/user.js')
const Review = require('../models/review.js');
const Listing = require("../models/llisting.js");

module.exports.getsignupform = (req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signupuser = async(req,res,next)=>{
    try {
const {username,email,password} = req.body;
      const newUser = new User({email,username});
      const registerUser = await User.register(newUser,password);
      req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to Wanderlust!");
      res.redirect('/listings');
      })
        
    }catch(err){
      req.flash('error','User already exists!');
      res.redirect('/signup');
    }
    
};

module.exports.getloginform = (req,res,next)=>{
    res.render("users/login.ejs"); 
};

module.exports.loginuser = async(req,res,next)=>{
    req.flash("success","welcome to wanderlust!");
    const redirecturl = res.locals.redirectUrl || '/listings';
    res.redirect(redirecturl);
};

module.exports.logoutuser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','you are logged Out!');
        res.redirect('/listings');
    })
};