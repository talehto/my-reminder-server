const usercontroller = require('./../controllers/user.ctrl')

module.exports = (router) => {

    /**
     * adds a user
     */
    router.route('/user/addUser').post(usercontroller.addUser)

    //router.route('/user/getUserByName/:username').get(usercontroller.getUserByName)
    router.route('/user/:username').get(usercontroller.getUserByName)
}