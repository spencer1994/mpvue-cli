import Fly from 'flyio'
const request = new Fly()

request.interceptors.request.use((request) => {
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    return promise.resolve(response.data)
  },
  (err, promise) => {
    return promise.reject(err)
  }
)
export default request
