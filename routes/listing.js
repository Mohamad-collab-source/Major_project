const express =  require("express");
const router = express.Router();

// requirint wrapasync funtion 
const WrapAsync =require('../Utily/Wrapasync.js');

//requiring joi schema 
const {listingSchema,reviewSchema} = require("../schema.js");


//require ExpressError handler function 
const ExpressError = require('../Utily/ExpressError.js');


// Require list model
const Listing = require('../models/llisting.js');

//require logged in middleware
const {isLoggedin,isOwner,validateListing} = require('../middleware.js');

// require controller files
const listingController = require("../controllers/listing.js");

// require storage and cloudinary
const {storage}=require("../cloudConfig.js");

// require multer for uploading files
const multer  = require('multer')
const upload = multer({ storage })

// filters route
router.get('/filters',WrapAsync(listingController.category));
router.get('/search',WrapAsync(listingController.search));

// using router.route arranging routes
router.route('/')
    .get(WrapAsync(listingController.index))
    .post(upload.single('listing[image]'),validateListing, WrapAsync(listingController.newListing));
  
    



    //new route to create listing
router.get("/new",isLoggedin,listingController.rendernewform);

router.route('/:id')
    .get( WrapAsync(listingController.showlisting))
    .put(upload.single('listing[image]'),validateListing,WrapAsync(listingController.updatelisting))
    .delete(isLoggedin,isOwner,WrapAsync(listingController.destroylisting));

// edit route
router.get("/:id/edit",isLoggedin,isOwner,WrapAsync(listingController.editlisting));



module.exports = router;