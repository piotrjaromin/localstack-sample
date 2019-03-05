'use strict';

const Promise = require('bluebird');

const {SQS, config} = require('aws-sdk');
config.setPromisesDependency(Promise);

/**
 * Client for constantly polling sqs
 * @typedef {Object} SqsClient
 * @property {function} start starts items polling from sqs
 */

/**
 *
 * @param {object} logger
 * @param {object} config configuration for sqs client
 * @param {Object} dal storage for items
 * @param {Object} dal.save function which saves item
 * @return {SqsClient}
 */
function createSqsEventHandler(logger, config, dal) {
    const sqsClient = new SQS(config.initParams);

    async function start() {
        while (true) {
            await receiveMsg();
        }
    }

    async function receiveMsg() {
        return sqsClient.receiveMessage(config.receiveParams).promise()
            .then(data => data.Messages || [])
            .map(handleMessage)
            .catch(err => logger.error(`Could not receive message from sqs queue. Reason: ${err}`));
    }

    function handleMessage(msg) {
        logger.info('received messages', msg);
        const item = JSON.parse(msg.Body);
        return dal.save(item)
            .then(() => deleteMessage(msg.ReceiptHandle));
    }
    function deleteMessage(receiptHandle) {
        return sqsClient.deleteMessage({
            ReceiptHandle: receiptHandle,
            QueueUrl: config.receiveParams.QueueUrl,
        })
            .promise()
            .catch(err => logger.error(`Could not delete message from sqs queue. Reason: ${err}`));
    }

    return {
        start,
    };
}

module.exports = createSqsEventHandler;
