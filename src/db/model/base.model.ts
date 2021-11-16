import mongoose from "mongoose";

export default interface BaseModel {
    
    _id: mongoose.Types.ObjectId;
}