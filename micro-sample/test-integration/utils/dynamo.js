'use strict';

const {DynamoDB} = require('aws-sdk');

function createDynamoClient() {
    const docClient = new DynamoDB.DocumentClient({
        region: 'eu-central-1',
        endpoint: 'http://localhost:4569', // !! tests are hitting localhost, not localstack!
    });

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
            TableName: 'items',
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

