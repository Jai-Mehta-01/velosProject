const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentHistorySchema = new Schema({
    userID:{
        type:String,
        required:true
    },
    cycleID:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String
    },
    returned:{
        type:Boolean,
        required:true,
    }

});

module.exports = mongoose.model('RentHistory',rentHistorySchema);
