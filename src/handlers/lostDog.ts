import { APIGatewayProxyHandler } from 'aws-lambda';
import { greaterThan } from '@aws/dynamodb-expressions';
import mapper from '@src/db_config';
import { createDogNotice, DogNotice } from '@src/models/dog-notice';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';

export const create: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const notice: DogNotice = createDogNotice(requestBody, 'lost');
    await mapper.put({ item: notice });
    return createOkResponse('create', notice);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const del: APIGatewayProxyHandler = async (event) => {
  try {
    const toFetch = new DogNotice();
    toFetch.id = event.pathParameters.id;
    toFetch.type = 'lost';
    const fetched = await mapper.get({ item: toFetch });
    await mapper.delete({ item: fetched });
    return createOkResponse('delete', {});
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const edit: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const toFetch = new DogNotice();
    toFetch.id = event.pathParameters.id;
    toFetch.type = 'lost';
    const fetched = await mapper.get({ item: toFetch });
    const newNotice = Object.assign(fetched, requestBody);
    newNotice.id = toFetch.id; // Keep old id
    await mapper.put({ item: newNotice });
    return createOkResponse('edit', newNotice);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const detail: APIGatewayProxyHandler = async (event) => {
  try {
    const toFetch = new DogNotice();
    toFetch.id = event.pathParameters.id;
    toFetch.type = 'lost';
    const fetched = await mapper.get({ item: toFetch });
    return createOkResponse('detail', fetched);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const list: APIGatewayProxyHandler = async (event) => {
  try {
    const iterator = mapper.query(
      DogNotice,
      { type: 'lost', createdAt: greaterThan(0) },
      { indexName: 'type-createdAt-index' },
    );
    const items = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of iterator) {
      items.push(item);
    }
    return createOkResponse('list', items);
  } catch (error) {
    return createErrorResponse(error);
  }
};
