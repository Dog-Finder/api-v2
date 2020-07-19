import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export default class Address {
  @attribute()
  name: string

  @attribute()
  country: string

  @attribute()
  region: string

  @attribute()
  city: string

  @attribute()
  street: string
}
