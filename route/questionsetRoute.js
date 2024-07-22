var express = require('express');
var questionSetController = require('../controller/questionsetController');

var router = express.Router({ mergeParams: true });

router.get('/question_set', questionSetController.getQuestionSets); 
router.get('/question_set/:id', questionSetController.getQuestionSetById); 
router.put('/question_set/:id', questionSetController.updateQuestionSet); 
router.post('/question_set/:id', questionSetController.createQuestionInQuestionSet); 
router.post('/question_set', questionSetController.createQuestionSet);
router.put('/updateQuestion_set/:id', questionSetController.updateQuestionInQuestionSet); 




module.exports = router;