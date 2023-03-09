<template>
  <div class="content-box" :class="{ 'content-collapse': collapse }">
    <tagsView></tagsView>
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, } from 'vue'
import { useSettingStore } from '@/store/modules/settings'
import { useTagsViewStore } from "@/store/modules/tagsView";
import tagsView from './tags_view/index.vue'
const settingStore = useSettingStore()
const tagsViewStore = useTagsViewStore();
const tagsList = computed(() => tagsViewStore.tagsList);
const collapse = computed(() => settingStore.collapse);
</script>

<style lang="scss" scoped>
</style>
