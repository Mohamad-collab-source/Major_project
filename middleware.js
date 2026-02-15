let Listing = require('./models/llisting.js')
// review model
const Review = require('./models/review.js');

//requiring joi schema 
const {listingSchema,reviewSchema} = require("./schema.js");

//require ExpressError handler function 
const ExpressError = require('./Utily/ExpressError.js');

// to check if user is logged in or not
module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
         req.flash('error','user should be logged In!')
       return res.redirect('/login');
    }
    next();  
}

module.exports.SaveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 


// for listing authorization
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
  let listing =  await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash('error',"you are not the owner of listing");
    return res.redirect(`/listings/${id}`);
    }
    next();
} 


// for review authorization
module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
  let review =  await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
    req.flash('error',"you are not the owner of this review");
    return res.redirect(`/listings/${id}`);
    }
    next();
} 

// validate schema middleware

module.exports.validateListing = (req,res,next)=> {
    let {error} = listingSchema.validate(req.body); // use of joi or schema.js file
    if (error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else {
        next();
    }
}

// joi validate middleware or server side middle ware for review schema
module.exports.validateReview = (req,res,next)=> {
    let {error} = reviewSchema.validate(req.body); // use of joi or schema.js file
    if (error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else {
        next();
    }
}