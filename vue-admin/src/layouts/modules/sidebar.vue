<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="route.path"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="(menu, index) in state.menus">
        <template v-if="menu.children">
          <el-sub-menu :index="menu.path" :key="index">
            <template #title>
              <el-icon v-if="menu.icon">
                <component :is="menu.icon"></component>
              </el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <template v-for="(subMenu, index) in menu.children" :key="index">
              <el-menu-item :index="subMenu.path" v-if="!subMenu.hidden">{{ subMenu.title }} </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.path" :key="menu.path" v-if="!menu.hidden">
            <el-icon v-if="menu.icon">
              <component :is="menu.icon"></component>
            </el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, reactive, computed } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'
import { IState } from './types/sidebar'
import { useSettingStore } from '@/store/modules/settings'
const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()

const state = reactive<IState>({
  menus: null
})
// const onRoutes = computed(() => {
//   console.log(route.path);
//   return route.path;
// });
// 获取菜单
const collapse = computed(() => {
  return settingStore.collapse
})
onMounted(() => {
  const menuStore = usePermissionStore()
  state.menus = menuStore.getMenus
})
</script>

<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: -20px;
  overflow-y: scroll;
  ::v-deep(.el-menu-item) {
    padding-left: 40px !important;
  }
  ::v-deep(.el-sub-menu) {
    padding-left: 20px !important;
    .el-menu-item {
      padding-left: 50px !important;
    }
  }
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}

.sidebar > ul {
  height: 100%;
}
</style>
