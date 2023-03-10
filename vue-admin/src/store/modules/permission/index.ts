import { defineStore, StoreDefinition } from 'pinia'
import { getRouters } from '@/api/system'
import { getAllRole } from '@/api/role'
import { Menu, _Temp } from './state'
export const usePermissionStore: StoreDefinition = defineStore({
  id: 'permission', // id必填，且需要唯一
  state: () => {
    return {
      menus: [] as unknown as Menu[]
    }
  },
  getters: {
    getMenus: (state: { menus: any }) => {
      const menus = state.menus
      let _menus: any = []

      let temp: any = {}
      // 减少循环操作
      menus.forEach((item: any) => {
        temp[item.id] = item
      })

      // 遍历加入
      for (let key in temp) {
        // 如果不是最大父级
        if (temp[key].parent_id !== 0) {
          // 找到父亲, 判断有没有children属性
          if (!temp[temp[key].parent_id].children) {
            temp[temp[key].parent_id].children = []
          }
          // 有就加入进来
          temp[temp[key].parent_id].children.push(temp[key])
        } else {
          _menus.push(temp[key])
        }
      }
      
      // 排序
      _menus.forEach((item: any) => {
        if (item.children) {
          item.children.sort((a: any, b: any) => a.sort - b.sort)
        }
      })
      _menus.sort((a: any, b: any) => a.sort - b.sort)
      return _menus
    }
  },
  actions: {
    setMenus(role_char: string) {

      return new Promise(async (resolve, reject) => {
        const res1 = await getRouters()
        const res2 = await getAllRole({ pageSize: 100 })
        let { data: {code: code1 , data: data1}}  = res1
        let { data: { code: code2, data: { row }}} = res2
        let roles: any = []
        if(code2 === 200) {
          roles = row // 获取到所有角色
        }
        if (code1 === 200) {
          console.log(roles);
          
          // 获取到当前角色 的菜单id
          const [ roleInfo ] = roles.filter((role: any) => role.role_char === role_char)
          
          const menu_ids: any = roleInfo && roleInfo.menu_ids.split(",")
        
          const dynamicRoutes = data1?.filter(item => {
            
            return menu_ids.includes(String(item.id))
          })
          this.menus = dynamicRoutes as unknown as Menu[]
          resolve(data1);
        } else {
          reject(res1);
        }
      })
    }
  }
})