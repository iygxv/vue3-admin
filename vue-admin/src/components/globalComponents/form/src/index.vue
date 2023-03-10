<template>
  <el-form :model="model" :rules="rules" class="demo-ruleForm" :label-width="width" ref="appForm">
    <el-form-item
      v-for="(item, index) in formItems"
      :key="index"
      :label-width="item.width"
      :label="item.label"
      :prop="item.prop"
      v-show="typeof item.show === 'function' ? item.show() : true"
    >
      <!-- input框 -->
      <template
        v-if="
          !item.type ||
          item.type === 'input' ||
          item.type === 'number' ||
          item.type === 'textarea' ||
          item.type === 'password'
        "
      >
        <el-input
          v-model="model[item.prop]"
          v-bind="item.attrs"
          :type="item.type || 'input'"
          :disabled="typeof item.disabled === 'function' ? executeDisabledFn(item.disabled) : item.disabled"
          :clearable="isClearable(item.clearable)"
          size="small"
        ></el-input>
      </template>
      <!-- 选择框 -->
      <template v-if="item.type === 'select'">
        <el-select
          v-model="model[item.prop]"
          :clearable="isClearable(item.clearable)"
          :teleported="false"
          :disabled="typeof item.disabled === 'function' ? executeDisabledFn(item.disabled) : item.disabled"
          filterable
          size="small"
        >
          <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
        </el-select>
      </template>
      <!-- 单选框组 -->
      <template v-if="item.type === 'radio'">
        <el-radio-group v-model="model[item.prop]">
          <el-radio v-for="opt in item.options" :key="opt.value" :label="opt.value" :disabled="opt.disabled || false">{{
            opt.label
          }}</el-radio>
        </el-radio-group>
      </template>
      <!-- 多选框组 -->
      <template v-if="item.type === 'checkbox'">
        <el-checkbox-group v-model="model[item.prop]">
          <el-checkbox
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.value"
            :disabled="opt.disabled || false"
            >{{ opt.label }}</el-checkbox
          >
        </el-checkbox-group>
      </template>
      <!-- 级联选择 -->
      <template v-if="item.type === 'cascader'">
        <el-cascader
          v-model="model[item.prop]"
          :placeholder="item.placeholder"
          :options="item.options"
          :props="{
            checkStrictly: true,
            value: item.props.value,
            label: item.props.label
          }"
          clearable
        ></el-cascader>
      </template>
      <!-- 日期选择 -->
      <template v-if="item.type === 'datePicker'">
        <el-date-picker
          v-model="model[item.prop]"
          v-bind="item.attrs"
          :clearable="isClearable(item.clearable)"
          size="small"
        />
      </template>
      <!-- 插槽类型 -->
      <template v-if="item.type === 'slot'">
        <slot :name="item.name"> </slot>
      </template>
      <!-- 上传后续 -->
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppForm'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import { disabledFn } from '@/types/form'
import type { FormInstance } from 'element-plus'
const props = withDefaults(
  defineProps<{
    model: any
    formItems: any
    rules?: any
    width?: string | number
  }>(),
  {
    model: {},
    formItems: {},
    rule: {},
    width: 120
  }
)
const appForm = ref<FormInstance | null>(null)
const resetFrom = () => {
  appForm.value?.resetFields()
}
// 使用 <script setup> 语法糖的组件是默认关闭的，
// 也即通过模板 ref 或者 $parent 链获取到的组件的公开实例，
// 不会暴露任何在 <script setup> 中声明的绑定。
defineExpose({
  resetFrom
})
const isClearable = (clearable: unknown) => {
  if (clearable === true || clearable === undefined) return true
  return false
}

// 执行禁用中函数
const executeDisabledFn = (fn: disabledFn) => {
  return fn()
}
</script>

<style lang="scss" scoped>
::v-deep(.el-form-item) {
  margin-bottom: 10px;
  .el-select {
    width: 100%;
  }
  .el-form-item__content,
  .el-form-item__label {
    height: 100%;
  }

  &:last-child {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
