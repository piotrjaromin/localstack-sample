'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {dynamo, sqs} = require('config');

const logger = require('simple-node-logger').createSimpleLogger();
const {INTERNAL_SERVER_ERROR} = require('http-status-codes');

const initItemsEndpoints = require('./lib/items-endpoints');
const sqsEventHandler = require('./lib/aws/sqs-event-handler');
const createDynamo = require('./lib/aws/dynamodb');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

const dal = createDynamo(logger, dynamo);

// start sqs event processing
sqsEventHandler(logger, sqs, dal).start();

// initialize http endpoints
initItemsEndpoints(logger, app, dal);

// error handling function must be last
app.use(function errorHandler(err, req, res, next) {
    logger.error('Internal server error ', err);
    res.status(INTERNAL_SERVER_ERROR);
    res.json({error: err.message});
});

app.listen(port, () => logger.info(`App started and listening on port ${port}!`));
