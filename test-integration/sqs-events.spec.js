'use strict';

const {expect} = require('chai');
const {del: deleteFromDynamo, hasItem} = require('./utils/dynamo')();
const {sendMessage, countAvailableMessage} = require('./utils/sqs')();
const {retry} = require('./utils/promise-retry');

describe('for items sqs queue', () => {
    const id = 'test-id-sqs';

    const item = {
        id,
        some: 'value',
    };

    before(async () => {
        await deleteFromDynamo([id]);
    });

    after(async () => {
        await deleteFromDynamo([id]);
    });

    it('should create item', () =>
        sendMessage(item)
            .then(() => expectArticleInDynamo(id))
            .then(() => expectEmptySqs())
    );

    function expectArticleInDynamo(expectedId) {
        return retry(() =>
            hasItem(expectedId)
                .then(exists => expect(exists).to.equal(true))
        );
    }

    function expectEmptySqs() {
        return retry(() =>
            countAvailableMessage()
                .then(msgCount => expect(msgCount).to.equal(0))
        );
    }
});
