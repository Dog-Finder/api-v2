import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { DogNotice } from '@src/models/notice';
import User from '@src/models/user';

const { DB_NAME } = process.env;

@table(DB_NAME)
export default class DogFinderObject {
    @hashKey()
    id: string;

    @rangeKey() // Type + entry id
    entry: string;

    @attribute()
    createdAt: string;

    @attribute() // Type of entry (user, lost, found)
    type?: string;

    @attribute()
    date?: Date;

    @attribute()
    notice?: DogNotice

    @attribute()
    user?: User
}
