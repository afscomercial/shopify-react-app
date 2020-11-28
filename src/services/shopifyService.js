import { axiosService } from './axiosService';

const postRequest = (url, data, headers) => {
  return axiosService.fetchURL(url, { method: 'post', body: data, headers:headers });
};

const getRequest = (url, headers) => {
  return axiosService.fetchURL(url, { method: 'get', headers:headers});
};

export const shopifyService = {
  getRequest,
  postRequest,
};
