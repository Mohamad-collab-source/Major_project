const Review = require('../models/review.js');
const Listing = require("../models/llisting.js");

module.exports.newreview = async(req,res,next)=>{
   let  {id} = req.params;
   let listing = await Listing.findById(id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   newReview.save();
   listing.save();
    req.flash('success','new Review Added')
res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyreview = async(req,res,next)=>{
   let { id, reviewId} = req.params;
//    console.log(id);
   await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted')
   res.redirect(`/listings/${id}`);
};