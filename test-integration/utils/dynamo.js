'use strict';

const {DynamoDB} = require('aws-sdk');
const {dynamo} = require('config');

function createDynamoClient() {
    const docClient = new DynamoDB.DocumentClient(dynamo);

    async function del(ids) {
        await ids.map(async id =>
            docClient.delete(params(id)).promise()
        );
    }

    async function hasItem(id) {
        return docClient.get(params(id)).promise()
            .then(res => !!res);
    }

    function params(id) {
        return {
            TableName: dynamo.itemsTable,
            Key: {
                id,
            },
        };
    }
    return {
        del,
        hasItem,
    };
}

module.exports = createDynamoClient;

