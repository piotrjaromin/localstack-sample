'use strict';

const {CREATED, NOT_FOUND} = require('http-status-codes');

/**
 *
 * @param {Object} logger
 * @param {Object} app express application instance
 * @param {Object} dal storage for notes (in our case dynamodb client)
 * @param {function} dal.get function which takes one parameter and returns single note
 * @param {function} dal.getAll parameterless function which returns all parameters
 */
function initItemsEndpoints(logger, app, dal) {
    function getSingle(req, res, next) {
        const id = req.params.id;
        return dal.getSingle(id)
            .then(item => {
                if (!item) {
                    res.status(NOT_FOUND);
                    return res.json({message: `Item with id "${id}" not found`});
                }

                logger.info('Got item ', item);
                res.json(item);
            })
            .catch(next);
    }

    function getAll(req, res, next) {
        return dal.getAll(req.params.id)
            .then(items => {
                logger.info('Got items ', items);
                res.json(items);
            })
            .catch(next);
    }

    function save(req, res, next) {
        return dal.save(req.body)
            .then(id => {
                res.status(CREATED);
                res.json({id});
            })
            .catch(next);
    }

    logger.info('initializing items endpoints');
    app.get('/items/', getAll);
    app.get('/items/:id', getSingle);
    app.post('/items/', save);
}

module.exports = initItemsEndpoints;
