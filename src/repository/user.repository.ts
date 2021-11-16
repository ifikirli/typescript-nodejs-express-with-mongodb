import mongoose from "mongoose";
import UserModel from "../db/model/user.model";
import { User } from "../db/schema/user.schema";
import { DatabaseException } from "../exception/custom.exception";
import UserDbRequest from "../interface/user/user-db-request";

class UserRepository {
    
    async existUsername (username: string, _id?: mongoose.Types.ObjectId): Promise<boolean> {
        
        return new Promise((resolve, reject) => {

            try {
                if (_id)
                    resolve(User.exists({ _id : _id, username : username }));
                else
                    resolve(User.exists({ username : username }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async add (userDbRequest: UserDbRequest): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const user = new User(userDbRequest); 
                await user.save();
                resolve();
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }

    async getByUsername (username: string): Promise<UserModel | null | undefined> {
        
        return new Promise((resolve, reject) => {

            try {
                resolve(User.findOne({ username : username }));
            } catch (error) {
                reject(new DatabaseException(error));
            }
        });
    }
}

const userRepository = new UserRepository();
export default userRepository;