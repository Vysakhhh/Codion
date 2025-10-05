import axios from 'axios'
import server_url from './server_url'

export const axiosInstance = axios.create({
    baseURL:server_url
})