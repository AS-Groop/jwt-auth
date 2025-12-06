import jwt from "jsonwebtoken";
import tokenModel from "../models/token-model.js";

class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: '15d'});
        return {accessToken, refreshToken};
    }

    async saveToken(userId, refreshToken){
        const tokensData = await tokenModel.findOne({user: userId});
        if (tokensData) {
            tokensData.refreshToken = refreshToken;
            await tokensData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken});
        return token;
    }
}

export default new TokenService();