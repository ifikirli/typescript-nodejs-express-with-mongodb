import BaseTimestampsModel from "./base-timestamps.model";

export default interface UserModel extends BaseTimestampsModel {
    
    username: string;
    salt: string;
    password: string;
    last_login?: Date;
}