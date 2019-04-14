#!/bin/bash

sleep 5 # we should have better way, srlsy it is not 90s ;[]

# Dynamo helper variables
DYNAMO_ENDPOINT="http://localstack:4569"
DYNAMO_TABLE="items"

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

echo "Local stack initalized"