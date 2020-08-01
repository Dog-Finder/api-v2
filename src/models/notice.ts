import {
  attribute,
} from '@aws/dynamodb-data-mapper-annotations';
import Marker from '@src/models/marker';
import Address from '@src/models/address';

export class DogNotice {
    @attribute()
    name?: string;

    @attribute()
    date?: Date;

    @attribute()
    sex?: string;

    @attribute()
    imageLinks?: string;

    @attribute()
    commentary?: string;

    @attribute()
    marker?: Marker

    @attribute()
    address?: Address
}

interface BodyData {
  name?: string;
  date?: string;
  sex?: string;
  commentary?: string;
  marker?: {longitude: number, latitude: number};
  address?: {
    name: string,
    country: string,
    city: string,
    street: string,
  };
  imageLinks?: string
}

export function createDogNotice(data: BodyData, type : string): DogNotice {
  const notice = Object.assign(new DogNotice(), {
    type,
    createdAt: new Date(),
    name: data.name,
    date: data.date,
    sex: data.sex,
    imageLinks: data.imageLinks,
    commentary: data.commentary,
    marker: Object.assign(new Marker(), data.marker),
    address: Object.assign(new Address(), data.address),
  });
  return notice;
}
