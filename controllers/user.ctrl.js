/** */
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/User')
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

module.exports = {
    register: (req, res) => {
        console.log('Executing register method. Email: ' + req.body.email)
        const { errors, isValid } = validateRegisterInput(req.body);
        if(!isValid) {
            console.log('NOT VALID REQUEST. Body: ' + req.body)
            return res.status(400).json(errors);
        }
        console.log('Executing register method. Validation succeed.')
        var queryPromise = User.findOne({email: req.body.email}).exec();
        queryPromise.then(user => {
        if(user) {
            console.log("Email already exists")
            //return res.status(400).json({
            //    email: 'Email already exists'
            //});
            return res.status(400).send("Email already exists");
        }else{
            console.log("Creating an avatar")
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                //avatar
            });
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    console.log('User saved successfully. User: ' + user.name)
                                    res.json(user)
                                }) 
                                .catch(err => {
                                    res.status(400).send("unable to save to database");
                                });
                        }
                    });
                }
            });
        }
        });
    }, 
    login: (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);
        if(!isValid) {
            return res.status(400).json(errors);
        }
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });

    },
    me: (req, res) => {
        return res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    },
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
