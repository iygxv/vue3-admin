<template>
  <div class="pagination">
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :background="true"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppPagination'
})
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    currentPage?: number
    pageSize?: number
    total?: number
  }>(),
  {
    currentPage: 1,
    pageSize: 10,
    total: 0
  }
)
// 声明触发的事件
const emit = defineEmits<{
  (e: 'SizeChange', val: number): void
  (e: 'CurrentChange', val: number): void
}>()
const handleSizeChange = (val: number) => {
  emit('SizeChange', val)
}
const handleCurrentPageChange = (val: number) => {
  emit('CurrentChange', val)
  window.scrollTo(0, 0)
}
</script>