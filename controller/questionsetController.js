const fs = require('fs');
const asyncHandler = require("express-async-handler");
const errorWrapper = require('../helper/error/errorWrapper');
const CustomError = require('../helper/error/customError');
const dbProvider = require('./db_provider');
const db = require('../database');

exports.getQuestionSets = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        await db.query(dbProvider.getQuestionSet())
            .then(result => {
                if (result.rowCount) {
                    res.json(result.rows)
                }
                else {
                    res.json('');
                }
            });
    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));



exports.getQuestionSetById = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const questionSetId = req.params.id;
        const values = [questionSetId];
        await db.query(dbProvider.getQuestionSetWithQuestion(), values)
            .then(result => {
                if (result.rowCount) {
                    const groupedQuestions = result.rows.reduce((acc, question) => {
                        const key = question.question_id;
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(question);
                        return acc;
                    }, {});
                    res.json(groupedQuestions);
                }
                else {
                    res.json('');
                }
            });
    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));


exports.createQuestionSet = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const { questionSetID, questionSetName, questionSetType } = req.body;
        const values = [questionSetID, questionSetName, questionSetType];
        const data = await db.query(dbProvider.createQuestionSet(), values);

        if (data.rowCount) {
            console.log(data.rows[0]);
            res.json(questionSetID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));

exports.createQuestionInQuestionSet = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const questionSetId = req.params.id;
        const { questionID, questionLine, questionType, questionText, score, key, options } = req.body;
        const valuesForQuestion = [questionID, questionLine, questionType, questionText, score, key, questionSetId];
        const questionResult = await db.query(dbProvider.createQuestionInQuestionSet(), valuesForQuestion);

        if (!questionResult.rowCount) {
            return next(new CustomError("Record cannot be added.", 304));
        }

        const optionValues = options.map(option => [
            option.optionId,
            option.optionText,
            option.optionIndex,
            questionID
        ]);

        await Promise.all(optionValues.map(valuesForOption =>
            db.query(dbProvider.createOptionInQuestion(), valuesForOption)
        ));

        res.json(questionSetId);
        
    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));


exports.updateQuestionSet = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const { questionSetID, questionSetName, questionSetType} = req.body;
        const values = [questionSetName, questionSetType, questionSetID];
     
        const data = await db.query(dbProvider.updateQuestionSet(), values);

        if (data.rowCount) {
            res.json(questionSetID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));


exports.updateQuestionInQuestionSet = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const questionSetId = req.params.id;
        const { questionID, questionLine, questionType, questionText, score, options } = req.body;
        const valuesForQuestion = [questionLine, questionType, questionText, score, questionID, questionSetId, questionID ];
        const dataForQuestion = await db.query(dbProvider.updateQuestionInQuestionSet(), valuesForQuestion);


        if (!dataForQuestion.rowCount) {
            return next(new CustomError("Record cannot be added.", 304));
        }

        const optionValues = options.map(option => [
            option.optionText,
            option.optionIndex,
            questionID,
            option.optionId
        ]);

        await Promise.all(optionValues.map(valuesForOption =>
            db.query(dbProvider.updateOptionInQuestion(), valuesForOption)
        ));

        res.json(questionSetId);


    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));

//---------------------------------------------------------------------------------------------------------------------------------------


// exports.updateQuestionSet = (async function (req, res) {

//     const { questionSetID, questionSetName, questionSetType, questions, options } = req.body;

//     const questionSet = {

//         "questionSet": {
//             "questionSetName": "",
//             "questionSetID": "",
//             "questionSetType": "",
//             "questions": [
//                 {
//                     "questionID": "",
//                     "questionLine": "",
//                     "questionType": "",
//                     "questionText": "",
//                     "score": "",
//                     "options": [
//                         {
//                             "optionText": "",
//                             "optionIndex": ""
//                         }
//                     ]
//                 }
//             ]
//         }
//     }
//     questionSet.questionSet.questionSetID = questionSetID;
//     questionSet.questionSet.questionSetName = questionSetName;
//     questionSet.questionSet.questionSetType = questionSetType;
//     questionSet.questionSet.questions = questions;
//     questionSet.questionSet.options = options;

//     fs.readFile(question_set_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//                 console.log(fileObj.questionSet);
//                 if (!fileObj.questionSet) {
//                     fileObj.questionSet = [];
//                 }
//             }
//         }
//         let index = fileObj.findIndex(x => x.questionSet.questionSetID === questionSetID);
//         if (index > -1) {
//             const updatedSurveys = [...fileObj];
//             updatedSurveys[index].questionSet.questionSetName = questionSetName;
//             updatedSurveys[index].questionSet.questionSetType = questionSetType;
//             updatedSurveys[index].questionSet.questions = questions;

//             let json = JSON.stringify(updatedSurveys);
//             fs.writeFile(question_set_path, json, 'utf8', err => {
//                 if (!err) {
//                     res.json(json);
//                 }
//             });


//         } else {
//             console.log("GÜNCELLENEMEDİ");
//         }

//     });
// });


// exports.updateQuestions =(async function (req, res) {
//     const { questionSetID, questionSetName, questionSetType, questions, options } = req.body;

//     const questionSet = {

//         "questionSet": {
//             "questionSetName": "",
//             "questionSetID": "",
//             "questionSetType": "",
//             "questions": [
//                 {
//                     "questionID": "",
//                     "questionLine": "",
//                     "questionType": "",
//                     "questionText": "",
//                     "score": "",
//                     "options": [
//                         {
//                             "optionText": "",
//                             "optionIndex": ""
//                         }
//                     ]
//                 }
//             ]
//         }
//     }
//     questionSet.questionSet.questionSetID = questionSetID;
//     questionSet.questionSet.questionSetName = questionSetName;
//     questionSet.questionSet.questionSetType = questionSetType;
//     questionSet.questionSet.questions = questions;
//     questionSet.questionSet.options = options;

//     fs.readFile(question_set_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//                 if (!fileObj.questionSet) {
//                     fileObj.questionSet = [];
//                 }
//             }
//         }
//         let index = fileObj.findIndex(x => x.questionSet.questionSetID === questionSetID);
//         if (index > -1) {
//             const updatedSurveys = [...fileObj];
//             updatedSurveys[index].questionSet.questionSetName = questionSetName;
//             updatedSurveys[index].questionSet.questionSetType = questionSetType;
//             let questionIndex = updatedSurveys[index].questionSet.questions.findIndex(x => x.questionID === questions[0].questionID);
//             if (questionIndex > -1) {
//                 updatedSurveys[index].questionSet.questions[questionIndex] = questions[0];
//                 let json = JSON.stringify(updatedSurveys);
//                 fs.writeFile(question_set_path, json, 'utf8', err => {
//                     if (!err) {
//                         res.json(json);
//                     }
//                 });
//             }
//             else {
//                 let json = JSON.stringify(updatedSurveys);
//                 fs.writeFile(question_set_path, json, 'utf8', err => {
//                     if (!err) {
//                         res.json(json);
//                     }
//                 });

//             }

//         } else {
//             console.log("GÜNCELLENEMEDİ");
//         }

//     });


// });


// exports.getQuestionSets = ((req, res, next) => {
//     fs.readFile(question_set_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//             }
//         }
//         let json = JSON.stringify(fileObj);
//         res.json(json);
//     });

// });


// exports.getQuestionSet = ((req, res) => {
//     fs.readFile(question_set_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//                 fileObj = fileObj.find(q => q.questionSet.questionSetID === req.params.id);
//             }
//         }

//         let json = JSON.stringify(fileObj);
//         res.json(json);
//     });

// });

// exports.createQuestionSet = (async function (req, res) {
//     const { questionSetID, questionSetName, questionSetType } = req.body;
//     const questionSet = { "questionSetName": "", "questionSetID": "", "questionSetType": "" };

//     questionSet.questionSetID = questionSetID;
//     questionSet.questionSetName = questionSetName;
//     questionSet.questionSetType = questionSetType;
//     fs.readFile(question_set_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//             }
//         }
//         fileObj.push({ questionSet });

//         let json = JSON.stringify(fileObj);
//         fs.writeFile(question_set_path, json, 'utf8', err => {
//             if (!err) {
//                 res.json(json);
//             } else {
//                 res.json("Kayıt oluşturulamadı.")
//             }
//         });
//     });

// });