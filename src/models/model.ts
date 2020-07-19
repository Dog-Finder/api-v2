import {
  attribute,
  autoGeneratedHashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

const { DB_NAME } = process.env;

@table(DB_NAME)
export class MyDomainObject {
  @autoGeneratedHashKey()
  id: string;

  @rangeKey()
  createdAt: Date;

  @attribute()
  name: string;

  @attribute()
  completed?: boolean;
}
