const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require("cors");
const errorHandler = require('./middleware/erros/errorHandler');
const app = express();


const PORT = 9000;

if (process.env.NODE_ENV === "prod") {
    require("dotenv").config({ path: 'environment/prod.env' });
}
else {
    require("dotenv").config({ path: 'environment/dev.env' });
}

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));

var surveyRoute = require('./route/surveyRoute');
var questionSetRoute = require('./route/questionsetRoute');


app.use('/', surveyRoute);
app.use('/', questionSetRoute);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});



