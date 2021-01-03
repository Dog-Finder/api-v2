/* eslint-disable no-underscore-dangle */
import { APIGatewayProxyHandler } from 'aws-lambda';

import dynamodb from '@src/db_config';
import DogFinderObject from '@src/models/table';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';
import { searchKNN } from '@src/common/vectors';

export const search: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { entryId, imageLink } = requestBody;
    const response = await searchKNN(imageLink, entryId);
    const { result: { hits } } = response.data;
    const toGet = hits.hits.map((hit) => Object.assign(new DogFinderObject(), {
      id: hit._source['user-id'],
      entry: hit._source['entry-id'],
    }));
    const items = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of dynamodb.batchGet(toGet)) {
      items.push(item.notice);
    }
    return createOkResponse('list', items);
  } catch (error) {
    return createErrorResponse(error);
  }
};
