if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}



const express =  require("express");
const app = express();
const mongoose = require('mongoose');
 

// ejs and path folder

const path = require('path');
app.set('view engine',"ejs");
app.set('views',path.join(__dirname,"views")); 

// to allow url encoded data

app.use(express.urlencoded({extended:true}));
app.use(express.json());


// method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// ejs-mate
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);

// public folder for static files
app.use(express.static(path.join(__dirname,"/public")));

//require ExpressError handler function 
const ExpressError = require('./Utily/ExpressError.js');

// requiring express-router files
const listingrouter = require('./routes/listing.js');
const reviewrouter = require('./routes/review.js');
const userrouter = require('./routes/user.js');


// require session 
const session = require('express-session');
// require mongo store
const MongoStore = require('connect-mongo').default;

//require flash
const flash = require('connect-flash');

// require passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

let dbUrl = process.env.ATLASDB_URL;
main().then((res)=>{
console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(dbUrl);
}

const store =  MongoStore.create({
   mongoUrl: dbUrl,
   crypto : {
    secret:process.env.SECRET,
   },
   touchAfter: 24 * 3600,
});

store.on('error',()=>{
    console.log('error in mongoDb session store',err)
}

)

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly:true,
    },
}

// use of session 
app.use(session(sessionOptions));
app.use(flash());

// use of passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req,res,next)=>{
    res.locals.success= req.flash('success');
     res.locals.error= req.flash('error');
     res.locals.currUser = req.user;
    next();
})
// use of express router
app.use('/listings',listingrouter);
app.use('/listings/:id/reviews',reviewrouter);
app.use('/',userrouter);


//if entered route doesn't match any routes then 
app.use((req,res,next)=>{ 
    
    next(new ExpressError(404,"page not found!"));
})

// error handling middleware
app.use((err,req,res,next)=>{
   let {statusCode=500,message} =err;
   res.status(statusCode).render('listings/error.ejs',{err}); 
  
})

app.listen(8080,(req,res)=>{
    console.log('server is listening on port 8080');
})