import { AxiosPromise } from 'axios'
export interface IResponseDataType<T = {}> {
  code: number
  message: string
  data?: T
}
export interface row {
  // row: roleDateList[],
  row: any,
  total: number
}
export interface roleDateList {
  id: number,
  role_name: string,
  role_dec: string,
  role_char: string,
  menu_ids?: string,
  creator: string,
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
  id?: number,
  role_name: string,
  role_dec: string,
  role_char: string,
  menu_ids?: string,
  creator: string,
}
// 角色相关
export type IGetAllRole = (params: params) => AxiosPromise<IResponseDataType<any>>
export type IDelRole = (data: Iid) => AxiosPromise<IResponseDataType>
export type ICreateAndEditRole = (data: ICreateEditDate) => AxiosPromise<IResponseDataType>