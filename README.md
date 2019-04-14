# localstack-sample

Nodejs project with localstack integration tests. It uses dynamoDB and SQS, docker compose allows for running integration tests in complete isolation from real AWS services.

1. Application exposes few endpoints:
    - GET `http://lcoalhost:3000/items/{id}` returns single item with given `id`
    - GET `http://lcoalhost:3000/items` returns all saved items from dynamodb
    - POST `http://lcoalhost:3000/items` will save json payload sent to this endpoint into dynamodb
2. Application also listens on SQS events, when new event is received it is saved into dynamodb

Implementation of integration tests can be found in `test-integration` directory

## How to run

docker, nodejs, npm must be installed

```bash
docker-compose build
docker-compose up
```

wait for everything to be set up and in separate terminal type:

```bash
npm run test:integration
```

You can check initialized services by going to http://localhost:8080 this will expose localstack console which should show sqs and dynamodb resources.

## Micro sample

In `micro-sample` directory you can find minimalistic example of how to use localstack, node and dynamodb.  It exposes single endpoint to which you can post json and it will be saved into dynamodb then you can read from that endpoint using aws-cli (or you can add get endpoint yourself)

To run it:

```bash
docker-compose build
docker-compose up
```

Then you can use it:

```bash
curl -X POST http://localhost:3000 -H "Content-type: application/json" -d '{"id": "test-id"}'
aws dynamodb scan --table-name items --endpoint-url http://localhost:4569  --output json
```