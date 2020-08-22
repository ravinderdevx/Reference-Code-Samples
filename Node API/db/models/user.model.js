const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CONFIG = require('../../config/config');
const messages = require('../../common/static/messages');
const { ThrowException } = require('../../common/utilities/response');

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    // UserId: {
    //     type: Number,
    //     autoIncrement: true
    // },
    UserName: {
        type: String,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required:false,
        min: [8, messages.ERROR_MESSAGES.PASSWORD_MINLENGTH]
    },
    SocialLoginId: String,
    Provider:String,
    EmailVerificationToken: String,
    ResetPasswordToken: String,
    ResetPasswordExpires: {
        type: Date
    },
    LastLoggedIn: {
        type: Date,
        default: new Date()
    },
    IsEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    IsPhoneNumberVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    IsActive: {
        type: Boolean,
        default: true,
        required: true
    },
    IsDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    CreatedOn: {
        type: Date,
        default: new Date(),
        required: true
    },
    ModifiedOn: {
        type: Date,
        default: new Date(),
        required: true
    }
}, {
    timestamps: false
});

userSchema.pre('save', async function (next) {
    try {
        var user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified('Password')) return next();

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(this.Password, salt);

        user.Password = hash;
        next();
    } catch (ex) {
        ThrowException(ex);
    }
});

userSchema.methods.comparePassword = async function (pswd) {
    try {
        if (!this.Password)
            ThrowException({ name: 'customError', message: 'password not set' });


        const pass = await bcrypt.compare(pswd, this.Password);

        if (!pass)
            ThrowException({ name: 'customError', message: 'Password is not correct' });

        return this;
    } catch (ex) {
        ThrowException(ex);
    }
};

userSchema.methods.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);

    return `Bearer ${jwt.sign({ user_id: this.UserId }, CONFIG.jwt_encryption, { expiresIn: expiration_time })}`;
};


module.exports = mongoose.model('User', userSchema);
