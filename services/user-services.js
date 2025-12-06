import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import UserModel from "../models/user-model.js";
import mailServices from "./mail-services.js";
import tokenServices from "./token-services.js";
import UserDto from "../dtos/user-dto.js";
import userModel from "../models/user-model.js";


class UserServices {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw new Error("User is already registered");
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

    async activate(activationLink) {
        const user = await userModel.findOne({activationLink});
        if (!user) {
            throw new Error(`No togri link! ${activationLink}`);
        }
        user.isActivated = true
        await user.save()
    }
}

export default new UserServices();