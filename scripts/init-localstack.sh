#!/bin/bash

sleep 5 # we should have better way

LOCALSTACK_HOST="localstack"

# Dynamo helper variables
DYNAMO_PORT="4569"
DYNAMO_ENDPOINT="http://${LOCALSTACK_HOST}:${DYNAMO_PORT}"
DYNAMO_TABLE="items"

# SQS helper variables
SQS_PORT="4576"
SQS_ENDPOINT="http://${LOCALSTACK_HOST}:${SQS_PORT}"
SQS_QUEUE_NAME="items-queue"

# Prepare dummy aws config, so aws cli will not return "aws configure error"
cat <<EOF >> ~/.aws/config
[default]
output = json
region = eu-central-1
EOF

cat <<EOF >> ~/.aws/credentials
[default]
aws_access_key_id = dummy-val
aws_secret_access_key = dummy-val
EOF

echo "Creating dynamodb article table ${DYNAMO_TABLE}"
aws --endpoint-url=${DYNAMO_ENDPOINT} dynamodb create-table --table-name ${DYNAMO_TABLE} \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1000,WriteCapacityUnits=1000

echo "Creating sqs queue ${SQS_QUEUE_NAME}"
aws --endpoint-url=${SQS_ENDPOINT} sqs create-queue --queue-name ${SQS_QUEUE_NAME}

echo "Local stack initalized"