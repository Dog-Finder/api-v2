# Dog Finder API
API for the mobile application. Consists in lambda functions in AWS servers, with
a DynamoDB as the database layer.

## Launch Local Server
First lauch the endpoints locally with `serverless-offline`:
```
sls offline
```
Then start in another terminal session the local dynamodb service:
```
cd dynamodb
sls dynamodb start 
```