import request from '@/utils/request'

enum Api {
  GetAllMenu = '/menu/list',
  DelMenu = '/menu/del',
  CreateAndUpdate = '/menu/createAndUpdate',
}
export const getAllMenu: any = (params : any) => {
  return request({
    url: Api.GetAllMenu,
    method: 'get',
    params
  })
}
export const delMenu: any = (data: any) => {
  return request({
    url: Api.DelMenu,
    method: 'post',
    data
  })
}
export const createAndEditMenu: any = (data: any) => {
  return request({
    url: Api.CreateAndUpdate,
    method: 'post',
    data
  })
}
