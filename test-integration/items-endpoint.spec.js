'use strict';

const axios = require('axios');
const {itemsEndpoint} = require('config');
const {expect, assert} = require('chai');
const {del: deleteFromDynamo} = require('./utils/dynamo')();

const {OK, CREATED, NOT_FOUND} = require('http-status-codes');

describe('items http endpoint should', () => {
    const id = 'test-id';
    const notExistingId = 'I-do-not-exist';

    const item = {
        id,
        some: 'value',
    };

    before(async () => {
        await deleteFromDynamo([id, notExistingId]);
    });

    after(async () => {
        await deleteFromDynamo([id, notExistingId]);
    });

    it('create new item', () => {
        return axios.post(itemsEndpoint, item)
            .then(({status, data: {id}}) => {
                expect(status).to.equal(CREATED);
                expect(id).to.equal(id);
            });
    });

    it('get created item when calling by id', () => {
        return axios.get(`${itemsEndpoint}/${id}`)
            .then(({status, data}) => {
                expect(status).to.equal(OK);
                expect(data).to.deep.equal(item);
            });
    });

    it('return not found when calling for non existing id', () => {
        return axios.get(`${itemsEndpoint}/${notExistingId}`)
            .then(
                () => assert.fail('promise should be rejected'),
                err => expect(err.response.status).to.equal(NOT_FOUND)
            );
    });

    it('get item as list', () => {
        return axios.get(itemsEndpoint)
            .then(({status, data}) => {
                expect(status).to.equal(OK);
                expect(Array.isArray(data)).to.equal(true);
            });
    });
});


