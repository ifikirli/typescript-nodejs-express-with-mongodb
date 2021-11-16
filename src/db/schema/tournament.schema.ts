import mongoose from "mongoose";
import TournamentModel from "../model/tournament.model";

const tournamentSchema = new mongoose.Schema<TournamentModel>({ name : { type : String, required : true, maxLength : 100, trim : true, uppercase : true, unique : true } });
const Tournament = mongoose.model<TournamentModel>("Tournament", tournamentSchema);
export { Tournament };