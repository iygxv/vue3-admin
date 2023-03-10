<template>
  <app-content :title="'测试table组件'">
    <app-table :data="tableData" :columns="tableColumns">
      <template #handle="{ row }">
        <el-button type="primary" size="small">删除</el-button>
        <el-button type="danger" size="small">删除</el-button>
      </template>
    </app-table>
    <app-pagination
        :current-page="1"
        :page-size="10"
        :total="40"
        @size-change="getList"
        @current-change="getList" />
  </app-content>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { columnsProp } from '@/types/columns'
const tableData = reactive([
  {
    like: 'coding',
    type: 1
  },
  {
    like: 'coding',
    type: 1
  },
  {
    like: 'coding',
    type: 1
  },
  {
    like: 'coding',
    type: 1
  },
  {
    like: 'coding',
    type: 1
  }
])
const tableColumns = reactive<columnsProp[]>([
  {
    prop: 'like',
    label: '喜欢'
  },
  {
    prop: 'type',
    label: '选择',
    formatterFn(row: columnsProp[], column: columnsProp, cellValue: any) {
      if (cellValue === 0) {
        return '否'
      } else if (cellValue === 1) {
        return '是'
      }
    }
  },
  {
    slot: 'handle',
    label: '操作'
  }
])
const getList = (val: number) => {
  console.log(val);
}
</script>

<style lang="scss" scoped>
//斑马纹表格背景色
::v-deep(.el-table) .even-row {
  --el-table-tr-background-color: #f5fafb;
}

::v-deep(.el-table) .odd-row {
  --el-table-tr-background-color: #ffffff;
}
</style>
