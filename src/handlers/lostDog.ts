import { APIGatewayProxyHandler } from 'aws-lambda';
import mapper from '@src/db_config';
import { createDogNotice, DogNotice } from '@src/models/dog-notice';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';

export const create: APIGatewayProxyHandler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const notice: DogNotice = createDogNotice(requestBody, 'found');
  try {
    await mapper.put({ item: notice });
  } catch (error) {
    return createErrorResponse(error);
  }
  return createOkResponse('create', notice);
};
