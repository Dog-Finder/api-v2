import axios, { AxiosResponse } from 'axios';

// const modelApi = 'http://visual-embedding-api-dev.us-east-1.elasticbeanstalk.com';
const modelApi = 'http://127.0.0.1:5000';
type vectorData = { imageLink: string, userId: string, entryId: string}

export function vectorizeImage(data: vectorData): Promise<AxiosResponse> {
  return axios.post(`${modelApi}/predict-save`, data);
}

export function searchKNN(imageLink: string): Promise<AxiosResponse> {
  return axios.post(`${modelApi}/search`, { url: imageLink });
}
