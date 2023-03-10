export interface Menu {
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
  creator: string
  createTime: string
  updateTime: string
}
export interface _Temp {
  [key: number]: Menu
}