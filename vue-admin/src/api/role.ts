import request from '@/utils/request'
import { IGetAllRole, IDelRole, ICreateAndEditRole } from './type/role'

enum Api {
  GetAllRole = '/role/getAllRole',
  DelRole = '/role/delRole',
  CreateAndEditRole = '/role/createAndEditRole',
  AuthorizationMenu = '/role/authorization/menu',
}
export const getAllRole: IGetAllRole = (params) => {
  return request({
    url: Api.GetAllRole,
    method: 'get',
    params
  })
}
export const delRole: IDelRole = (data) => {
  return request({
    url: Api.DelRole,
    method: 'post',
    data
  })
}
export const createAndEditRole: ICreateAndEditRole = (data) => {
  return request({
    url: Api.CreateAndEditRole,
    method: 'post',
    data
  })
}
export const authorizationMenu: any = (data :any) => {
  return request({
    url: Api.AuthorizationMenu,
    method: 'post',
    data
  })
}