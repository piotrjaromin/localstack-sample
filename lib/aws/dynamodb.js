'use strict';

const {DynamoDB} = require('aws-sdk');

/**
 * Client for data access layer for dynamo db
 * @typedef {Object} DynamoDal
 * @property {function} save saves first argument to dynamodb, if argument does not have id then it generates new one
 * @property {function} getSingle returns single item with given id or null
 * @property {function} getAll returns all items from db
 */

/**
 *
 * @param {object} logger
 * @param {object} config configuration for sqs client
 * @return {DynamoDal}
 */
function createDynamoDal(logger, config) {
    logger.info('Creating dynamodb module for config');
    const docClient = new DynamoDB.DocumentClient(config);

    function save(data) {
        // yeah, not best place for validation
        if ( !data ) {
            return Promise.reject(new Error('Unable to save item which does not have payload'));
        }

        if ( !data.id ) {
            const id = `${Math.floor(Math.random() * 10000000)}`;
            logger.warn(`Missing id field, generated new one: ${id}`);
            data.id = id;
        }

        const params = {
            TableName: config.itemsTable,
            Item: data,
        };

        logger.info(`Saving item with id: ${data.id} to dynamo`);
        return docClient.put(params).promise()
            .then(() => data.id);
    }

    function getSingle(id) {
        logger.info(`Getting item with id: ${id} from dynamo`);
        const params = {
            TableName: config.itemsTable,
            Key: {
                id,
            },
        };

        return docClient.get(params).promise().
            then(({Item}) => Item );
    }

    function getAll() {
        // kind of lie because we would need to implement pagination
        // for scan method, but for simple example it is alright
        logger.info(`Getting all items from dynamo`);
        const params = {
            TableName: config.itemsTable,
        };

        return docClient.scan(params).promise()
            .then(({Items}) => Items);
    }

    return {
        save,
        getSingle,
        getAll,
    };
}

module.exports = createDynamoDal;
