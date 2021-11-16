import mongoose from "mongoose";
import UserModel from "../model/user.model";

const userSchema = new mongoose.Schema<UserModel>({ username : { type : String, required : true, minLength : 2, maxLength : 20, trim : true, unique : true }, 
    password : { type : String, required : true },
    salt : { type : String, required : true },
    last_login : { type : Date }
}, { timestamps : { createdAt : "created_at", updatedAt : "updated_at" } });
const User = mongoose.model<UserModel>("User", userSchema);
export { User };
