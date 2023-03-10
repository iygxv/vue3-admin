<template>
  <app-content :title="'菜单管理'">
    <div class="table-search">
      <el-form label-width="100px" size="default" :model="apiParams" class="table-search-form" :inline="true">
        <el-row>
          <el-col :sm="24">
            <el-form-item label="菜单名: " prop="nick">
              <el-input v-model="apiParams.title" placeholder="请输入菜单名"></el-input>
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
    <app-table :data="table.row" :columns="table.tableColumns" row-key="id">
      <template #handle="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" @click="handleOpenDel(row)" :disabled="row.parent_id === 0">删除</el-button>
      </template>
    </app-table>
    <!-- 删除弹窗 -->
    <el-dialog v-model="delDialogVisible" title="提示" width="30%">
      <span>确认删除该菜单吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="delDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDel">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加或者编辑弹窗 -->
    <el-dialog
      v-model="addEditUserDialog.visible"
      :title="addEditUserDialog.isAdd ? '添加' : '编辑'"
      :width="520"
      @closed="resetForm()"
    >
      <div class="select-type">
        <el-radio-group v-model="selectType" @change="radioChange">
          <el-radio label="1" size="large" border>目录</el-radio>
          <el-radio label="2" size="large" border>菜单</el-radio>
        </el-radio-group>
      </div>
      <app-form
        :formItems="addEditUserDialog.formItems"
        :model="addEditUserDialog.model"
        :rules="addEditUserDialog.rules"
        ref="form"
      >
        <template #icon>
          <el-select v-model="addEditUserDialog.model.icon" clearable placeholder="请选择" :teleported="false">
            <el-option v-for="item in state.icons" :key="item.value" :label="item.label" :value="item.value">
              <el-icon style="margin-top: 10px">
                <component :is="item.label"></component>
              </el-icon>
              <span style="margin-left: 5px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </template>
      </app-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addEditUserDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </app-content>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRole } from '@/api/role'
import { getAllMenu, delMenu, createAndEditMenu } from '@/api/menus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { formatDate } from '@/utils/index'
const delDialogVisible = ref(false)
const selectType = ref('1')
const form = ref<any>(null)
const state = reactive<any>({
  icons: []
})
const addEditUserDialog = reactive({
  visible: false,
  isAdd: false,
  id: '',
  model: {
    id: '',
    name: '',
    com_path: '',
    title: '',
    parent_id: selectType.value === '1' ? 0 : '',
    path: '',
    icon: '',
    sort: '',
    hidden: 0,
    isRedirect: 0,
    role_char: [],
    creator: ''
  },
  formItems: [
    {
      prop: 'id',
      show: () => false
    },
    {
      prop: 'name',
      label: '组件名: ',
      attrs: {
        placeholder: '请输入组件名'
      }
    },
    {
      prop: 'com_path',
      label: '组件路径: ',
      attrs: {
        placeholder: '请输入组件路径'
      }
    },
    {
      prop: 'title',
      label: '菜单名称: ',
      attrs: {
        placeholder: '请输入菜单名称'
      }
    },
    {
      prop: 'parent_id',
      label: '父id: ',
      attrs: {
        placeholder: '请输入父id'
      },
      disabled: () => true,
      show: () => selectType.value === '1'
    },
    {
      type: 'select',
      prop: 'parent_id',
      label: '父id: ',
      options: [],
      show: () => selectType.value === '2'
    },
    {
      prop: 'path',
      label: '跳转路径: ',
      attrs: {
        placeholder: '请输入跳转路径'
      }
    },
    {
      type: 'slot',
      prop: 'icon',
      name: 'icon',
      label: '图标: '
    },
    {
      prop: 'sort',
      label: '排序: ',
      attrs: {
        placeholder: '请输入排序'
      }
    },
    {
      type: 'select',
      prop: 'hidden',
      label: '隐藏组件：',
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      type: 'select',
      prop: 'isRedirect',
      label: '组件重定向：',
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      type: 'checkbox',
      prop: 'role_char',
      label: '角色权限字符: ',
      show: () => false,
      options: []
    }
  ],
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: ['blur', 'change'] }],
    name: [{ required: true, message: '组件英文名不能为空', trigger: ['blur', 'change'] }],
    com_path: [{ required: true, message: '组件路径不能为空', trigger: ['blur', 'change'] }],
    title: [{ required: true, message: '组件名不能为空', trigger: ['blur', 'change'] }],
    sort: [{ required: true, message: '排序不能为空', trigger: ['blur', 'change'] }]
  }
})
const table = reactive({
  row: [],
  total: 0,
  tableColumns: [
    {
      prop: 'title',
      label: '菜单名称'
    },
    {
      prop: 'path',
      label: '路径'
    },
    {
      prop: 'parent_id',
      label: '类型',
      formatterFn(row: any, column: TableColumnCtx<any>, cellValue: any) {
        if (cellValue == 0) {
          return '目录'
        } else {
          return '菜单'
        }
      }
    },
    {
      prop: 'sort',
      label: '排序'
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
const apiParams = reactive({
  title: ''
})
const handleMenuData = (menus: any) => {
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
const getTableData = async () => {
  let res = await getAllMenu(apiParams)
  ;(table.row = handleMenuData(res.data.data.row)), (table.total = res.data?.data?.total || 0)
  let options = res.data.data.row
    .map((item: any) => {
      if (item.parent_id == 0 && item.name !== 'ErrorPage') {
        return {
          label: item.title,
          value: item.id
        }
      }
    })
    .filter((v: any) => v)

  addEditUserDialog.formItems[5].options = options
}
const getRoleData = async () => {
  let res = await getAllRole({ pageNum: 1, pageSize: 100 })
  let options = res.data.data.row.map((item: any) => ({
    label: item.role_dec,
    value: item.role_char
  }))
  addEditUserDialog.formItems[addEditUserDialog.formItems.length - 1].options = options
}
const handleEdit = (row: any) => {
  addEditUserDialog.visible = true
  addEditUserDialog.isAdd = false
  const role_char = row.role_char.split(',')
  nextTick(() => {
    addEditUserDialog.model = { ...row, role_char }
  })
}
const handleAdd = () => {
  addEditUserDialog.visible = true
  addEditUserDialog.isAdd = true
}
const save = async () => {
  addEditUserDialog.visible = false
  const role_char = addEditUserDialog.model.role_char.join(',')
  let res = await createAndEditMenu({ ...addEditUserDialog.model, role_char })
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
  let res = await delMenu({ id: Number(addEditUserDialog.id) })
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
const getIcon = () => {
  const icons = ['AddLocation', 'Aim', 'Apple', 'Bell', 'Calendar', 'HomeFilled', 'Grid', 'Headset']
  const _icons: any = icons.map((item: any) => ({
    value: item,
    label: item
  }))
  state.icons = _icons
}
const radioChange = (type: any) => {
  if (type === '2') {
    addEditUserDialog.model.parent_id = ''
  } else {
    addEditUserDialog.model.parent_id = 0
  }
}
// name
const name: any = localStorage.getItem('name')
addEditUserDialog.model.creator = `${JSON.parse(name)['name']}`
// 获取所有数据
getTableData()
// 获取角色数据
getRoleData()
// 获取到图标
getIcon()
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
}
.select-type {
  margin-left: 140px;
  margin-bottom: 30px;
}
</style>
