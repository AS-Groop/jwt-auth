import ApiError from "../exceptions/api-error.js";
import tokenServices from "../services/token-services.js";

export default function (req, res, next) {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) {
            return next(ApiError.UnauthorizedError())
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = tokenServices.validateAccessToken(token);
        console.log(userData);
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}