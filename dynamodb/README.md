# API Database Module

The database consists in [Dynamodb](https://aws.amazon.com/dynamodb/), a key-value
store service by AWS. The database is deployed via Serveless.

## Useful Commands

Create DB
```
sls deploy --stage [stage]
```

Drop DB (Do not delete table manually in console)
```
sls remove --stage [stage]
```

Seed DB
```
sls dynamodb seed --online --region us-east-1 --stage [stage]
```

Upload images to S3
```
aws s3 cp SOURCE_DIR s3://dog-finder-images/ --recursive
```
