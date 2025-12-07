import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import UserModel from "../models/user-model.js";
import mailServices from "./mail-services.js";
import tokenServices from "./token-services.js";
import UserDto from "../dtos/user-dto.js";
import userModel from "../models/user-model.js";
import ApiError from "../exceptions/api-error.js";


class UserServices {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest("User is already registered");
        }
        const activationLink = uuid.v4()
        const passwordHash = await bcrypt.hash(password, 3);

        const user = await UserModel.create({email, password: passwordHash, activationLink});
        await mailServices.sendActivationLink(user.email, `${process.env.API_URL}/api/activated/${activationLink}`);

        const userDto = new UserDto(user)
        const tokens = tokenServices.generateToken({...userDto});

        await tokenServices.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};

    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest("Email not found");
        }
        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            throw ApiError.BadRequest("Password not match");
        }
        const userDto = new UserDto(user)
        const tokens = tokenServices.generateToken({...userDto});

        await tokenServices.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        const user = await userModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest(`No togri link! ${activationLink}`);
        }
        user.isActivated = true
        await user.save()
    }

    async logout(refreshToken) {
        const token = await tokenServices.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenServices.validateRefreshToken(refreshToken);
        const tokenBD = await tokenServices.findToken(refreshToken);

        if (!tokenBD || !userData) {
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateToken({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }
}

export default new UserServices();