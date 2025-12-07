import {validationResult} from 'express-validator';
import userServices from "../services/user-services.js";
import ApiError from "../exceptions/api-error.js";

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validatsiyada xatolik", errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userServices.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return next(ApiError.BadRequest("Validatsiyada xatolik", errors.array()))
            // }
            const {email, password} = req.body;
            const userData = await userServices.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userServices.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e)
        }
    }

    async activated(req, res, next) {
        try {
            const link = req.params.link;
            await userServices.activate(link);
            // console.log(link);
            return res.redirect(process.env.CLIENT_URL);
            // res.json([link])
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userServices.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userServices.getAllUsers()
            return res.json(users);
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController();