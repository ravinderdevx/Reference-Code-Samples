const { User, UserDetail } = require('../db');
const { sendMailUsingEmailTemplate, getConfigurationValue } = require('./common/general');
const { checkUserExist, createUserName, userDetails, checkUserResetToken, checkEmailVerificationToken,checkSocialUserExist,saveProfileImage } = require('./common/user');
const { generateSecureString } = require('../common/utilities/general');
const { ThrowException } = require('../common/utilities/response');
const messages = require('../common/static/messages');

class AuthService {
    async authenticateUser(userInfo) {
        let user = await checkUserExist(userInfo.Email);

        if (!user)
            ThrowException({ name: 'customError', message: `Invalid email or pasword.` });
        else if (user.IsEmailVerified == false)
            ThrowException({ name: 'customError', message: `Please verify your email address.` });

        // Check Password for User
        await user.comparePassword(userInfo.Password);

        // Update LastLoggedIn of User
        user.LastLoggedIn = new Date();
        await user.save();

        const response = {
            data: {
                token: user.getJWT(),
                user: await userDetails(user._id)
            }
        };
        return response;
    };

    async registerUser(userInfo) {
        let userExist = await checkUserExist(userInfo.Email);

        if (userExist) {
            ThrowException({ name: 'customError', message: `Email already registered.` });
        }

        // Creat User with Email & Password
        let user = new User();
        user.Email = userInfo.Email;
        user.Password = userInfo.Password;
        await user.save();

        // Newly inserted Object ID (UserId)
        const userId = user._id;

        // Update UserName
        const emailVerificationToken = await generateSecureString(20);
        user.UserName = createUserName(userId, userInfo.FullName);
        user.EmailVerificationToken = emailVerificationToken;
        await user.save();

        // Create User Details Record
        let userDetail = new UserDetail({
            FullName: userInfo.FullName,
            User: userId
        });

        await userDetail.save();

        // Verification Email
        const siteUrl = await getConfigurationValue('SITE_URL');

        const dataObject = {
            name: userInfo.FullName,
            bgimageurl:`${siteUrl}\\assets\\emailtemplateimages\\bgimage.png`,
            logourl:`${siteUrl}\\assets\\emailtemplateimages\\logo.png`,
            bgimage2url:`${siteUrl}\\assets\\emailtemplateimages\\banner.png`,
            successimageurl:`${siteUrl}\\assets\\emailtemplateimages\\tick.png`,
            fbimageurl:`${siteUrl}\\assets\\emailtemplateimages\\facebook.png`,
            twitterimageurl:`${siteUrl}\\assets\\emailtemplateimages\\twitter.png`,
            youtubeimageurl:`${siteUrl}\\assets\\emailtemplateimages\\youtube.png`,
            url: `${siteUrl}\\email-verification\\${emailVerificationToken}`
        };

        const mailObject = {
            recipients: [{
                Email: userInfo.Email
            }]
        };

        // Send Forgot Password  Email
        sendMailUsingEmailTemplate('EMAIL_VERIFICATION_TEMPLATE', dataObject, mailObject);

        const response = {
            message: messages.SUCCESS_MESSAGES.EMAIL_VERIFCATION
        };

        return response;
    };

    async forgotPassword(data) {
        const email = data.Email;
        const user = await checkUserExist(email);

        if (!user)
            ThrowException({ name: 'customError', message: `User with '${data.Email}' email is not registered ` })

        const resetToken = await generateSecureString(20);

        user.ResetPasswordToken = resetToken;
        user.ResetPasswordExpires = Date.now() + 86400000;
        user.save();

        // Verification Email
        const siteUrl = await getConfigurationValue('SITE_URL');

        const dataObject = {
            //name: user.FullName,
            bgimageurl:`${siteUrl}\\assets\\emailtemplateimages\\passwordbg.jpg`,
            logourl:`${siteUrl}\\assets\\emailtemplateimages\\logo.png`,
            url: `${siteUrl}\\reset-password\\${resetToken}`
        };

        const mailObject = {
            recipients: [{
                Email: email
            }]
        };

        // Send Forgot Password  Email
        sendMailUsingEmailTemplate('FORGOT_PASSWORD_TEMPLATE', dataObject, mailObject);

        const response = {
            message: messages.SUCCESS_MESSAGES.EMAIL_FORGOT_PASSWORD
        };

        return response;
    }

    async emailVerification(data) {
        const user = await checkEmailVerificationToken(data.Token);

        if (!user)
            ThrowException({ name: 'customError', message: `The email verification link is not valid` })

        // Update IsEmailVerified = true
        user.EmailVerificationToken = null;
        user.IsEmailVerified = true;
        user.save();

        const response = {
            message: messages.SUCCESS_MESSAGES.EMAIL_VERIFIED
        };

        return response;

    }

    async validateResetPasswordToken(data) {
        const user = await checkUserResetToken(data.Token);

        if (!user)
            ThrowException({ name: 'customError', message: `The Password reset link has been expired` })

        return user;
    }

    async resetPassword(data) {
        const user = await checkUserResetToken(data.Token);
        const password = data.Password

        user.ResetPasswordToken = null;
        user.ResetPasswordExpires = null;
        user.Password = password;
        user.save();

        const response = {
            message: messages.SUCCESS_MESSAGES.RESET_PASSWORD
        };

        return response;
    }

    async socialLogin(userInfo) {

       const userData={
            email:userInfo.Email,
            provider:userInfo.Provider
        }

        let userExist = await checkSocialUserExist(userData);
        if (userExist) {

            let user = await checkUserExist(userInfo.Email);
            user.LastLoggedIn = new Date();
            
            await user.save();
            const response = {
                data: {
                    token: user.getJWT(),
                    user: await userDetails(user._id)
                }
            };
            return response;
        }

        else {
            let newuser = new User();
            newuser.Email = userInfo.Email;
            newuser.SocialLoginId = userInfo.SocialLoginId;
            newuser.Provider = userInfo.Provider;
            newuser.IsEmailVerified=true;
            await newuser.save();

            // Newly inserted Object ID (UserId)
            const newuserId = newuser._id;

            newuser.UserName = createUserName(newuserId, userInfo.FullName);
            await newuser.save();
            
            //save profile image
            let image_name=userInfo.ImageURL+'_'+Date.now()+'.jpg'
            saveProfileImage(userInfo.ImageURL,'./uploads/profileimages/'+image_name)             
                       
            // Create User Details Record
            let newuserDetail = new UserDetail({
                FullName: userInfo.FullName,
                User: newuserId,
                ProfilePicture:image_name
            });
            await newuserDetail.save();
            const response = {
                data: {
                    token: newuser.getJWT(),
                    user: await userDetails(newuserId._id)
                }
            };
            return response;
        }
    };

}

module.exports = new AuthService();