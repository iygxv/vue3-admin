<template>
  <div class="login-page">
    <div class="login-form-box">
      <h3>{{ header_title }}</h3>
      <el-form :model="loginForm" ref="loginFormRef" class="login-form" :rules="loginRules">
        <el-form-item props="user_name">
          <el-input :prefix-icon="UserFilled" type="text" autocomplete="off" placeholder="请输入用户名" v-model="loginForm.user_name" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" v-model="loginForm.password" placeholder="请输入密码" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="submitForm(loginFormRef)">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Lock, UserFilled } from '@element-plus/icons-vue'
import { login } from '@/api/login'
import { useUserStore } from '@/store/modules/auth'
import { usePermissionStore } from '@/store/modules/permission';
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useRouter, useRoute } from 'vue-router'
import { header_title } from '@/config/index'
const router = useRouter()
const route = useRoute()

const loginForm = reactive({
  user_name: 'vvvv',
  password: '123456'
})
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }],
  user_name: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }]
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let res = await login(loginForm)
      if (res.data.code == 200) {
        const userStore = useUserStore()
        const menuStore = usePermissionStore()
        const tagsViewStore = useTagsViewStore();
        // 存储token
        userStore.updateToken(res.data.token)
        // 存储角色
        userStore.updateChar(res.data.role_char)
        // 存储用户名
        userStore.updateName(res.data.name)
        // 获取路由信息
        menuStore.setMenus(res.data.role_char).then(() => {
          ElMessage({
            showClose: true,
            message: '登陆成功',
            type: 'success',
            duration: 1000
          })
          router.push({
            path: '/layout'
          })
          // 删除其他tagView信息
           tagsViewStore.delOthersViews(route)

        })
      }
    } else {
      ElMessage({
        showClose: true,
        message: '请输入用户名或者密码',
        type: 'error'
      })
      return false
    }
  })
}
onMounted(() => {

})
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-color: #2d3a4b;
}

.login-form-box {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  padding: 35px 40px 15px;
  width: 520px;
  max-width: 100%;
  transform: translateX(-50%) translateY(-50%);

  h3 {
    width: 420px;
    padding: 30px 0;
    font-size: 24px;
    color: #fff;
    text-align: center;
    font-weight: 900;
  }

  .login-form {
    width: 420px;

    .el-form-item {
      margin-bottom: 30px;
    }

    ::v-deep(.el-form-item__content) {
      margin-left: 0 !important;
    }

    ::v-deep(.el-input) {
      height: 50px;

      input {
        height: 100%;
        padding-left: 50px;
        box-sizing: border-box;
        background: transparent;
        color: #fff;
        font-size: 14px;
      }

      .el-input__prefix {
        font-size: 16px;
        // color: #454545;
        vertical-align: middle;
      }

      .el-input__suffix {
        display: none;
      }
    }
  }

  .submit-btn {
    width: 420px;
    height: 50px;
    font-size: 18px;
    text-align: center;
  }
}
</style>
