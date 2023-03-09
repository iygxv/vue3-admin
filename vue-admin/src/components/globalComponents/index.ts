import { App } from 'vue'
import AppContent from './app-content'
import AppFrom from './form'
import AppTable from './table'
import AppPagination from './pagination'
const components = [AppContent, AppFrom, AppTable, AppPagination]

const install = (app: App): void => {
  
  components.forEach((component) => {
    app.component(component.name, component)
  })
}
export default {
  install
}