<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li class="tags-li" v-for="(item, index) in tagsList" :class="{ 'active': isActive(item) }" :key="index">
        <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
        <span class="tags-li-icon" @click="closeTags(item)">
          <el-icon><close-bold /></el-icon>
        </span>
      </li>
    </ul>
    <div class="tags-close-box" v-if="tagsList.length >= 8">
      <el-dropdown @command="handleTags">
        <el-button size="small" type="primary">
          标签选项
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { TagView, } from '@/store/modules/tagsView/state'
const route = useRoute();
const router = useRouter();
const isActive = (item: TagView) => {
  return item.path === route.fullPath;
};
const toLastView = (tagsList: TagView[]) => {
  // 获取到tagsList中最后一个
  const latestView = tagsList.slice(-1)[0]
  if (latestView !== undefined && latestView.fullPath !== undefined) { // 存在最后一个
    router.push(latestView.fullPath)
  } else {
    router.push('/')
  }
}
const tagsViewStore = useTagsViewStore();
const tagsList = computed(() => tagsViewStore.tagsList);


const showTags = computed(() => tagsList.value.length > 0);

// 关闭单个标签
const closeTags = (route: TagView) => {
  tagsViewStore.delView(route)
  if (isActive(route)) {
    // 删除的是当前的active
    toLastView(tagsList.value)
  }
};

// 设置标签
const setTags = (route: TagView) => {
  tagsViewStore.addView(route)
};
// 初始页面添加当前路由
setTags(route);
onBeforeRouteUpdate((to) => {
  setTags(to);
});

// 关闭全部标签
const closeAll = () => {
  tagsViewStore.delAllViews()
  toLastView(tagsList.value)
};
// 关闭其他标签
const closeOther = (route: TagView) => {
  tagsViewStore.delOthersViews(route)
};
const handleTags = (command: string) => {
  command === "other" ? closeOther(route) : closeAll();
};

</script>


<style>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
  border: 1px solid #409eff;
  background-color: #409eff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tags-li-icon i {
  height: 100%;
}
</style>
