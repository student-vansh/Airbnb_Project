const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema(
    {
        email : {
            type: String,
            required : true
        },

    }
)

userSchema.plugin(passportLocalMongoose);
// they can use this line-16 they can automatically add a username, password and hashing and salt
module.exports = mongoose.model("User",userSchema);