import userServices from "../services/user-services.js";

class UserController {
    async registration(req, res) {
        try {
            const {email, password} = req.body;
            const userData = await userServices.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            console.log(e)
        }
    }

    async login(req, res) {
        try {

        } catch (e) {

        }
    }

    async logout(req, res) {
        try {

        } catch (e) {

        }
    }

    async activated(req, res) {
        try {
            const link = req.params.link;
            await userServices.activate(link);
            // console.log(link);
            return res.redirect(process.env.CLIENT_URL);
            // res.json([link])
        } catch (e) {

        }
    }

    async refresh(req, res) {
        try {

        } catch (e) {

        }
    }

    async getAllUsers(req, res) {
        try {
            res.json(['212','213']);
        } catch (e) {

        }
    }
}

export default new UserController();