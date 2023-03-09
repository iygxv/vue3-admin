import { createApp } from 'vue'
import store from './store'
import router from './router'
import './permission'
import App from './App.vue'
import globalComponents from '@/components/globalComponents'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElIcons from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/global.scss'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)
app
  .use(store)
  .use(router)
  .use(globalComponents)
  
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(VueAxios,axios)
for (const name in ElIcons) {
  app.component(name, (ElIcons as any)[name])
}

app.mount('#app')
