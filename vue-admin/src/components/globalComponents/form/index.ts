import { App } from 'vue'
import AppFrom from './src/index.vue'

AppFrom.install = function(app: App) {
  app.component(AppFrom.name, AppFrom);
}

type IWithInstall<T> = T 
const _AppFrom: IWithInstall<typeof AppFrom> = AppFrom

export default _AppFrom
