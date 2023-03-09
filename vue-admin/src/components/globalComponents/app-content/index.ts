import { App } from 'vue'
import AppContent from './src/index.vue'

AppContent.install = function(app: App) {
  app.component(AppContent.name, AppContent);
}

type IWithInstall<T> = T 
const _AppContent: IWithInstall<typeof AppContent> = AppContent

export default _AppContent
