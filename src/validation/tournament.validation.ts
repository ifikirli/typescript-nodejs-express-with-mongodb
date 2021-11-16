import Joi from "joi";
import { SortTypes } from "../enum/sort-types";

const schemas = {
    
    list : Joi.object().keys({

        name : Joi.string().trim().min(1).max(50).allow(null, "").optional(),
        limit : Joi.number().integer().min(5).less(101).required(),
        skip : Joi.number().integer().min(0).required(),
        order_by : Joi.string().valid("name").required(),
        sort_by : Joi.string().valid(...Object.values(SortTypes)).required()
    }).options({ abortEarly : false }),

    add : Joi.object().keys({

        name : Joi.string().trim().min(8).max(100).required()
    }).options({ abortEarly : false }),

    get : Joi.object().keys({

        id : Joi.string().trim().required()
    }).options({ abortEarly : false })
};

export default schemas;