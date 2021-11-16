import Joi from "joi";
import config from "../config";

const schemas = {
    
    updateTeamsParams : Joi.object().keys({

        tournamentId : Joi.string().trim().required(),
        id : Joi.string().trim().required()
    }).options({ abortEarly : false }),

    updateTeamsBody : Joi.object().keys({

        team_ids : Joi.array().min(config.POT_TEAM_COUNT).max(config.POT_TEAM_COUNT).items(Joi.string()).unique().required()
    }).options({ abortEarly : false })
};

export default schemas;