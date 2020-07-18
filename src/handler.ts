import { APIGatewayProxyHandler } from 'aws-lambda';
import dynamodb from '@src/db_config';
import { MyDomainObject } from '@src/models/model';
import { DataMapper } from '@aws/dynamodb-data-mapper';

export const hello: APIGatewayProxyHandler = async (event) => {
  const mapper = new DataMapper({ client: dynamodb });
  const item = Object.assign(new MyDomainObject(), {
    createdAt: new Date(),
    name: 'Yoav',
    extra: 'asdf',
  });
  await mapper.put({ item });
  return ({
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello',
      item,
    }, null, 2),
  });
};
