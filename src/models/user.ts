import {
  attribute,
} from '@aws/dynamodb-data-mapper-annotations';

export default class User {
    @attribute()
    name?: string;

    @attribute()
    email?: string;

    @attribute()
    password?: string;

    @attribute()
    image?: string;
}
