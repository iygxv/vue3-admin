import { App } from 'vue'
import AppPagination from './src/index.vue'

AppPagination.install = function(app: App) {
  app.component(AppPagination.name, AppPagination);
}

type IWithInstall<T> = T 
const _AppPagination: IWithInstall<typeof AppPagination> = AppPagination

export default _AppPagination
