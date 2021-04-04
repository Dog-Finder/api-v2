/* eslint-disable no-underscore-dangle */
import { APIGatewayProxyHandler } from 'aws-lambda';

import dynamodb from '@src/db_config';
import DogFinderObject from '@src/models/table';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';
import { searchKNN } from '@src/common/vectors';

export const search: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { imageLink, index } = requestBody;
    const response = await searchKNN(imageLink, index, 5);
    const { result: { hits } } = response.data;
    const toGet: DogFinderObject[] = hits.hits.map((hit) => Object.assign(new DogFinderObject(), {
      id: hit._source['user-id'],
      entry: hit._source['entry-id'],
    }));
    const items = await Promise.all(toGet.map((item) => dynamodb.get(item)));
    const notices = items.map((item, i) => {
      const { notice } = item;
      notice.score = hits.hits[i]._score;
      return notice;
    });

    return createOkResponse('list', notices);
  } catch (error) {
    return createErrorResponse(error);
  }
};
