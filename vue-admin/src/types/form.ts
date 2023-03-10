export interface formItemProp {
  type: string
  prop: string
  dateType?: string
  label?: string
  disabled?: boolean | disabledFn
  placeholder?: string
  clearable?: boolean
  options?: Array<any>
  format?: any
  width?: number
  attrs?: Attr
  props?: any
}
export type disabledFn  = () => boolean
interface Attr { //大量属性
  [key: string]: any
}

