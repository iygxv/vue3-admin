<template>
  <app-content :title="'角色管理'">
    <div class="table-search">
      <el-form label-width="100px" size="default" :model="apiParams" class="table-search-form" :inline="true">
        <el-row>
          <el-col :sm="24">
            <el-form-item label="角色名: " prop="nick">
              <el-input v-model="apiParams.role_name" placeholder="请输入角色名"></el-input>
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
    <app-table :data="state.tableData" :columns="tableColumns">
      <template #handle="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" @click="handleOpenDel(row)">删除</el-button>
        <el-button type="warning" @click="handleOpenMenu(row)">授权菜单</el-button>
      </template>
    </app-table>
    <app-pagination
      :current-page="apiParams.pageNum"
      :page-size="apiParams.pageSize"
      :total="state.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 删除弹窗 -->
    <el-dialog v-model="delDialogVisible" title="提示" width="30%">
      <span>确认删除角色吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="delDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDel">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加或者编辑弹窗 -->
    <el-dialog v-model="addEditDialogVisible" :title="isAdd ? '添加' : '编辑'" :width="520" @closed="resetForm()">
      <app-form :formItems="formItems" :model="state.roleDateList" :rules="addEditRules" ref="form"></app-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 授权菜单弹窗 -->
    <el-dialog v-model="authorizationMenuDialog.visible" title="授权菜单" :width="520" @closed="resetMenuForm()">
      <el-form :model="authorizationMenuDialog.form" label-width="120px" ref="menuForm">
        <el-form-item label="角色名: ">
          <el-input v-model="authorizationMenuDialog.form.role_dec" disabled />
        </el-form-item>
        <el-form-item label="菜单: ">
          <el-tree
            ref="treeRef"
            :data=" authorizationMenuDialog.form.menuData"
            :props="authorizationMenuDialog.defaultProps"
            show-checkbox
            node-key="id"
          />
        </el-form-item>
        <!-- <el-form-item label="菜单: ">
          <el-input v-model="form.role_dec" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="authorizationMenuDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="saveMenu">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </app-content>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRole, delRole, createAndEditRole, authorizationMenu } from '@/api/role'
import { getRouters } from '@/api/system'
import { formatDate } from '@/utils/index'
import type { roleReactiveState } from './types'
import type { roleDateList } from '@/api/type/role'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { FormRules } from 'element-plus'
import type { columnsProp } from '@/types/columns'
import type { formItemProp } from '@/types/form'
import { ElTree } from 'element-plus'
const delDialogVisible = ref(false)
const addEditDialogVisible = ref(false)
const isAdd = ref(true)
const form = ref<any>(null)
const menuForm = ref<any>(null)
const treeRef = ref<InstanceType<typeof ElTree>>()
const creatorName = localStorage.getItem('name')
const state = reactive<roleReactiveState>({
  tableData: [],
  total: 0,
  roleDateList: {
    id: 0,
    role_name: '',
    role_dec: '',
    role_char: '',
    creator: '',
    create_time: '',
    update_time: ''
  }
})
const apiParams = reactive({
  pageNum: 1,
  pageSize: 10,
  role_name: ''
})
const tableColumns = reactive<columnsProp[]>([
  {
    prop: 'id',
    label: 'id'
  },
  {
    prop: 'role_name',
    label: '角色名字'
  },
  {
    prop: 'role_dec',
    label: '角色描述'
  },
  {
    prop: 'role_char',
    label: '权限字符'
  },
  {
    prop: 'creator',
    label: '创建者'
  },
  {
    prop: 'create_time',
    label: '创建时间',
    width: 250,
    formatterFn(row: roleDateList, column: TableColumnCtx<roleDateList>, cellValue: string) {
      return formatDate(cellValue)
    }
  },
  {
    prop: 'update_time',
    label: '更新时间',
    width: 250,
    formatterFn(row: roleDateList, column: TableColumnCtx<roleDateList>, cellValue: string) {
      return formatDate(cellValue)
    }
  },
  {
    slot: 'handle',
    label: '操作'
  }
])
const formItems = reactive<formItemProp[]>([
  {
    type: 'input',
    prop: 'role_name',
    label: '角色名字: ',
    attrs: {
      placeholder: '请输入角色名字'
    }
  },
  {
    type: 'input',
    prop: 'role_dec',
    label: '角色描述: ',
    attrs: {
      placeholder: '请输入角色描述'
    }
  },
  {
    type: 'input',
    prop: 'role_char',
    label: '权限字符: ',
    disabled: !isAdd,
    attrs: {
      placeholder: '请输入权限字符'
    }
  }
])
const authorizationMenuDialog = reactive<any>({
  visible: false,
  form: {
    id: '',
    role_dec: '',
    menuData: []
  },
  defaultProps: {
    children: 'children',
    label: 'title'
  }
})

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1'
      },
      {
        id: 6,
        label: 'Level two 2-2'
      }
    ]
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      }
    ]
  }
]
const getTableData = async () => {
  let res = await getAllRole(apiParams)
  ;(state.tableData = res.data?.data?.row || []), (state.total = res.data?.data?.total || 0)
}
const handleSizeChange = (val: number) => {
  apiParams.pageSize = val
  apiParams.pageNum = 1
  getTableData()
}
const handleCurrentChange = (val: number) => {
  apiParams.pageNum = val
  getTableData()
}
const addEditRules = reactive<FormRules>({
  role_name: [{ required: true, message: '请输入角色名字', trigger: ['blur', 'change'] }],
  role_dec: [{ required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }],
  role_char: [{ required: true, message: '请输入权限字符', trigger: ['blur', 'change'] }]
})
const handleEdit = (row: roleDateList) => {
  addEditDialogVisible.value = true
  isAdd.value = false
  nextTick(() => {
    state.roleDateList = { ...row }
  })
}
const handleAdd = () => {
  addEditDialogVisible.value = true
  isAdd.value = true
}
const save = async () => {
  addEditDialogVisible.value = false
  if (creatorName) {
    state.roleDateList.creator = JSON.parse(creatorName)['name']
  }
  let res = await createAndEditRole(state.roleDateList)
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
const handleOpenDel = async (row: roleDateList) => {
  delDialogVisible.value = true
  state.roleDateList = row
}
const handleOpenMenu = async (row: roleDateList) => {
  const res = await getRouters()
  const { data: { code, data } } = res
  if (code === 200) {
    authorizationMenuDialog.visible = true
    nextTick(() => {
        authorizationMenuDialog.form.id = row.id
        authorizationMenuDialog.form.role_dec = row.role_dec
        authorizationMenuDialog.form.menuData = listToTree(data)
        treeRef.value!.setCheckedKeys(row.menu_ids?.split(','), true)
    })
  }
}
const handleDel = async () => {
  delDialogVisible.value = false
  let res = await delRole({ id: state.roleDateList.id })
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
const resetMenuForm = () => {
  menuForm.value?.resetFields()
}
// 保存当前角色的菜单
const saveMenu = async() => {
  let checkedKeys = treeRef.value!.getCheckedKeys() || [];
  let halfCheckedMenuIds = treeRef.value!.getHalfCheckedKeys() || [];
  let res = await authorizationMenu({
    id:  authorizationMenuDialog.form.id,
    menu_ids: ([...halfCheckedMenuIds, checkedKeys]).join(',')
  })
  if (res.data.code === 200) {
     authorizationMenuDialog.visible = false
     ElMessage({
      showClose: true,
      message: '保存成功',
      type: 'success',
      duration: 3000
    })
    getTableData();
  }
  
}
const listToTree = (list: any) => {
  const menus = list
  let _menus: any = []

  let temp: any = {}
  // 减少循环操作
  menus.forEach((item: any) => {
    temp[item.id] = item
  })

  // 遍历加入
  for (let key in temp) {
    // 如果不是最大父级
    if (temp[key].parent_id !== 0) {
      // 找到父亲, 判断有没有children属性
      if (!temp[temp[key].parent_id].children) {
        temp[temp[key].parent_id].children = []
      }
      // 有就加入进来
      temp[temp[key].parent_id].children.push(temp[key])
    } else {
      _menus.push(temp[key])
    }
  }

  // 排序
  _menus.forEach((item: any) => {
    if (item.children) {
      item.children.sort((a: any, b: any) => a.sort - b.sort)
    }
  })
  _menus.sort((a: any, b: any) => a.sort - b.sort)
  return _menus
}
// 获取所有数据
getTableData()
</script>
