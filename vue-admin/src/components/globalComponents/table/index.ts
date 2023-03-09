import { App } from 'vue'
import AppTable from './src/index.vue'

AppTable.install = function(app: App) {
  app.component(AppTable.name, AppTable);
}

type IWithInstall<T> = T 
const _AppTable: IWithInstall<typeof AppTable> = AppTable

export default _AppTable
