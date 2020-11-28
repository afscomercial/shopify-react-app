import axios from 'axios';

const fetchURL = (url, request) => {
  return axios({
    method: request.method,
    url: url,
    data: request.body,
    headers: request.headers,
  })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw Error(e);
    });
};

export const axiosService = { fetchURL };
