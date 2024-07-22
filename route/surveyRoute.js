var express = require('express');
var surveyController = require('../controller/surveyController');

var router = express.Router({ mergeParams: true });

router.get('/surveys', surveyController.getSurveys); 
// router.get('/surveys/:id', surveyController.getSurveyWithQuestionSet);
 router.get('/surveys/questionSet/:id', surveyController.getSurveyQuestionSetBySurveyId);
router.get('/surveys/:id', surveyController.getSurveyById); 
router.get('/surveys/measurement/:id', surveyController.getSurveyMeasurementBySurveyId);
router.get('/survey_management', surveyController.getIndividualCustomer);
// router.get('/form-survey/:id', surveyController.getQuestionSetWithQuestionsBySurveyId);
router.post('/surveys/questionSetDelete', surveyController.deleteQuestionSetInSurvey); 
router.post('/surveys/:id', surveyController.createQuestionSetInSurvey); 
router.post('/surveys', surveyController.createSurvey); 
router.post('/updateQS/:id', surveyController.updateQuestionSetInSurvey);
router.post('/schedule-measurements', surveyController.scheduleMeasurements);
router.put('/updateSurvey/:id', surveyController.updateSurvey);





module.exports = router;