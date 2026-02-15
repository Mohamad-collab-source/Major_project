const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.number().required(),
       image: Joi.object({
      filename: Joi.string().allow("", null),
      url: Joi.string().allow("", null),
    }).optional(),
    
    category: Joi.string()
      .valid('Trending', 'Rooms', 'Mountains', 'Beach','Iconic cities','Castles','Camping','Farm','Arctic','Amazing Pools','Domes','Boats')
      .required()
    }).required()
});

// schema for review model

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
      rating: Joi.number().required().min(1).max(5) ,
      comment: Joi.string().required(),
    }).required()
});