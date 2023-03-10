<template>
  <el-table
    ref="table"
    :data="data"
    :cell-class-name="cellClassName"
    :header-cell-class-name="headerCellClassName"
    v-bind="$attrs"
  >
    <template v-for="(col, index) in columns">
      <!-- index -->
      <el-table-column
        v-if="col.type === 'index'"
        type="index"
        :width="col.width || 60"
        :key="index"
        :index="col.index"
        :label="col.label"
      >
      </el-table-column>
      <!-- selection -->
      <el-table-column
        v-else-if="col.type === 'selection'"
        type="selection"
        :width="col.width || 60"
        :selectable="col.selectableFn"
      >
      </el-table-column>
      <!-- 插槽 -->
      <el-table-column v-else-if="'slot' in col" :width="col.width" :label="col.label" v-bind="col.attrs">
        <template #default="{ row, column, $index }">
          <slot :row="row" :column="column" :index="$index" :name="col.slot"></slot>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :width="col.width"
        :prop="col.prop"
        :label="col.label"
        :formatter="col.formatterFn"
        v-bind="col.attrs"
      >
      </el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppTable'
})
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    data: Array<any>
    columns: Array<any>
    cellClassName?: string | Function
    headerCellClassName?: string | Function
    width?: string | number
  }>(),
  {
    data: () => [],
    columns: () => [],
    cellClassName: 'is-center',
    headerCellClassName: 'is-center',
    width: 120
  }
)
</script>

<style lang="scss" scoped></style>
