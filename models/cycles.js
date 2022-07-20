const mongoose = require('mongoose');
const Schema = mongoose.Schema


const newCycle = new Schema({
    manufacturer:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:Boolean,
        required:true
    },
    booked:{
        type:Boolean,
        default:false
    },
    image:{
        url:String,
        filename:String
    },
    hosted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Cycle',newCycle);