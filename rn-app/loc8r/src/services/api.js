import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://mysterious-depths-49888.herokuapp.com/api'
});