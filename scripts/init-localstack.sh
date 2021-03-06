#!/bin/bash

sleep 5 # we should have better way, srlsy it is not 90s ;[]

LOCALSTACK_HOST="localstack"

# Dynamo helper variables
DYNAMO_PORT="4569"
DYNAMO_ENDPOINT="http://${LOCALSTACK_HOST}:${DYNAMO_PORT}"
DYNAMO_TABLE="items"

# SQS helper variables
SQS_PORT="4576"
SQS_ENDPOINT="http://${LOCALSTACK_HOST}:${SQS_PORT}"
SQS_QUEUE_NAME="items-queue"

cat <<EOF >> ~/.aws/config
[default]
output = json
region = eu-central-1
EOF

echo "Creating dynamodb article table ${DYNAMO_TABLE}"
aws --endpoint-url=${DYNAMO_ENDPOINT} dynamodb create-table --table-name ${DYNAMO_TABLE} \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1000,WriteCapacityUnits=1000

echo "Creating sqs queue ${SQS_QUEUE_NAME}"
aws --endpoint-url=${SQS_ENDPOINT} sqs create-queue --queue-name ${SQS_QUEUE_NAME}

echo "Local stack initalized"