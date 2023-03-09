import { defineStore, StoreDefinition } from 'pinia'
import { SettingsState } from './state'
export const useSettingStore: StoreDefinition = defineStore({
  id: 'setting', // id必填，且需要唯一
  state: (): SettingsState => {
    return {
      showTagsView: true,
      collapse: false
    }
  },
  actions: {
     // 侧边栏折叠
     handlerCollapse(isCollapse) {
      this.collapse = isCollapse
    }
  }
})