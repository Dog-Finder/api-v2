import { APIGatewayProxyHandler } from 'aws-lambda';
import { greaterThan, beginsWith } from '@aws/dynamodb-expressions';
import { v1 as uuid } from 'uuid';

import dynamodb from '@src/db_config';
import DogFinderObject from '@src/models/table';
import { createDogNotice, DogNotice } from '@src/models/notice';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';

export const create: APIGatewayProxyHandler = async (event) => {
  try {
    const email = event.requestContext.authorizer.principalId;
    const requestBody = JSON.parse(event.body);
    const notice: DogNotice = createDogNotice(requestBody);
    const noticeId = uuid();
    notice.id = noticeId;
    const item = Object.assign(new DogFinderObject(), {
      id: `user#${email}`,
      entry: `found#${noticeId}`,
      type: 'found',
      createdAt: new Date(),
      notice,
    });
    await dynamodb.put(item);
    return createOkResponse('create', item);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const del: APIGatewayProxyHandler = async (event) => {
  try {
    const email = event.requestContext.authorizer.principalId;
    const noticeId = event.pathParameters.id;
    const item = Object.assign(new DogFinderObject(), {
      id: `user#${email}`,
      entry: `found#${noticeId}`,
    });
    const fetched = await dynamodb.get(item);
    await dynamodb.delete({ item: fetched });
    return createOkResponse('delete', {});
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const edit: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const email = event.requestContext.authorizer.principalId;
    const noticeId = event.pathParameters.id;
    const item = Object.assign(new DogFinderObject(), {
      id: `user#${email}`,
      entry: `found#${noticeId}`,
    });
    const fetched = await dynamodb.get(item);
    const { notice } = fetched;
    const newNotice = Object.assign(notice, requestBody);
    fetched.notice = newNotice;
    await dynamodb.put(fetched);
    return createOkResponse('edit', fetched);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const detail: APIGatewayProxyHandler = async (event) => {
  try {
    const email = event.requestContext.authorizer.principalId;
    const noticeId = event.pathParameters.id;
    const item = Object.assign(new DogFinderObject(), {
      id: `user#${email}`,
      entry: `found#${noticeId}`,
    });
    const fetched = await dynamodb.get(item);
    return createOkResponse('detail', fetched);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const list: APIGatewayProxyHandler = async () => {
  try {
    const iterator = dynamodb.query(
      DogFinderObject,
      { type: 'found', createdAt: greaterThan('0000') },
      { indexName: 'type-createdAt-index' },
    );
    const items = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of iterator) {
      items.push(item.notice);
    }
    return createOkResponse('list', items);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const userList: APIGatewayProxyHandler = async (event) => {
  const email = event.requestContext.authorizer.principalId;
  try {
    const iterator = dynamodb.query(
      DogFinderObject,
      {
        id: `user#${email}`,
        entry: beginsWith('found'),
      },
    );
    const items = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of iterator) {
      items.push(item.notice);
    }
    return createOkResponse('list', items);
  } catch (error) {
    return createErrorResponse(error);
  }
};
