import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export default class Marker {
  @attribute()
  latitude: number

  @attribute()
  longitude: number
}
