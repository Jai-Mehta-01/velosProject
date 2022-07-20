const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phoneNumber:{
        type:String,
    },
    secretKey:{
        type:String,
        default:null,
    },
    googleID:{
        type:String
    },
    isAdministrator:{
        type:Boolean,
        default:false
    }

});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
module.exports = mongoose.model('User',userSchema);
