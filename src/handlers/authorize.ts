import jwt from 'jsonwebtoken';
// import _ from 'lodash';

import { createErrorResponse } from '@src/handlers/utils';

// const authorizeUser = (userScopes, resourcePath) => {
//   const hasValidScope = _.some(userScopes, (scope) => _.startsWith(resourcePath, `/${scope}`));
//   return hasValidScope;
// };

const buildIAMPolicy = (userId, effect, resource, context) => {
  let path = resource;
  const arn = resource.split('/');
  if (arn.length > 4) {
    const base = arn.slice(0, -1);
    path = `${base.join('/')}/*`;
  }
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: path,
        },
      ],
    },
    context,
  };
  // console.log(JSON.stringify(policy))
  return policy;
};

export const authorize = async (event) => {
  const header = event.authorizationToken;
  try {
    const bearer = header.split(' ');
    const token = bearer[1];
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user } = decoded;
    // Checks if user scopes
    const isAllowed = true;
    // authorizeUser(
    //   user.scopes,
    //   event.requestContext.resourcePath,
    // );
    const effect = isAllowed ? 'Allow' : 'Deny';
    const userId = user.email;
    const authorizerContext = { user: JSON.stringify(user) };
    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(
      userId,
      effect,
      event.methodArn,
      authorizerContext,
    );
    return policyDocument;
  } catch (error) {
    return createErrorResponse(error);
  }
};
