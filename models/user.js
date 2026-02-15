const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require passport 
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});
userSchema.plugin(passportLocalMongoose); //automatically creates  username and password

module.exports = mongoose.model("User",userSchema);