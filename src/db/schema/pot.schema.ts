import mongoose, { Schema } from "mongoose";
import PotModel from "../model/pot.model";

const potSchema = new mongoose.Schema<PotModel>({ name : { type : String, required : true, maxLength : 10, trim : true, uppercase : true, unique : true }, 
    teams : [{ type : Schema.Types.ObjectId, ref : "Team" }],
    tournament : { type : Schema.Types.ObjectId, ref : "Tournament", required : true }
});
const Pot = mongoose.model<PotModel>("Pot", potSchema);
export { Pot };
