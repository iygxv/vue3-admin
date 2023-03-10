
import { AxiosPromise } from 'axios'
interface ILoginDate{
  user_name: string
  password: string
}
export interface IResponseDataType {
  code: number
  message: string
  token: string
  name: string
  role_name: string
  role_dec: string
  role_char: string
}
export type ILoginFn = (data: ILoginDate) => AxiosPromise<IResponseDataType>