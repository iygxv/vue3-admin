import { AxiosPromise } from 'axios'
export interface IResponseDataType<T = {}> {
  code: number
  message: string
  data?: T
}
export interface menu {
  id: number
  name: string
  com_path: string
  title: string
  parent_id: number
  path: string
  icon: string
  sort: number
  hidden: number
  isRedirect: number
  role_char: string
  creator: string
  createTime: string
  updateTime: string
}

// 路由菜单
export type IGetRouters = () => AxiosPromise<IResponseDataType<menu[]>>