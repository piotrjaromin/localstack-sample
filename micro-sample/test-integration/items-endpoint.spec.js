'use strict';

const axios = require('axios');
const {expect} = require('chai');
const {hasItem, del: deleteFromDynamo} = require('./utils/dynamo')();

describe('items http endpoint should', () => {
    const id = 'test-id';

    const item = {
        id,
        some: 'value',
    };

    beforeEach(async () => {
        await deleteFromDynamo([id]);
    });

    afterEach(async () => {
        await deleteFromDynamo([id]);
    });

    it('create new item', async () => {
        const {status} = await axios.post('http://localhost:3000', item);

        expect(status).to.equal(200);
        expect(await hasItem(id)).to.equal(true);
    });
});


