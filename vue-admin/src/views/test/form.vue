<template>
  <app-content :title="'测试form组件'">
    <app-form :formItems="formItems" :model="model" ></app-form>
  </app-content>
</template>

<script setup lang="ts">
import { formItemProp } from '@/types/form'
import { reactive, watch, ref } from 'vue'
const model = reactive({
  user_name: null,
  num: null,
  textarea_name: null,
  isFree: 1,
  time: null,
  is_good: 1,
  like: []
})
const formItems = reactive<formItemProp[]>([
  {
    type: 'input',
    prop: 'user_name',
    label: '用户名',
    attrs: {
      placeholder: '请输入用户名'
    }
  },
  {
    type: 'number',
    prop: 'num',
    label: '数字类型',
     attrs: {
      placeholder: '请输入数字类型'
    }
  },
  {
    type: 'textarea',
    prop: 'textarea_name',
    label: '用户名',
    attrs: {
      placeholder: '请输入文本域类型'
    }
  },
  {
    type: 'select',
    prop: 'isFree',
    label: '是否免费：',
    disabled: () => true,
    options: [
      {
        label: '免费',
        value: 1
      },
      {
        label: '付费',
        value: 0
      }
    ]
  },
  {
    type: 'datePicker',
    prop: 'time',
    label: '时间：',
    attrs: {
      type: 'datetime',
      placeholder: '请选择时间',
      format: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    type: 'radio',
    label: '是否good',
    prop: 'is_good',
    options: [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
  },
  {
    type: 'checkbox',
    label: '喜欢',
    prop: 'like',
    options: [
      {
        label: '编码',
        value: 'coding'
      },
      {
        label: '读书',
        value: 'reading'
      }
    ]
  }
])
watch(() => model, () => model,  { deep: true })

</script>

<style lang="scss" scoped></style>
