import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { v1 as uuid } from 'uuid';
import { createErrorResponse } from '@src/handlers/utils';

const s3 = new S3({ signatureVersion: 'v4' });

export const upload: APIGatewayProxyHandler = async () => {
  try {
    const Key = `${uuid()}.jpg`;
    const url = s3.getSignedUrl('putObject', {
      Bucket: 'dog-finder-images',
      Key,
      Expires: 10,
    });
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify({
        url,
        imageLink: `https://dog-finder-images.s3.amazonaws.com/${Key}`,
      }),
    });
  } catch (error) {
    return createErrorResponse(error);
  }
};
