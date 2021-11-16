import BaseUserRequest from "./base-user-request";

export default interface UserRequest extends BaseUserRequest {
    
    password_confirmation: string;
}