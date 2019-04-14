'use strict';

const {DynamoDB} = require('aws-sdk');
const app = require('express')();
const bodyParser = require('body-parser');

const docClient = new DynamoDB.DocumentClient({
    region: 'eu-central-1',
    endpoint: 'http://localstack:4569', // localstack address inside docker-compose!
});

app.use(bodyParser.json());
app.post('/', (req, res) => {
    save(req.body, (err) => {
        if ( err ) {
            console.error(err);
            res.status(500);
            return res.json({message: err.message});
        }

        return res.json({status: 'saved'});
    });
});

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));

function save(data, cb) {
    console.log('Saving item ');
    return docClient.put({
        TableName: 'items',
        Item: data,
    }, cb);
}
