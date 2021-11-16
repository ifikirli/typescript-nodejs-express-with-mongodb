const ResponseStatusCodes = {
    
    SUCCESSFUL_GENERAL_OPERATION : { code : 1, message : "Operation is successful." },
    SUCCESSFUL_INSERT_OPERATION : { code : 2, message : "Insert operation is successful." },
    SUCCESSFUL_UPDATE_OPERATION : { code : 3, message : "Update operation is successful." },
    SUCCESSFUL_DELETE_OPERATION : { code : 4, message : "Delete operation is successful." },
    SUCCESSFUL_GET_DETAIL_OPERATION : { code : 5, message : "Get detail operation is successful." },
    SUCCESSFUL_LIST_OPERATION : { code : 6, message : "List operation is successful." },
    GENERAL_VALIDATION_ERROR : { code : 7, message : "Validation error." },
    BUSINESS_EXCEPTION : { code : 8, message : "An error was occured." },
    NO_PERMISSION_FOR_OPERATION : { code : 9, message : "You have no permission to process this operation." },
    TOKEN_NOT_FOUND : { code : 10, message : "No token can be found." },
    TOKEN_VERIFICATION_ERROR : { code : 11, message : "An error was occured while verifying user token." },
    INVALID_PARAMETERS : { code : 12, message : "Invalid parameter(s)." },
    DB_EXCEPTION : { code : 13, message : "An error occurred while processing/receiving data. Please contact the system administrator." },
    EXIST_TOURNAMENT_NAME : { code : 14, message : "Existing tournament name cannot be used to add/update." },
    INVALID_TOURNAMENT_ID_PARAM : { code : 15, message : "Invalid tournament id param." },
    NO_TOURNAMENT_RECORD : { code : 16, message : "There is no valid tournament record." },
    INVALID_TEAM_ID_PARAM : { code : 17, message : "Invalid team id param." },
    EXIST_TEAM_NAME_OR_LOGO : { code : 18, message : "Existing team name or logo url cannot be used to add/update." },
    NO_TEAM_RECORD : { code : 19, message : "There is no valid team record." },
    INVALID_POT_ID_PARAM : { code : 20, message : "Invalid pot id param." },
    NO_POT_RECORD : { code : 21, message : "There is no valid pot record." },
    INVALID_POT_TEAM_COUNT : { code : 22, message : "Pot team count has to be 8." },
    EXISTING_POT_TEAMS : { code : 23, message : "Teams has been already in pots." },
    INVALID_TOURNAMENT_ID__POT_ID_PARAM : { code : 24, message : "Invalid tournament/pot id param." },
    INVALID_POT_COUNT : { code : 25, message : "Pot count has to be 4." },
    EXIST_USERNAME : { code : 26, message : "Existing username cannot be used to add/update." },
    NO_USER_RECORD : { code : 27, message : "Username or password is incorrect." },
    TOKEN_CREATE_ERROR : { code : 28, message : "An error was occured while creating user token." }
};

export default ResponseStatusCodes;