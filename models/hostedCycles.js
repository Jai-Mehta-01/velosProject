const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hostedCyclesSchema = new Schema({
    manufacturer:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    },
    hostFrom:{
        type:String,
        required:true
    },
    hostTo:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String,
    },
    reviewed:{
        type:Boolean,
        required:true,
    }
})
module.exports = mongoose.model('hostedCycle',hostedCyclesSchema);