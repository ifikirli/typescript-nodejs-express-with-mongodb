import { Countries } from "../../enum/countries";

export default interface TeamRequest {
    
    name: string;
    country: Countries;
    logo_url: string;
}