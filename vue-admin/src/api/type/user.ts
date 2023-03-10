import { AxiosPromise } from 'axios'
export interface IResponseDataType<T = {}> {
  code: number
  message: string
  data?: T
}
export interface row {
  row: any,
  total: number
}
export interface userList {
  id: number,
  user_name: string,
  password: string,
  role_dec: string,
  user_role_id: string,
  create_time: string
  update_time: string
}
export interface params {
  pageNum?: number,
  pageSize?: number
}
export interface Iid {
  id: number
}
export interface ICreateEditDate {
  id?: number | string,
  user_name: string,
  password?: string,
  role_dec?: string,
  user_role_id?: number | string,
  createTime?: string;
  updateTime?: string;
}
export interface IAssignmentRoleDate {
  id?: number | string,
  user_id?: number | string,
  role_id?: number | string,
}
// 角色相关
export type IGetAllUser = (params: params) => AxiosPromise<IResponseDataType<row>>
export type IDelUser = (data: Iid) => AxiosPromise<IResponseDataType>
export type ICreateAndEditUser = (data: ICreateEditDate) => AxiosPromise<IResponseDataType>
export type IAssignmentRole = (data: IAssignmentRoleDate) => AxiosPromise<IResponseDataType>
