import { APIGatewayProxyHandler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import dynamodb from '@src/db_config';
import User from '@src/models/user';
import DogFinderObject from '@src/models/table';
import { createOkResponse, createErrorResponse } from '@src/handlers/utils';

const JWT_EXPIRATION_TIME = '100m';

export const create: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const user = Object.assign(new User(), {
      ...requestBody,
    });
    user.password = await bcrypt.hash(user.password, 10);
    const item = Object.assign(new DogFinderObject(), {
      id: `user#${requestBody.email}`,
      entry: 'metadata',
      type: 'user',
      user,
    });
    await dynamodb.put({ item });
    return createOkResponse('create', item);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const detail: APIGatewayProxyHandler = async (event) => {
  try {
    const { email } = event.pathParameters;
    const item = new DogFinderObject();
    item.id = `user#${email}`;
    item.entry = 'metadata';
    const fetched = await dynamodb.get({ item });
    return createOkResponse('detail', fetched);
  } catch (error) {
    return createErrorResponse(error);
  }
};
export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { email, password } = requestBody;
    const item = new DogFinderObject();
    item.id = `user#${email}`;
    item.entry = 'metadata';
    const fetched = await dynamodb.get(item);
    const { user } = fetched;
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return createErrorResponse('Wrong Password');
    }
    const token = jwt.sign(
      { user: _.omit(user, 'password') },
      process.env.JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION_TIME,
      },
    );
    return createOkResponse('create', token);
  } catch (error) {
    return createErrorResponse(error);
  }
};
