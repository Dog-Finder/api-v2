interface returnType {
  statusCode: number,
  body: string,
}

export function createOkResponse(action: string, resource: any): returnType {
  return ({
    statusCode: 200,
    body: JSON.stringify({
      action,
      resource,
    }),
  });
}

export function createErrorResponse(error: any, statusCode = 500): returnType {
  return ({
    statusCode,
    body: JSON.stringify({
      error,
    }),
  });
}
