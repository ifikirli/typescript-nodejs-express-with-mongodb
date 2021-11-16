import mongoose, { Schema } from "mongoose";
import GroupModel from "../model/group.model";

const groupSchema = new mongoose.Schema<GroupModel>({ name : { type : String, required : true, maxLength : 10, trim : true, uppercase : true, unique : true }, 
    teams : [{ type : Schema.Types.ObjectId, ref : "Team" }],
    tournament : { type : Schema.Types.ObjectId, ref : "Tournament", required : true }
});
const Group = mongoose.model<GroupModel>("Group", groupSchema);
export { Group };
