---
outline: [1, 3]
---

<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note5-1.png'])

</script>

# 二级分类

## 整体认识和页面渲染

<ImageView :imgArr="imgArr" :index="0" />

### 1. 准备组件模版

```vue
<script setup></script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">居家 </el-breadcrumb-item>
        <el-breadcrumb-item>居家生活用品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs>
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body">
        <!-- 商品列表-->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
...
</style>
```

### 2. 配置路由

```javascript
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/views/Layout/index.vue";
import SubCategory from "@/views/SubCategory/index.vue";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout,
      children: [
        {
          path: "category/sub/:id",
          name: "subCategory",
          component: SubCategory,
        },
      ],
    },
  ],
});

export default router;
```

### 3. 跳转配置

```html
<div class="sub-list">
  <h3>全部分类</h3>
  <ul>
    <li v-for="i in categoryData.children" :key="i.id">
      <RouterLink :to="`/category/sub/${i.id}`">
        <img :src="i.picture" />
        <p>{{ i.name }}</p>
      </RouterLink>
    </li>
  </ul>
</div>
```

## 面包屑导航实现

### 1. 准备接口

```javascript
/**
 * @description: 获取二级分类列表数据
 * @param {*} id 分类id
 * @return {*}
 */

export const getCategoryFilterAPI = (id) => {
  return request({
    url: "/category/sub/filter",
    params: {
      id,
    },
  });
};
```

### 2. 获取数据渲染模版

```vue
<script setup>
import { getCategoryFilterAPI } from "@/apis/category";
// 获取面包屑导航数据
const filterData = ref({});
const getFilterData = async () => {
  const res = await getCategoryFilterAPI(route.params.id);
  filterData.value = res.result;
};
getFilterData();
</script>

<template>
  <div class="bread-container">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/category/${filterData.parentId}` }">
        {{ filterData.parentName }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ filterData.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
```

## 分类基础列表实现

### 1. 准备接口

```javascript
/**
 * @description: 获取分类导航数据
 * @data { 
     categoryId: 1005000 ,
     page: 1,
     pageSize: 20,
     sortField: 'publishTime' | 'orderNum' | 'evaluateNum'
   } 
 * @return {*}
 */
export const getSubCategoryAPI = (data) => {
  return request({
    url: "/category/goods/temporary",
    method: "POST",
    data,
  });
};
```

### 2. 获取数据列表

```vue
<script setup>
// 获取基础列表数据渲染
const goodList = ref([]);
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: "publishTime",
});

const getGoodList = async () => {
  const res = await getSubCategoryAPI(reqData.value);
  console.log(res);
  goodList.value = res.result.items;
};

onMounted(() => getGoodList());
</script>
```

## 列表筛选实现

> 思路：tab 组件切换时修改 reqData 中的 sortField 字段，重新拉取接口列表

```vue
<script setup>
// tab切换回调
const tabChange = (val) => {
  reqData.value.sortField = val; // 筛选条件
  reqData.value.page = 1;
  getGoodList();
};
</script>

<template>
  <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
    <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
    <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
    <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
  </el-tabs>
</template>
```

## 无限加载实现

> 基础思路
> 1. [v-infinite-scroll](https://element-plus.org/zh-CN/component/infinite-scroll.html) 监听滚动事件，判断是否触底
> 2. 触底条件满足之后 page++，拉取下一页数据
> 3. 新老数据做数组拼接
> 4. 判断是否已经全部加载完毕，停止监听

```vue
<template>
  <!-- 监听滚动 -->
  <div
    class="body"
    v-infinite-scroll="load"
    :infinite-scroll-disabled="disabled"
  >
    <!-- 商品列表-->
    <GoodsItem v-for="item in goodList" :good="item" />
  </div>
</template>
<script>
// 加载更多
const disabled = ref(false);
const load = async () => {
  // 获取下一页的数据
  reqData.value.page++;
  const res = await getSubCategoryAPI(reqData.value);
  goodList.value = [...goodList.value, ...res.result.items];
  // 加载完毕 停止监听
  if (res.result.items.length === 0) {
    disabled.value = true;
  }
};
</script>
```

## 路由滚动优化

```js
const router = createRouter({
  // 更新路由自动滚动到顶部
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});
```
