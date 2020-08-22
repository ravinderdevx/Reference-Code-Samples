const { ExtractJwt, Strategy } = require('passport-jwt');

const { User }      = require('../../db/models');
const CONFIG        = require('../../config/config');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async (payload, next) => {
        try {
            const user = await User.findById(payload.UserId);
            if(user) {
                return next(null, user);
            } else {
                return next(null, false);
            }
        } catch(ex) {
            return next(ex.Message, false)
        }
        
    }));
}