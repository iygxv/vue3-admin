import { defineStore, StoreDefinition } from 'pinia'
import { TagsViewState, TagView } from './state'
export const useTagsViewStore: StoreDefinition = defineStore({
  id: 'tagsView', // id必填，且需要唯一
  // 开启数据缓存
  state: (): TagsViewState => {
    return {
      tagsList: [],
    }
  },
  actions: {
    // 添加view
    addView(view: TagView) {
      if (this.tagsList.some(v => v.path === view.path)) return
      this.tagsList.push(
        Object.assign({}, view, {
          title: view.meta?.title || '未命名'
        })
      )
    },
    // 删除当前view
    delView(view: TagView) {
      for (const [i, v] of this.tagsList.entries()) {
        if (v.path === view.path) {
          this.tagsList.splice(i, 1)
          break
        }
      }
    },
    // 删除其他view
    delOthersViews(view: TagView) {
      this.tagsList = this.tagsList.filter(v => {
        return v.path === view.path
      })
    },
    // 删除所有view
    delAllViews() {
      this.tagsList = []
    }
  }
})