import axios from 'axios'
import UnauthorizedError from './error/unauthorized-error'

axios.defaults.baseURL = process.env.VUE_APP_API_SERVER_URL
axios.defaults.withCredentials = true

axios.interceptors.response.use((response) => {
  const data = response.data

  if (response.status === 200) {
    if (!data.error) {
      return data
    } else {
      return Promise.reject(new Error(data.error.message))
    }
  } else if (response.status === 404) {
    return null
  } else {
    const message = (data && data.error && data.error.message) ? data.error.message : 'Internal server error'

    return Promise.reject(new Error(message))
  }
}, (error) => {
  const response = error.response
  const data = response.data
  const message = (data && data.error && data.error.message) ? data.error.message : 'Internal server error'

  if (response.status === 401) {
    return Promise.reject(new UnauthorizedError('Unauthorized'))
  }

  return Promise.reject(new Error(message))
})

export default axios
