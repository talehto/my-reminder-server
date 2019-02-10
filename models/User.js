const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

let UserSchema = new mongoose.Schema(
    {
        name: {type:String, trim:true, unique: true, required: true},
        email: {type:String, trim:true, unique: true, required: true},
        password: {type:String, trim:true, required: true},
        avatar: {type: String},
        date: {type: Date,default: Date.now},
        alarms: [
            {
                alarmName: {type:String, trim:true},
                alarmRecord: { data: Buffer, contentType: {type:String, trim:true} },
                alarmTimes: [
                    {
                        day: {type:String, trim:true},
                        time: {type:String, trim:true},
                    }
                ]
            }
        ]
    }
)
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema)
