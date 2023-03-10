<template>
  <app-content :title="'用户管理'">
    <div class="table-search">
      <el-form label-width="100px" size="default" :model="apiParams" class="table-search-form" :inline="true">
        <el-row>
          <el-col :sm="24">
            <el-form-item label="用户名: " prop="nick">
              <el-input v-model="apiParams.user_name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getTableData">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <app-table :data="table.row" :columns="table.tableColumns">
      <template #handle="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" @click="handleOpenDel(row)">删除</el-button>
        <el-button type="warning" @click="handleAssignmentRole(row)">分配角色</el-button>
      </template>
    </app-table>
    <app-pagination
      :current-page="apiParams.pageNum"
      :page-size="apiParams.pageSize"
      :total="table.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 删除弹窗 -->
    <el-dialog v-model="delDialogVisible" title="提示" width="30%">
      <span>确认删除用户吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="delDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDel">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加或者编辑弹窗 -->
    <el-dialog v-model="addEditUserDialog.visible" :title="isAdd ? '添加' : '编辑'" :width="520" @closed="resetForm()">
      <app-form
        :formItems="addEditUserDialog.formItems"
        :model="addEditUserDialog.model"
        :rules="addEditUserDialog.rules"
        ref="form"
      ></app-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addEditUserDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog v-model="assignmentRoleDialog.visible" title="分配角色" :width="520">
      <app-form :formItems="assignmentRoleDialog.formItems" :model="assignmentRoleDialog.model"></app-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignmentRoleDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="saveAssignmentRole">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </app-content>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRole } from '@/api/role'
import { getAllUser, delUser, createAndEditUser, assignmentRole } from '@/api/user'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { formatDate } from '@/utils/index'
const delDialogVisible = ref(false)
const isAdd = ref(true)
const form = ref<any>(null)

const apiParams = reactive({
  pageNum: 1,
  pageSize: 10,
  user_name: ''
})
const addEditUserDialog = reactive({
  visible: false,
  isAdd: false,
  id: '',
  model: {
    id: '',
    role_id: '',
    user_role_id: '',
    role_dec: '',
    user_name: '',
    password: ''
  },
  formItems: [
    {
      prop: 'id',
      show: () => false
    },
    {
      prop: 'role_id',
      show: () => false
    },
    {
      prop: 'user_role_id',
      show: () => false
    },
    {
      prop: 'role_dec',
      show: () => false
    },
    {
      prop: 'user_name',
      label: '用户名: ',
      attrs: {
        placeholder: '请输入用户名'
      }
    },
    {
      type: 'password',
      prop: 'password',
      label: '密码: ',
      attrs: {
        placeholder: '请输入密码'
      }
    }
  ],
  rules: {
    user_name: [{ required: true, message: '用户名不能为空', trigger: ['blur', 'change'] }],
    password: [{ required: true, message: '密码不能为空', trigger: ['blur', 'change'] }]
  }
})
const assignmentRoleDialog = reactive({
  visible: false,
  model: {
    id: '',
    user_id: '',
    role_id: ''
  },
  formItems: [
    {
      type: 'select',
      prop: 'role_id',
      label: '角色列表：',
      clearable: false,
      options: []
    }
  ]
})
const table = reactive({
  row: [],
  total: 0,
  tableColumns: [
    {
      prop: 'id',
      label: 'id'
    },
    {
      prop: 'user_name',
      label: '用户名'
    },
    {
      prop: 'role_dec',
      label: '角色描述'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      width: 250,
      formatterFn(row: any, column: TableColumnCtx<any>, cellValue: string) {
        return formatDate(cellValue)
      }
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      width: 250,
      formatterFn(row: any, column: TableColumnCtx<any>, cellValue: string) {
        return formatDate(cellValue)
      }
    },
    {
      slot: 'handle',
      label: '操作'
    }
  ]
})
const getRoleData = async () => {
  let res = await getAllRole({ pageNum: 1, pageSize: 100 })
  let options = res.data.data.row.map((item: any) => ({
    label: item.role_dec,
    value: item.id
  }))
  assignmentRoleDialog.formItems[0].options = options
}
const getTableData = async () => {
  let res = await getAllUser({ pageNum: apiParams.pageNum, pageSize: apiParams.pageSize })
  ;(table.row = res.data?.data?.row || []), (table.total = res.data?.data?.total || 0)
}
const handleSizeChange = (val: number) => {
  apiParams.pageNum = 1
  apiParams.pageSize = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
  apiParams.pageNum = val
  getTableData()
}

const handleEdit = (row: any) => {
  addEditUserDialog.visible = true
  isAdd.value = false
  nextTick(() => {
    addEditUserDialog.model = { ...row }
  })
}
const handleAssignmentRole = (row: any) => {
  assignmentRoleDialog.visible = true
  nextTick(() => {
    assignmentRoleDialog.model = { id: row.user_role_id, user_id: row.id, role_id: row.role_id }
  })
}
const saveAssignmentRole = async () => {
  assignmentRoleDialog.visible = false
  let res = await assignmentRole({ ...assignmentRoleDialog.model })
  if (res.data.code === 200) {
    ElMessage({
      showClose: true,
      message: res.data.message,
      type: 'success',
      duration: 3000
    })
    getTableData()
  }
}
const handleAdd = () => {
  addEditUserDialog.visible = true
  isAdd.value = true
}
const save = async () => {
  addEditUserDialog.visible = false
  let res = await createAndEditUser(addEditUserDialog.model)
  if (res.data.code === 200) {
    ElMessage({
      showClose: true,
      message: res.data.message,
      type: 'success',
      duration: 3000
    })
    getTableData()
  }
}
const handleOpenDel = async (row: any) => {
  delDialogVisible.value = true
  addEditUserDialog.id = row.id
}
const handleDel = async () => {
  delDialogVisible.value = false
  let res = await delUser({ id: Number(addEditUserDialog.id) })
  if (res.data.code === 200) {
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success',
      duration: 1000
    })
    getTableData()
  }
}
const resetForm = () => {
  form.value?.resetFrom()
}
// 获取所有数据
getTableData()
// 获取角色数据
getRoleData()
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
}
</style>
