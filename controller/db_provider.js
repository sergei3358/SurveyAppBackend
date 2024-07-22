exports.getQuestionSet = () => {
    let query = "SELECT * FROM " + process.env.QUESTION_SET_TABLE;
    return query;
}

exports.getSurveys = () => {
    let query = "SELECT * FROM " + process.env.SURVEYS_TABLE;
    return query;
}

exports.getSurveyMeasurementBySurveyId = (survey_id_fk) => {
    let query = "SELECT * FROM " + process.env.SURVEY_MEASUREMENTS + " WHERE survey_id_fk = '" + survey_id_fk + "'";
    return query;
}

exports.getSurveyQuestionSetBySurveyId = (survey_id_fk) => {
    let query = "SELECT * FROM " + process.env.QUESTION_SET_TABLE + " WHERE survey_id_fk = '" + survey_id_fk + "'";
    return query;
}

exports.getQuestionSetById = () => {
    let query = "SELECT * FROM " + process.env.QUESTION_SET_TABLE +  " WHERE question_set_id = $1";
    return query;
}

exports.getSurveyById = () => {
    let query = "SELECT * FROM " + process.env.SURVEYS_TABLE + " WHERE survey_id = $1";
    return query;
}

exports.createQuestionSet = () => {
    let query = "INSERT INTO " + process.env.QUESTION_SET_TABLE + " (question_set_id, question_set_name, question_set_type) VALUES ($1, $2, $3)";
    return query;
}

exports.createSurvey = () => {
    let query = "INSERT INTO " + process.env.SURVEYS_TABLE + 
    " (survey_id, survey_name, survey_validity_start, survey_validity_end, survey_image_url, survey_image_height, survey_image_width, survey_logo_position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    return query;
}

exports.createQuestionSetInSurvey = () => {
    let query = "INSERT INTO " + process.env.QUESTION_SET_IN_SURVEY + 
    " (question_set_id, survey_id_fk, ranking_survey, question_set_name, question_set_type, row_key) VALUES ($1, $2, $3, $4, $5, $6)";
    return query;
}

exports.createQuestionInQuestionSet = () => {
    let query = "INSERT INTO " + process.env.QUESTIONS_IN_QUESTION_SET + 
    " (question_id, question_line, question_type, question_text, score, row_key, questionset_id_fk) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    return query;
}

exports.createOptionInQuestion = () => {
    let query = "INSERT INTO " + process.env.OPTIONS_IN_QUESTION + 
    " (option_id, option_text, option_index, question_id_fk) VALUES ($1, $2, $3, $4)";
    return query;
}

exports.updateQuestionSet = () => {
    let query = "UPDATE " + process.env.QUESTION_SET_TABLE + " SET question_set_name = ($1), question_set_type = ($2) WHERE question_set_id =($3)";
    return query;
}

exports.updateSurvey = () => {
    let query = "UPDATE " + process.env.SURVEYS_TABLE + " SET survey_name = ($1), survey_validity_start = ($2), survey_validity_end = ($3), survey_image_url = ($4), " + 
    "survey_image_height = ($5), survey_image_width = ($6), survey_logo_position = ($7)  WHERE survey_id =($8)";
    return query;
}

exports.updateQuestionSetInSurvey = () => {
    let query = "UPDATE " + process.env.QUESTION_SET_IN_SURVEY + 
    " SET question_set_id = ($1), ranking_survey = ($2), question_set_name = ($3), question_set_type = ($4), row_key = ($5) WHERE question_set_id = ($6) AND survey_id_fk = ($7)";
    return query;
}

exports.updateQuestionInQuestionSet = () => {
    let query = "UPDATE " + process.env.QUESTIONS_IN_QUESTION_SET + " SET question_line = ($1), question_type = ($2), question_text = ($3), score = ($4), " + 
    "row_key = ($5), questionset_id_fk = ($6) WHERE question_id =($7)";
    return query;
}

exports.updateOptionInQuestion = () => {
    let query = "UPDATE " + process.env.OPTIONS_IN_QUESTION + " SET option_text = ($1), option_index = ($2), question_id_fk = ($3) WHERE option_id =($4)";
    return query;
}

exports.deleteQuestionSetInSurvey = () => {
    let query = "DELETE FROM " + process.env.QUESTION_SET_IN_SURVEY + " WHERE question_set_id = ($1) AND survey_id_fk = ($2)";
    return query;
}

exports.getSurveyWithQuestionSet = () => {
    let query = "SELECT " + process.env.SURVEYS_TABLE + ".*, " + process.env.QUESTION_SET_IN_SURVEY + '.* FROM ' + 
    process.env.SURVEYS_TABLE + " LEFT JOIN " + process.env.QUESTION_SET_IN_SURVEY + " ON " + process.env.SURVEYS_TABLE + ".survey_id =" +
    process.env.QUESTION_SET_IN_SURVEY + ".survey_id_fk WHERE " + process.env.SURVEYS_TABLE + ".survey_id =($1)";
    return query;
}

exports.getQuestionWithOptions = () => {
    let query = "SELECT " + process.env.QUESTIONS_IN_QUESTION_SET + ".*, " + process.env.OPTIONS_IN_QUESTION + '.* FROM ' + 
    process.env.QUESTIONS_IN_QUESTION_SET + " LEFT JOIN " + process.env.OPTIONS_IN_QUESTION + " ON " + process.env.QUESTIONS_IN_QUESTION_SET + ".question_id =" +
    process.env.OPTIONS_IN_QUESTION + ".question_id_fk WHERE " + process.env.QUESTIONS_IN_QUESTION_SET + ".questionset_id_fk =($1)";
    return query;
}

exports.getQuestionSetWithQuestion = () => {
    let query = "SELECT " + process.env.QUESTION_SET_TABLE + ".*, " + process.env.QUESTIONS_IN_QUESTION_SET + ".*, " + process.env.OPTIONS_IN_QUESTION + ".* FROM " + 
    process.env.QUESTION_SET_TABLE + " LEFT JOIN " + process.env.QUESTIONS_IN_QUESTION_SET +  " ON " + process.env.QUESTION_SET_TABLE + ".question_set_id ="  + 
    process.env.QUESTIONS_IN_QUESTION_SET + ".questionset_id_fk " + " LEFT JOIN " + process.env.OPTIONS_IN_QUESTION + " ON " + process.env.QUESTIONS_IN_QUESTION_SET + ".question_id =" +
    process.env.OPTIONS_IN_QUESTION + ".question_id_fk WHERE " + process.env.QUESTION_SET_TABLE + ".question_set_id =($1)";
    return query;
}

exports.getQuestionSetWithQuestionBySurveyId = () => {
    let query = "SELECT " + process.env.QUESTION_SET_IN_SURVEY + ".*, " + process.env.QUESTIONS_IN_QUESTION_SET + ".*, " + process.env.OPTIONS_IN_QUESTION + ".* FROM " + 
    process.env.QUESTION_SET_IN_SURVEY + " LEFT JOIN " + process.env.QUESTIONS_IN_QUESTION_SET +  " ON " + process.env.QUESTION_SET_IN_SURVEY + ".question_set_id ="  + 
    process.env.QUESTIONS_IN_QUESTION_SET + ".questionset_id_fk " + " LEFT JOIN " + process.env.OPTIONS_IN_QUESTION + " ON " + process.env.QUESTIONS_IN_QUESTION_SET + ".question_id =" +
    process.env.OPTIONS_IN_QUESTION + ".question_id_fk WHERE " + process.env.QUESTION_SET_IN_SURVEY + ".survey_id_fk =($1)";
    return query;
}

exports.deneme = (survey_id) => {
    const surveysTable = process.env.SURVEYS_TABLE;
    const surveyMeasurementsTable = process.env.SURVEY_MEASUREMENTS;
    const questionSetInSurveyTable = process.env.QUESTION_SET_IN_SURVEY;

    let query = `
        SELECT 
            ${surveysTable}.*, 
            ${surveyMeasurementsTable}.*, 
            ${questionSetInSurveyTable}.* 
        FROM 
            ${surveysTable} 
        INNER JOIN 
            ${questionSetInSurveyTable} 
        ON 
            ${surveysTable}.survey_id = ${questionSetInSurveyTable}.survey_id_fk 
        INNER JOIN 
            ${surveyMeasurementsTable} 
        ON 
            ${questionSetInSurveyTable}.survey_id_fk = ${surveyMeasurementsTable}.survey_id_fk 
        WHERE 
            ${surveysTable}.survey_id = ?
    `;

    return { query, params: [survey_id] };
};


