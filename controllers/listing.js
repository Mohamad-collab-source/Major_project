// require geocoding mapbox api
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MapToken });


const Listing = require("../models/llisting.js");

module.exports.index = async(req,res,next)=>{
    const alllisting = await Listing.find({});
    
    res.render('listings/index.ejs', { alllisting });
   
};

module.exports.rendernewform = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showlisting = async(req, res,next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',
        populate:{
            path:'author'
        },
      }).populate('owner');

    if (!listing) {
       req.flash('error',"Listing you requested for does not Exits");
      return  res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.newListing = async(req,res,next)=>{
   let coordinate = await geocodingClient.forwardGeocode({
  query: req.body.listing.location, // location is converting to coordinates
  limit: 1,
})
  .send()
  
  
    const url= req.file.path;
    const filename = req.file.filename;
const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
newListing.image = {url,filename};
newListing.geometry = coordinate.body.features[0].geometry;
 await newListing.save();
 console.log(newListing);
 req.flash('success','new Listing Added')
 res.redirect("/listings");
};

module.exports.editlisting = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
   if (!listing) {
       req.flash('error',"Listing you requested for does not Exits");
      return  res.redirect("/listings");
    }
    // let originalimageurl = listing.image.url;
    //   originalimageurl =  originalimageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing}); 
};

module.exports.updatelisting =async(req,res,next)=>{
     let {id} = req.params;
   const updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !== 'undefined'){
 const url= req.file.path;
    const filename = req.file.filename;
     updatedListing.image = {url,filename};
   }
     req.flash('success','Listing updated')
    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async(req,res,next)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);  // when we delete this it will trigger to post middleware in listing model
      req.flash('success','Listing deleted')
     res.redirect('/listings');
};

module.exports.category = async (req, res, next) => {
    try {
        let { category } = req.query;
        let allListing = await Listing.find({ category: category });
        res.render("listings/category.ejs", { Listing: allListing });
        // OR res.json(categoryListing); if testing
    } catch (err) {
        next(err);
    }
}

module.exports.search =  async (req, res, next) => {
  let { q } = req.query;   // get search text

  if (!q || q.trim() === "") {
    return res.redirect("/listings");  // if empty search
  }

  // Case-insensitive search
  const results = await Listing.find({
    country: { $regex: q, $options: "i" }
  });

  res.render("listings/index.ejs", { alllisting: results });
};

    


