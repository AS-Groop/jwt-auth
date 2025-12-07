import jwt from "jsonwebtoken";
import tokenModel from "../models/token-model.js";

class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: '15d'});
        return {accessToken, refreshToken};
    }

    validateRefreshToken(refreshToken){
        try {
            const token = jwt.verify(refreshToken, process.env.JWT_REFRESH);
            return token;
        } catch (e) {
            return null
        }
    }
    validateAccessToken(accessToken){
        try {
            const token = jwt.verify(accessToken, process.env.JWT_ACCESS);
            return token;
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const tokensData = await tokenModel.findOne({user: userId});
        if (tokensData) {
            tokensData.refreshToken = refreshToken;
            await tokensData.save();
            return tokensData;
        }
        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const token = await tokenModel.deleteOne({refreshToken});
        return token;
    }

    async refreshToken(refreshToken) {

    }

    async findToken(refreshToken) {
        const token = await tokenModel.findOne({refreshToken});
        return token;
    }
}

export default new TokenService();