'use strict';

const AWS = require('aws-sdk');
const {sqs} = require('config');

const {SQS} = AWS;
AWS.config.setPromisesDependency(require('bluebird'));

function createSqsClient() {
    const sqsClient = new SQS(sqs.initParams);

    function sendMessage(msg) {
        return sqsClient.sendMessage({
            ...sqs.sendParams,
            MessageBody: JSON.stringify(msg),
        })
            .promise()
            .catch(handleError);
    }

    function countAvailableMessage() {
        return sqsClient.getQueueAttributes({
            QueueUrl: sqs.sendParams.QueueUrl,
            AttributeNames: ['ApproximateNumberOfMessages'],
        })
            .promise()
            .then(resp => parseInt(resp.Attributes.ApproximateNumberOfMessages, 10))
            .catch(handleError);
    }

    function handleError(err) {
        // eslint-disable-next-line no-console
        console.error('Could send message to sqs', err);
        return Promise.reject(err);
    }

    return {
        sendMessage,
        countAvailableMessage,
    };
}

module.exports = createSqsClient;
