import router from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from './store/modules/permission';
import { useUserStore } from './store/modules/auth'



// 生成路由
const genRoutes = () => {
  const menuStore = usePermissionStore()
  //生成路由配置
  const menus = menuStore.getMenus;
  const newRoute: RouteRecordRaw = {
    path: '/layout',
    name: 'Main',
    redirect: '/dashboard',
    component: () => import('./layouts/index.vue'),
    children: []
  }

  // 动态路由addRoute
  for (let i = 0; i < menus.length; i++) {
    let item = menus[i]
    if (item.isRedirect && item.children) {
      // 重定向的不加入进来
      for (let j = 0; j < item.children.length; j++) {
        let child = item.children[j]
        let modules = import.meta.glob('../**/*.vue')
        newRoute.children?.push({
          path: child.path,
          name: child.name,
          component: modules[`./views${child.com_path}.vue`],
          meta: { title: child.title },
        })
      }
    } else {
      let modules = import.meta.glob('../**/*.vue')
      newRoute.children?.push({
        path: item.path,
        name: item.name,
        component: modules[`./views${menus[i].com_path}/index.vue`],
        meta: { title: item.title },
      })
    }
  }
  router.addRoute(newRoute)
}
/**
 * to 去哪里
 * from 从哪里来
 * next 通行
 */
router.beforeEach(async (to, from, next) => {
  const menuStore = usePermissionStore()
  const userStore = useUserStore()
  const token: string | null = localStorage.getItem('token')
  const menus: [] = menuStore.menus
  
  if (!token && to.path !== '/login') { //  1.没有token,并且从地址栏跳转
    return next('/login')
  } else if (token && menus.length === 0) {  // 2.有token, menus没有(刷新时丢失路由)

    // 重新获取和添加动态路由
    await menuStore.setMenus(userStore.char)
    genRoutes()
    next(to)
  } else if (token && menus.length !== 0 && from.path === '/login' && to.path === '/layout') {

    genRoutes()
    next('/dashboard')
  } else if (token && to.path == '/login') {  // (不允许地址栏中直接返回登陆) 
    next(from)
  } else { // 基本跳转
    next()
  }
})