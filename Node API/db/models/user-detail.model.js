const mongoose = require("mongoose");
const messages = require('../../common/static/messages');

let userDetailSchema = new mongoose.Schema({
    // UserDetailId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    User: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    FullName: {
        type: String,
        required: true
    },
    PhoneNumber  : {
        type: String,
        min: [10, messages.ERROR_MESSAGES.PHONE_MINLENGTH],
        max: [10, messages.ERROR_MESSAGES.PHONE_MINLENGTH]
    },
    DateOfBirth: {
        type: Date
    },

    ProfilePicture: {
        type: String         
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

module.exports = mongoose.model('UserDetail', userDetailSchema);