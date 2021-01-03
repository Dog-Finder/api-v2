// eslint-disable-next-line import/no-extraneous-dependencies
import * as faker from 'faker';
import axios from 'axios';
import { S3 } from 'aws-sdk';

const client = axios.create({
  baseURL: 'https://all31gfkx0.execute-api.us-east-1.amazonaws.com/dev',
  // baseURL: 'https://yi54rctdb2.execute-api.us-east-1.amazonaws.com/staging',
  responseType: 'json',
});
let token = '';

async function getImages(n: number) {
  const s3 = new S3({ signatureVersion: 'v4' });
  const params = {
    Bucket: 'dog-finder-images', /* required */
    MaxKeys: n,
    Prefix: 'seeds',
  };
  const { Contents } = await s3.listObjects(params).promise();
  const urls = Contents.map((object) => `https://dog-finder-images.s3.amazonaws.com/${object.Key}`);
  return urls;
}

async function signUp() {
  const { data: { resource } } = await client.post('/sign-up', {
    name: 'Test User',
    email: 'tester@gmail.com',
    password: '1234',
  });
  token = resource;
  console.log('Signed Up');
}
async function logIn() {
  const { data: { resource } } = await client.post('/log-in', {
    email: 'tester@gmail.com',
    password: '1234',
  });
  token = resource;
  console.log('Logged In');
}

async function createDogNotice(path, url) {
  const body = {
    name: faker.name.firstName(),
    imageLinks: url,
    marker: {
      latitude: parseFloat(faker.address.latitude()),
      longitude: parseFloat(faker.address.longitude()),
    },
    commentary: faker.lorem.sentence(10),
    date: new Date(),
    address: {
      name: '',
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      region: faker.address.state(),
      country: faker.address.country(),
    },
    sex: 'Macho',
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    await client.post(path, body, config);
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function seed(url) {
  console.log(url);
  await createDogNotice('/found-dog', url);
  await createDogNotice('/lost-dog', url);
}

async function main() {
  const urls = await getImages(10);
  try {
    await signUp();
  } catch (error) {
    console.log(error);
    await logIn();
  }
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    // eslint-disable-next-line no-await-in-loop
    await seed(url);
  }
  urls.forEach(seed);
}

main();
