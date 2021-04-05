import axios, { AxiosResponse } from 'axios';

let modelApi = 'https://ws1cwmx9c3.execute-api.us-east-1.amazonaws.com/dev';
if (process.env.NODE_ENV === 'staging') {
  modelApi = 'https://il178cctjd.execute-api.us-east-1.amazonaws.com/staging';
}
// const modelApi = 'http://127.0.0.1:5000';
type vectorData = { imageLink: string, userId: string, entryId: string}

export function vectorizeImage(data: vectorData): Promise<AxiosResponse> {
  return axios.post(`${modelApi}/predict-save`, data);
}

export function searchKNN(imageLink: string, index: string, size: number): Promise<AxiosResponse> {
  return axios.post(`${modelApi}/search`, { url: imageLink, index, size });
}
