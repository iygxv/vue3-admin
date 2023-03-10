export interface columnsProp {
  type?: string
  prop?: string
  label?: string
  width?: number
  slot?: string
  selectableFn?: Function
  formatterFn?: Function
  attrs?: Attr
 
}
export type disabledFn  = () => boolean

interface Attr { //大量属性
  [key: string]: any
}

