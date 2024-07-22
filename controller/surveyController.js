const fs = require('fs');
const asyncHandler = require("express-async-handler");
const errorWrapper = require('../helper/error/errorWrapper');
const CustomError = require('../helper/error/customError');
const dbProvider = require('./db_provider');
const db = require('../database');
const Service = require("@sap_oss/odata-library").Service;
const nodemailer = require('nodemailer');


let serviceCustomerIns;


exports.getIndividualCustomer = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        if (!serviceCustomerIns) {
            serviceCustomerIns = new Service(process.env.CUSTOMER_ODATA_URL);
        }
        const resultCustomers = [];
        if (serviceCustomerIns) {
            return serviceCustomerIns.init
                .then(() => {
                    return serviceCustomerIns.IndividualCustomerCollection.get();
                })
                .then((result) => {
                    result.forEach(element => {
                        if (element.CustomerID != "") {
                            let customer = { "customerID": element.CustomerID, "customerName": element.FormattedName, "customerEmail": element.Email };
                            resultCustomers.push(customer);
                        }
                    });
                    res.json(resultCustomers);
                })
                .catch((err) => {
                    return next(new CustomError(err, err.status));
                });
 
        }
    } catch (err) {
        return next(new CustomError(err, err.status));
    }
}));


exports.getSurveys = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        await db.query(dbProvider.getSurveys())
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


exports.getSurveyMeasurementBySurveyId = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const surveyId = req.params.id;
        await db.query(dbProvider.getSurveyMeasurementBySurveyId(surveyId))
                .then(result => {
                    if (result.rowCount) {
                        const rows = result.rows;                      
                        res.json(rows);
                    }
                    else {
                        res.json('');
                    }
                });
    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));

exports.getSurveyQuestionSetBySurveyId = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const surveyId = req.params.id;
        await db.query(dbProvider.getSurveyQuestionSetBySurveyId(surveyId))
                .then(result => {
                    if (result.rowCount) {
                        const rows = result.rows;                      
                        res.json(rows);
                    }
                    else {
                        res.json('');
                    }
                });
    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));



// exports.getQuestionSetWithQuestionsBySurveyId = errorWrapper(asyncHandler(async (req, res, next) => {
//     try {
//         const surveyId = req.params.id;
//         const values = [surveyId];
//         await db.query(dbProvider.getQuestionSetWithQuestionBySurveyId(), values)
//                 .then(result => {
//                     if (result.rowCount) {
//                         const rows = result.rows;
    
//                         const groupedByQuestionId = rows.reduce((acc, row) => {
//                             if (!acc.has(row.question_id)) {
//                                 acc.set(row.question_id, []);
//                             }
//                             acc.get(row.question_id).push(row);
//                             return acc;
//                         }, new Map());
                
//                         const groupedByQuestionIdObject = Object.fromEntries(groupedByQuestionId);
//                         res.json(groupedByQuestionIdObject);
//                     }
//                     else {
//                         res.json('');
//                     }
//                 });
//     } catch (err) {
//          return next(new CustomError(err, 400));
//     }
// }));




exports.getSurveyById = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const surveyId = req.params.id;
        const values = [surveyId];
        await db.query(dbProvider.getSurveyById(), values)
            .then(result => {
                if (result.rowCount) {
                    res.json(result.rows[0])
                }
                else {
                    res.json('');
                }
            });
    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));

// exports.getSurveyWithQuestionSet = errorWrapper(asyncHandler(async (req, res, next) => {
//     try {
//         const surveyId = req.params.id;
//         const values = [surveyId];

//         await db.query(dbProvider.getSurveyWithQuestionSet(), values)
//                 .then(async result => {
//                 if (result.rowCount) {
//                    res.json(result.rows)
//                 }
//         });

//     } catch (err) {
//          return next(new CustomError(err, 400));
//     }
// }));

exports.updateSurvey = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const { surveyID, surveyName, surveyValidityEnd, surveyValidityStart, surveyImageURL, surveyImageWidth, surveyImageHeight, surveyLogoPosition} = req.body;
        const values = [surveyName,surveyValidityStart, surveyValidityEnd, surveyImageURL, surveyImageWidth, surveyImageHeight, surveyLogoPosition, surveyID];
        const data = await db.query(dbProvider.updateSurvey(), values);

        if (data.rowCount) {
            res.json(surveyID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));



exports.createSurvey = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const { surveyID, surveyName, surveyValidityStart, surveyValidityEnd } = req.body;
        const values = [surveyID, surveyName, surveyValidityStart, surveyValidityEnd, null, null, null, null];

        const data = await db.query(dbProvider.createSurvey(), values);

        if (data.rowCount) {
            res.json(surveyID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
         return next(new CustomError(err, 400));
    }
}));

exports.createQuestionSetInSurvey = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const { surveyID, questionSet } = req.body;
        const values = [questionSet[0].questionSetID, surveyID, questionSet[0].rankingSurvey, questionSet[0].questionSetName, questionSet[0].questionSetType, questionSet[0].key];
        const data = await db.query(dbProvider.createQuestionSetInSurvey(), values);

        if (data.rowCount) {
            res.json(questionSet[0].questionSetID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));

exports.updateQuestionSetInSurvey = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const surveyID = req.params.id;
        const {previousQuestionSetId, rankingSurvey, questionSetID, questionSetName, questionSetType, key} = req.body;
        const values = [questionSetID, rankingSurvey, questionSetName, questionSetType, key, previousQuestionSetId, surveyID];
        const data = await db.query(dbProvider.updateQuestionSetInSurvey(), values);

        if (data.rowCount) {
            res.json(surveyID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
        console.log(err);
         return next(new CustomError(err, 400));
    }
}));

exports.deleteQuestionSetInSurvey = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const surveyID = req.query.surveyID;
        const questionSetID = req.query.questionSetID;
        const values = [questionSetID, surveyID];
        const data = await db.query(dbProvider.deleteQuestionSetInSurvey(), values);

        if (data.rowCount) {
            res.json(surveyID);
        } else {
            return next(new CustomError("Record cannot be added.", 304));
        }

    } catch (err) {
         console.log(err);
         return next(new CustomError(err, 400));
    }
}));


exports.scheduleMeasurements = errorWrapper(asyncHandler(async (req, res, next) => {
    try {
        const {customerInfo, questionSetIDs, surveyID} = req.body;


        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASSWORD 
            }
        });

        for (const customer of customerInfo) {
            const { customer_name, email, survey_link } = customer;

            const mailBody = `
                <p>Sayın ${customer_name},</p>
                <p>Anketimizi doldurursanız seviniriz.</p>
                <p><a href="${survey_link}">Anket için tıklayınız.</a></p>
            `;

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Anket',
                html: mailBody
            };

            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    throw new CustomError("E-posta gönderilemedi.", 500);
                } else {
                    console.log('E-posta gönderildi: ' + info.response);
                }
            });
        }

        res.status(200).json({ success: true, message: 'E-postalar gönderildi' });

    } 
    catch (err) {
         console.log(err);
         return next(new CustomError(err, 400));
    }
}));



//--------------------------------------------------------------------------------------------------------------------------------------

// exports.questionSetDelete = (async function (req, res) {
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         if (!err) {
//             let fileObj = JSON.parse(data);
//             const surveyID = req.query.surveyID;
//             const questionSetID = req.query.questionSetID;
//             const surveyIndex = fileObj.findIndex(survey => survey.surveys.surveyID === surveyID);
//             if (surveyIndex !== -1) {
//                 const updatedQuestionSets = fileObj[surveyIndex].surveys.questionSet.filter(item => item.questionSetID !== questionSetID);
//                 fileObj[surveyIndex].surveys.questionSet = updatedQuestionSets;
//                 fs.writeFile(surveys_path, JSON.stringify(fileObj), 'utf8', err => {
//                     if (!err) {
//                         res.json(updatedQuestionSets);
//                     } else {
//                         res.status(500).json({ error: "Dosyaya yazılamadı" });
//                     }
//                 });
//             }
//             else {
//                 console.log("Anket bulunamadı");
//                 res.status(404).json({ error: "Anket bulunamadı" });
//             }
//         } else {
//             console.error("Dosya okunamadı:", err);
//             res.status(500).json({ error: "Dosya okunamadı" });
//         }
//     });
// });


// exports.addQuestionSet = (async function (req, res) {
//     const { surveyID, questionSet } = req.body;

//     console.log(questionSet[0].rankingSurvey);
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];

//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//                 if (!fileObj.surveys) {
//                     fileObj.surveys = [];
//                 }
//             }
//         }
//         let index = fileObj.findIndex(x => x.surveys.surveyID === surveyID);
//         if (index > -1) {

//             const allSurveys = [...fileObj];
//             allSurveys[index].surveys.questionSet = questionSet;

//             let json = JSON.stringify(allSurveys);
//             fs.writeFile(surveys_path, json, 'utf8', err => {
//                 if (!err) {
//                     res.json(json);
//                 } else {
//                     res.json("Dosyaya yazılamadı");
//                 }
//             });
//         } else {
//             console.log("GÜNCELLENEMEDİ");
//         }

//     });


// });


// exports.updateQSInSurvey = (async function (req, res) {
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         if (!err) {
//             let fileObj = JSON.parse(data);
//             const id = req.params.id;
//             const questionSet = req.body;
//             console.log(questionSet);

//             const surveyIndex = fileObj.findIndex(survey => survey.surveys.surveyID === id);

//             if (surveyIndex !== -1) {
//                 console.log(surveyIndex);
//                 const questionSetIndex = fileObj[surveyIndex].surveys.questionSet.findIndex(item => item.questionSetID === questionSet.key);
//                 if (questionSetIndex !== -1) {
//                     console.log(questionSetIndex);
//                     questionSet.key = questionSet.questionSetID;
//                     fileObj[surveyIndex].surveys.questionSet[questionSetIndex] = questionSet;
//                     fs.writeFile(surveys_path, JSON.stringify(fileObj), 'utf8', err => {
//                         if (!err) {
//                             res.json(fileObj);
//                         } else {
//                             res.status(500).json({ error: "Dosyaya yazılamadı" });
//                         }
//                     });
//                 }
//             }
//             else {
//                 console.log("Anket bulunamadı");
//                 res.status(404).json({ error: "Anket bulunamadı" });
//             }
//         } else {
//             console.error("Dosya okunamadı:", err);
//             res.status(500).json({ error: "Dosya okunamadı" });
//         }
//     });
// });


// exports.updateSurvey = (async function (req, res) {

//     const { surveyID, surveyName, surveyValidityStart, surveyValidityEnd, key, surveyImageURL, surveyImageWidth, surveyImageHeight, surveyLogoPosition, questionSet} = req.body;
    
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         if (!err) {
//             let fileObj = JSON.parse(data);
//             const id = req.params.id;

//             const surveyIndex = fileObj.findIndex(survey => survey.surveys.surveyID === id);

//             if (surveyIndex !== -1) {
//                 const updatedSurvey = [...fileObj];
//                 updatedSurvey[surveyIndex].surveys.surveyName = surveyName;
//                 updatedSurvey[surveyIndex].surveys.surveyValidityStart = surveyValidityStart;
//                 updatedSurvey[surveyIndex].surveys.surveyValidityEnd = surveyValidityEnd;
//                 updatedSurvey[surveyIndex].surveys.surveyImageURL = surveyImageURL;
//                 updatedSurvey[surveyIndex].surveys.surveyImageHeight = surveyImageHeight;
//                 updatedSurvey[surveyIndex].surveys.surveyImageWidth = surveyImageWidth;
//                 updatedSurvey[surveyIndex].surveys.surveyLogoPosition = surveyLogoPosition;
//                 updatedSurvey[surveyIndex].surveys.questionSet = questionSet;

//                 fs.writeFile(surveys_path, JSON.stringify(fileObj), 'utf8', err => {
//                     if (!err) {
//                         res.json(fileObj);
//                     } else {
//                         res.status(500).json({ error: "Dosyaya yazılamadı" });
//                     }
//                 });
//             }
//             else {
//                 console.log("Anket bulunamadı");
//                 res.status(404).json({ error: "Anket bulunamadı" });
//             }
//         } else {
//             console.error("Dosya okunamadı:", err);
//             res.status(500).json({ error: "Dosya okunamadı" });
//         }
//     });   
// });


// exports.getSurveys = ((req, res) => {

//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
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

// exports.createSurvey = (async function (req, res) {
//     const { surveyID, surveyName, surveyValidityStart, surveyValidityEnd } = req.body;
//     const surveys = { "surveyID": "", "surveyName": "", "surveyValidityStart": "", "surveyValidityEnd": "" };

//     surveys.surveyID = surveyID;
//     surveys.surveyName = surveyName;
//     surveys.surveyValidityStart = surveyValidityStart;
//     surveys.surveyValidityEnd = surveyValidityEnd;
//     // surveys.questionSet = [];
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//             }
//         }
//         fileObj.push({ surveys });
//         let json = JSON.stringify(fileObj);
//         console.log(json);
//         fs.writeFile(surveys_path, json, 'utf8', err => {
//             if (!err) {
//                 res.json(json);
//             } else {
//                 res.json("Kayıt oluşturulamadı.")
//             }
//         });
//     });
// });


// exports.getSurvey = ((req, res) => {
//     fs.readFile(surveys_path, 'utf8', function readFileCallBack(err, data) {
//         let fileObj = [];
//         if (!err) {
//             if (data.length == 0) {
//                 data = JSON.stringify(fileObj);
//             }
//             else {
//                 fileObj = JSON.parse(data);
//                 fileObj = fileObj.find(s => s.surveys.surveyID === req.params.id);
//             }
//         }

//         let json = JSON.stringify(fileObj);
//         res.json(json);
//     });

// });




