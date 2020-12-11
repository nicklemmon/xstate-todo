import axios from 'axios'
import { API_BASE_URL } from 'src/constants'

export const customAxios = axios.create({
  baseUrl: API_BASE_URL,
  headers: {
    'X-Parse-Application-Id': process.env.REACT_APP_APPLICATION_ID,
    'X-Parse-JavaScript-Key': process.env.REACT_APP_JAVASCRIPT_API_KEY,
  },
})
