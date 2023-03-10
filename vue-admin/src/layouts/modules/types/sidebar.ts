interface IMenus {
  children?: any
  createTime?: string
  creator?: string
  hidden?: string
  icon?: string
  id?: number
  name?: string
  parent_id?: number
  path?: string
  sort?: string | number
  updateTime?: string
}
interface IState {
  menus: IMenus | null
}

export type {
  IState
}