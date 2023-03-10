import { defineStore, StoreDefinition } from 'pinia'
import { Auth } from './state'
export const useUserStore: StoreDefinition = defineStore({
  id: 'Auth', // id必填，且需要唯一
  // 开启数据缓存
  persist: {
    enabled: true,
    // 默认存在sessionStorage中
    strategies: [
      {
        key: 'token',
        storage: localStorage,
      },
      {
        key: 'char',
        storage: localStorage,
        paths: ['char']
      },
      {
        key: 'name',
        storage: localStorage,
        paths: ['name']
      }
    ]
  },
  state: (): Auth => {
    return {
      token: '',
      char: '',
      name: ''
    }
  },
  getters: {
    getToken: (state: { token: string }) :string => {
      return state.token
    }
  },
  actions: {
    updateToken(token: string):void {
      this.token = token
    },
    updateChar(char: string):void {
      this.char = char
    },
    updateName(name: string):void {
      this.name = name
    },
    removeToken():void {
      this.token && localStorage.removeItem('token')
    }
  }
})