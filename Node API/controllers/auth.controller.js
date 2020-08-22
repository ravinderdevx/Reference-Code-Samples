const { SuccessResponse, ErrorResponse } = require('../common/utilities/response');
const authService = require('../services/auth.service');

class AuthController {
    async login(req, res) {
        try {
            const response = await authService.authenticateUser(req.body);
            return SuccessResponse(res, response);
        } catch (ex) {
            return ErrorResponse(res, ex, 401);
        }
    }

    async register(req, res) {
        try {
            const response = await authService.registerUser(req.body);
            return SuccessResponse(res, response);
        } catch (ex) {
            return ErrorResponse(res, ex);
        }
    }
}

module.exports = new AuthController();