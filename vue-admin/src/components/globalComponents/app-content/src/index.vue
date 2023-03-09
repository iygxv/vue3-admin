<template>
  <div class="app-content">
    <div class="title">{{ title }}</div>
    <div class="app-content-border">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppContent'
})
</script>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.app-content {
  min-height: 100%;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  .title {
    font-size: 22px;
    margin-bottom: 20px;
  }
  &-border {
    border: 1px solid #ebeef5;
  }
}
</style>
