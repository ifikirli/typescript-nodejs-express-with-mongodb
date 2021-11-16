import { Countries } from "../../enum/countries";
import BaseModel from "./base.model";

export default interface TeamModel extends BaseModel {
    
    name: string;
    country: Countries;
    logo_url: string;
}