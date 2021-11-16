import { BusinessException } from "../exception/custom.exception";
import UserRequest from "../interface/user/user-request";
import userRepository from "../repository/user.repository";
import ResponseStatusCodes from "../response/response-status-codes";
import bcrypt from "bcrypt";
import config from "../config";
import UserDbRequest from "../interface/user/user-db-request";
import BaseUserRequest from "../interface/user/base-user-request";
import TokenUtil from "../util/token.util";
import TokenDetail from "../interface/token/token-detail";

class UserService {

    userRepository: typeof userRepository;

    constructor () {

        this.userRepository = userRepository;
    }

    async register (userRequest: UserRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                
                if (await this.userRepository.existUsername(userRequest.username))
                    throw new BusinessException(ResponseStatusCodes.EXIST_USERNAME.code);
                const salt = bcrypt.genSaltSync(config.SALT_ROUND);
                const password = bcrypt.hashSync(userRequest.password, salt);
                const userDbRequest: UserDbRequest = { username : userRequest.username, salt : salt, password : password };
                await this.userRepository.add(userDbRequest);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async login (userRequest: BaseUserRequest): Promise<TokenDetail> {
        
        return new Promise(async (resolve, reject) => {

            try {
                
                const user = await this.userRepository.getByUsername(userRequest.username)
                if (!user)
                    throw new BusinessException(ResponseStatusCodes.NO_USER_RECORD.code);
                const password = bcrypt.hashSync(userRequest.password, user.salt);
                if (user.password != password)
                    throw new BusinessException(ResponseStatusCodes.NO_USER_RECORD.code);
                resolve(TokenUtil.getToken(user._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }
}

const userService = new UserService();
export default userService;