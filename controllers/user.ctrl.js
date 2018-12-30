/** */
const User = require('./../models/User')

module.exports = {
    addUser: (req, res, next) => {
        console.log(req.body);
        new User(req.body).save((err, newUser) => {
            console.log(err)
            if (err) {
                console.log("Error occured: " + err)
                res.send(err)
            }else if (!newUser){
                console.log("No new user")
                res.send(400)
            }else{
                console.log("No error")
                res.send(newUser)
            }
            next()
        });
    },
    getUserByName: (req, res, next) => {
        console.log(req.params.username)
        User.find({name:req.params.username}).then((err, user)=> {
            console.log(err)
            if (err)
                res.send(err)
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()            
        })
    }
}
