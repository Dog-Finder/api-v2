import AWS from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import bluebird from 'bluebird';
import { DataMapper } from '@aws/dynamodb-data-mapper';

const { IS_OFFLINE } = process.env;

AWS.config.setPromisesDependency(bluebird);

let client;
if (IS_OFFLINE === 'true') {
  const { CONFIG_DYNAMODB_ENDPOINT } = process.env;
  client = new DynamoDB({
    region: 'localhost',
    endpoint: CONFIG_DYNAMODB_ENDPOINT,
  });
} else {
  client = new DynamoDB();
}
const mapper = new DataMapper({ client });
export default mapper;
