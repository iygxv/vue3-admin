import request from '@/utils/request'
import { ILoginFn } from './type/login'

enum Api {
  Login = '/login',
}
export const login: ILoginFn = (data) => {
  return request({
    url: Api.Login,
    method: 'post',
    data
  })
}