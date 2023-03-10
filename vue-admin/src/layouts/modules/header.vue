<template>
  <div class="header">
    <div class="collapse-btn" @click="handlerCollapse">
      <el-icon>
        <fold v-if="collapse" />
        <Expand v-else />
      </el-icon>
      <!-- <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i> -->
    </div>
    <div class="logo">{{ header_title }}</div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="full-screen" @click="handleFullScreen">
          <el-tooltip class="box-item" effect="dark" :content="isFullScreen ? '取消全屏' : '全屏'" placement="bottom">
            <el-icon style="font-size: 22px">
              <full-screen />
            </el-icon>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avatar">
          <img src="../../assets/avatar.png" />
          <div class="name">{{ surname }}</div>
        </div>
        <el-dropdown>
          <span>
            <el-icon style="margin-right: 8px; margin-top: 1px; color: #fff; font-size: 22px">
              <setting />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/auth'
import { useSettingStore } from '@/store/modules/settings'
import { header_title } from '@/config'
import { ElMessage } from 'element-plus'
const router = useRouter()
const userStore = useUserStore()
const settingStore = useSettingStore()
const isFullScreen = ref(false)
const tooltip = ref(false)
const surname = ref('')
const logout = () => {
  router.push({
    path: '/login'
  })
  userStore.removeToken()
  ElMessage.success('退出成功')
}
const collapse = computed(() => settingStore.collapse)
const handlerCollapse = () => {
  settingStore.handlerCollapse(!settingStore.collapse)
}
const handleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value) {
    document.body.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
// name
const name: any = localStorage.getItem('name')
surname.value = `${JSON.parse(name)['name']}`
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #242f42;
  display: flex;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.collapsed {
  color: #409eff;
}

.header .logo {
  width: 200px;
  line-height: 70px;
}

.header-right {
  position: absolute;
  right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.full-screen {
  height: 100%;
  display: flex;
  align-items: center;
}
.user-avatar {
  display: flex;
  align-items: center;
  margin: 0 15px;
  .name {
    font-size: 14px;
  }
}
.user-avatar img {
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 5px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
