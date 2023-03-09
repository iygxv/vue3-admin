import request from '@/utils/request'
import { IGetAllUser, IDelUser, ICreateAndEditUser, IAssignmentRole } from './type/user'

enum Api {
  GetAllUser = '/user/getAll',
  DelUser = '/user/del',
  CreateAndUpdate = '/user/createAndUpdate',
  AssignmentRole = '/user/role/createAndUpdate'
}
export const getAllUser: IGetAllUser = (params) => {
  return request({
    url: Api.GetAllUser,
    method: 'get',
    params
  })
}
export const delUser: IDelUser = (data) => {
  return request({
    url: Api.DelUser,
    method: 'post',
    data
  })
}
export const createAndEditUser: ICreateAndEditUser = (data) => {
  return request({
    url: Api.CreateAndUpdate,
    method: 'post',
    data
  })
}
export const assignmentRole: IAssignmentRole = (data) => {
  return request({
    url: Api.AssignmentRole,
    method: 'post',
    data
  })
}