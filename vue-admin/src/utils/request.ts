/**
 * @description [ axios 请求封装]
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/token';

// const userStore = useUserStore()
// const router = useRouter()
// console.log(router);

// 根据环境不同引入不同api地址

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  timeout: 5000,
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem('token')
    token && config.headers && (config.headers['Authorization'] = `Bearer ${JSON.parse(token)['token']}`)
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use((res) => {
  let { code, message } = res.data
  // refreshToken();
  if (code === 200) {
    return res
  } else {
    switch (code) {
      case 401:
        ElMessage.error({
          message,
        });
      default:
        ElMessage.error({
          message,
        });
    }
    return res
  }

}, err => {//响应错误了
  const status: number = err.response.status;
  const message: string = err.response.data.message;
  switch (status) {
    case 401:
      ElMessage.error({
        message,
      });
    default:
      ElMessage.error({
        message,
      });
  }
  return Promise.reject(err);
})

export default service