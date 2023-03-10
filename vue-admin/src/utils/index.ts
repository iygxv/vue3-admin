// 格式化时间
import dayjs from "dayjs"
export const formatDate = (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')