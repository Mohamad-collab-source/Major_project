const express =  require("express");
const router = express.Router({mergeParams:true});

// requirint wrapasync funtion 
const WrapAsync =require('../Utily/Wrapasync.js');

//requiring joi schema 
const {listingSchema,reviewSchema} = require("../schema.js");


//require ExpressError handler function 
const ExpressError = require('../Utily/ExpressError.js');

// Require list model
const Listing = require('../models/llisting.js');
// review model
const Review = require('../models/review.js');

// require middleware
const {validateReview,isLoggedin,isAuthor} = require('../middleware.js');

// require review controller file
const reviewController = require('../controllers/review.js');

// reviews route  

router.post("/",isLoggedin,validateReview,WrapAsync(reviewController.newreview));

// delete review route
router.delete("/:reviewId",isLoggedin,isAuthor,WrapAsync(reviewController.destroyreview));

module.exports = router; 