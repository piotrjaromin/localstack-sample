# localstack-sample

Nodejs project with localstack integration tests. It uses dynamoDB and SQS, docker compose allows for running integration tests in complete isolation from real AWS services.

1. Application exposes few endpoints:
    - GET `http://localhost:3000/items/{id}` returns single item with given `id`
    - GET `http://localhost:3000/items` returns all saved items from dynamodb
    - POST `http://localhost:3000/items` will save json payload sent to this endpoint into dynamodb
2. Application also listens on SQS events, when new event is received it is saved into dynamodb

Implementation of integration tests can be found in `test-integration` directory

To save data in dynamo db just call following bash:

```bash
curl -X POST http://localhost:3000/items -H "Content-type: application/json" -d '{"id": "test-id"}'
```

docker-compose starts 3 containers:

- service container which saves data to dynamodb from http endpoint and from sqs
- localstack container with dynamodb and sqs running
- aws setup container which creates dynamodb and sqs in localstack during startup

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
