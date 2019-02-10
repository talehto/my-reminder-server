const passport = require('passport');
const usercontroller = require('./../controllers/user.ctrl')

module.exports = (router) => {

    router.route('/user/register').post(usercontroller.register)

    router.route('/user/login').post(usercontroller.login)

    router.route('/user/me').get(passport.authenticate('jwt', { session: false }),
                                 usercontroller.me)

    /**
     * adds a user
     */
    router.route('/user/addUser').post(usercontroller.addUser)

    router.route('/user/:username').get(usercontroller.getUserByName)
}