const { User, UserDetail } = require('../../db');
var fs = require('fs');
var https = require('https');

exports.createUserName = createUserName = (userId, fullName) => {
    const filteredFullName = fullName.split(' ').join('').toLowerCase();
    return `${filteredFullName}${userId}`;
}

exports.checkUserExist = checkUserExist = async (email) => {
    let user = await User.findOne({
        Email: email
    });

    return user;
}

exports.userDetails = userDetails = async (userId) => {
    const user = await UserDetail.findOne({ User: userId }).select("FullName PhoneNumber DateOfBirth").populate('User', '_id Email IsEmailVerified IsPhoneNumberVerified LastLoggedIn');

    let details = {};
    if (user) {
        details = user.toJSON();
        delete details._id;
        details = Object.assign(details, details.User);
        delete details.User;

        details.UserId = details._id;
        delete details._id;
    }

    return details;
}

/** End Common Functions  **/