const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const app = express();

//init middleware
app.use(morgan('dev')); // combined | common | tiny | dev | short
app.use(helmet());
app.use(compression());

//init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
checkOverload();

//init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Hello World'
    });
});

//handling errors

module.exports = app;