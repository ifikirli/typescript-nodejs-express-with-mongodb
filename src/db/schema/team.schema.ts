import mongoose from "mongoose";
import { Countries } from "../../enum/countries";
import TeamModel from "../model/team.model";
import validator from "validator";

const teamSchema = new mongoose.Schema<TeamModel>({ name : { type : String, required : true, maxLength : 100, trim : true, uppercase : true, unique : true }, 
    country : { type : String, required : true, enum : Countries }, 
    logo_url : { type : String, required : true, unique : true, validate : { validator : function (logo_url: string) {
        return validator.isURL(logo_url);
    } } } });
const Team = mongoose.model<TeamModel>("Team", teamSchema);
export { Team };