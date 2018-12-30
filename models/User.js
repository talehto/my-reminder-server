const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        name: {type:String, trim:true},
        email: {type:String, trim:true},
        password: {type:String, trim:true},
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
module.exports = mongoose.model('User', UserSchema)
