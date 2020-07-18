import AWS from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import bluebird from 'bluebird';

const { IS_OFFLINE } = process.env;

AWS.config.setPromisesDependency(bluebird);

let db;
if (IS_OFFLINE === 'true') {
  const { CONFIG_DYNAMODB_ENDPOINT } = process.env;
  db = new DynamoDB({
    region: 'localhost',
    endpoint: CONFIG_DYNAMODB_ENDPOINT,
  });
} else {
  db = new DynamoDB();
}
const dynamodb = db;
export default dynamodb;
