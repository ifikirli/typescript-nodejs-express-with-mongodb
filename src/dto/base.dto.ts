export default class BaseDto {
    
    id: string;
    name: string;

    constructor (id: string, name: string) {

        this.id = id;
        this.name = name;
    }
}