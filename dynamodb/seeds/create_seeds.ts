// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';
import bcrypt from 'bcryptjs';
import { v1 as uuid } from 'uuid';
import fs from 'fs';
import DogFinderObject from '@src/models/table';
import User from '@src/models/user';
import { DogNotice } from '@src/models/notice';

function createUsers(n: number): Array<DogFinderObject> {
  const users = [];

  const tester: DogFinderObject = {
    id: 'user#tester@gmail.com',
    entry: 'metadata',
    type: 'user',
    createdAt: (new Date()).toISOString(),
    user: {
      name: 'Tester',
      email: 'tester@gmail.com',
      password: bcrypt.hashSync('1234', 10),
    },
  };
  users.push(tester);

  for (let i = 0; i < n; i += 1) {
    const user: User = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '1234',
    };
    const entry: DogFinderObject = {
      id: `user#${user.email}`,
      entry: 'metadata',
      type: 'user',
      createdAt: (new Date()).toISOString(),
      user,
    };
    users.push(entry);
  }
  return users;
}

function createLostDogs(n: number, user: User): Array<DogFinderObject> {
  const lostDogs = [];
  for (let i = 0; i < n; i += 1) {
    const id = uuid();
    const notice: DogNotice = {
      id,
      name: faker.name.firstName(),
      date: new Date(),
      sex: 'Macho',
      imageLinks: 'https://dog-finder-images.s3.amazonaws.com/17443cb0-46f2-11eb-b6db-d59ec2a52aec.jpg',
      commentary: faker.lorem.sentence(10),
      marker: {
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude()),
      },
      address: {
        name: '',
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.state(),
        country: faker.address.country(),
      },
    };
    const entry: DogFinderObject = {
      id: `user#${user.email}`,
      entry: `lost#${id}`,
      type: 'lost',
      createdAt: (new Date()).toISOString(),
      notice,
    };
    lostDogs.push(entry);
  }
  return lostDogs;
}

function createFoundDogs(n: number, user: User): Array<DogFinderObject> {
  const foundDogs = [];
  for (let i = 0; i < n; i += 1) {
    const id = uuid();
    const notice: DogNotice = {
      id,
      name: faker.name.firstName(),
      date: new Date(),
      sex: 'Macho',
      imageLinks: 'https://dog-finder-images.s3.amazonaws.com/17443cb0-46f2-11eb-b6db-d59ec2a52aec.jpg',
      commentary: faker.lorem.sentence(10),
      marker: {
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude()),
      },
      address: {
        name: '',
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        region: faker.address.state(),
        country: faker.address.country(),
      },
    };
    const entry: DogFinderObject = {
      id: `user#${user.email}`,
      entry: `found#${id}`,
      type: 'found',
      createdAt: (new Date()).toISOString(),
      notice,
    };
    foundDogs.push(entry);
  }
  return foundDogs;
}

// console.log(createUsers(10));
function seed() {
  const users = createUsers(10);
  const lostDogs = createLostDogs(10, users[0].user);
  const foundDogs = createFoundDogs(10, users[1].user);
  const data = [...users, ...lostDogs, ...foundDogs];
  fs.writeFile('seeds/notices.json', JSON.stringify(data), (err) => {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
}

seed();
