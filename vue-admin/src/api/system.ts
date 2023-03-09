import request from '@/utils/request'
import { IGetRouters } from './type/system'

enum Api {
  GetRouters = '/getRouters',
}
export const getRouters: IGetRouters = () => {
  return request({
    url: Api.GetRouters,
    method: 'get'
  })
}