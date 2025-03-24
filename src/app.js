const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const app = express();


//init middleware
app.use(morgan('dev')); // combined | common | tiny | dev | short
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//init db
require('./dbs/init.mongodb');
/* const {checkOverload} = require('./helpers/check.connect');
checkOverload(); */

//init routes
app.use('/', require('./routes'));

//handling errors

module.exports = app;