const User = require('../models/users')
const crypto = require('crypto');       //for generating random string for secret key
// const User = require('../models/users')
const RentHistory = require('../models/rented_history')

module.exports.loginPage = async(req,res)  =>
{
    if (!req.user)
        res.render('users/login');
    else {
        var redirectUrl = req.session.returnTo;
        res.redirect(redirectUrl);
    }
}

module.exports.Login = async(req,res) =>
{
    req.flash('success', 'Welcome!!');
    res.redirect('/');
}

module.exports.signUpPage = async(req,res) =>
{
    if (!req.user)
        res.render('users/signup');
    else {
        const redirectUrl = req.session.returnTo;
        res.redirect('/');
    }
}

module.exports.signUp = async(req,res) =>
{
    try {
        const { username, email, phoneNumber, password } = req.body;
        const secretKey = crypto.randomBytes(20).toString('hex');
        const user = new User({ username: username, email: email, phoneNumber: phoneNumber, secretKey: secretKey });
        const registeredUser = await User.register(user, password);
        await registeredUser.save();
        req.login(registeredUser, err => {
            if (err) {
                next(err);
            }
        })
        req.flash('success', 'Welcome!!');
        res.redirect('/');
    } catch (e) {
        req.flash('error', 'Username already taken');
        res.redirect('/signup');
    }
}

module.exports.profile = async(req,res) =>
{
    if (req.user.username == "admin")
        return res.redirect('/');
    const user = await User.findById({ _id: req.user._id });
    res.render('users/myProfile', { user });
}

module.exports.profileEditPage = async(req,res) =>
{
    if (req.user.username == "admin")
        return res.redirect('/');
    const user = await User.findById({ _id: req.user._id });
    res.render('users/editProfile', { user });
}

module.exports.profileEdit = async(req,res)  =>
{
    if (req.user.username == "admin")
        return res.redirect('/');
    const { username, phonenumber } = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, { username: username, phoneNumber: phonenumber });
    user.save();
    res.redirect('/profile');
}

module.exports.userActiveOrdersPage = async(req,res) =>
{
    if (req.user.username == "admin")
        return res.redirect('/');
    const user = await User.findById({ _id: req.user._id });
    const rented_history = await RentHistory.find({ userID: req.user._id });
    const returned_history = await RentHistory.find({ userID: req.user._id, returned: true })
    var returned_all = false;
    if (rented_history.length == returned_history.length) {
        returned_all = true;
    }
    res.render('users/activeOrders', { rented_history, user, returned_all });
}

module.exports.userHistoryPage = async(req,res) =>
{
    if (req.user.username == "admin")
        return res.redirect('/');
    const rented_history = await RentHistory.find({ userID: req.user._id });
    res.render('users/userHistory', { rented_history });

}
module.exports.logOut = async(req,res) =>
{
    req.logout();
    req.flash('success','Successfully logged you out!');
    res.redirect('/');
}