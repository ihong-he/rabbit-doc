---
outline: [1, 3]
---
<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note4-1.png', 'note4-2.png'])

</script>
# 一级分类页

## 整体认识和页面渲染

<ImageView :imgArr="imgArr" :index="0" />

### 1. 准备分类组件

```vue
<script setup></script>

<template>
  <div class="top-category">我是分类</div>
</template>
```

### 2. 配置路由

```javascript{12-14}
import { createRouter, createWebHashHistory } from "vue-router";
import Category from "@/views/Category/index.vue";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout,
      children: [
        {
          path: "category/:id",
          name: "category",
          component: Category,
        },
      ],
    },
  ],
});

export default router;
```

### 3. 配置导航区域链接

```html
<li v-for="item in categoryStore.categoryList" :key="item.id">
  <RouterLink active-class="active" to="/"> // [!code --]
  <RouterLink active-class="active" :to="`/category/${item.id}`"> // [!code ++]
    {{ item.name }}
  </RouterLink>
</li>
```

## 面包屑导航渲染

### 1. 认识组件准备模版

```vue
<script setup></script>

<template>
  <div class="top-category">
    <div class="container m-top-20">
      <!-- 面包屑 -->
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>居家</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
...
</style>
```

### 2. 封装接口

```javascript
import request from "@/utils/request";

/**
 * @description: 获取分类数据
 * @param {*} id 分类id
 * @return {*}
 */
export const getTopCategoryAPI = (id) => {
  return request({
    url: "/category",
    params: {
      id,
    },
  });
};
```

### 3. 渲染面包屑导航

```vue
<script setup>
import { findTopCategoryAPI } from "@/apis/category";
const categoryData = ref({});
const route = useRoute();
const getCategory = async (id) => {
  // 如何在setup中获取路由参数 useRoute() -> route 等价于this.$route
  const res = await findTopCategoryAPI(id);
  categoryData.value = res.result;
};
getCategory(route.params.id);
</script>

<template>
  <div class="bread-container">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
```

## 分类 Banner 渲染

### 1. 封装接口

```javascript
/**
 * 获取首页轮播图数据的API函数
 * @param {Object} params - 请求参数对象
 * @param {string} [params.distributionSite="1"] - 标识，默认值为"1"，商品站点为"2"
 * @returns {Promise} 返回一个Promise对象，包含请求结果
 */
export function getBannerAPI(params = {}) {
  // 默认为1 商品为2
  const { distributionSite = "1" } = params;
  return httpInstance({
    url: "/home/banner",
    params: {
      distributionSite,
    },
  });
}
```

### 2. 迁移首页 Banner 逻辑

```vue
<script setup>
// 部分代码省略
import { getBannerAPI } from "@/apis/home";

// 获取banner
const bannerList = ref([]);

const getBanner = async () => {
  const res = await getBannerAPI({
    distributionSite: "2",
  });
  console.log(res);
  bannerList.value = res.result;
};

onMounted(() => getBanner());
</script>

<template>
  <div class="top-category">
    <div class="container m-top-20">
      <!-- 面包屑 -->
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 轮播图 -->
      <div class="home-banner">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <img :src="item.imgUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 部分代码省略
.home-banner {
  width: 1240px;
  height: 500px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 500px;
  }
}
</style>
```

## 导航激活&分类列表渲染

### 1. 导航激活状态设置

```vue
<RouterLink
  active-class="active"
  :to="`/category/${item.id}`"
>{{ item.name }}</RouterLink>
```

### 2. 分类数据模版

```html
<div class="sub-list">
  <h3>全部分类</h3>
  <ul>
    <li v-for="i in categoryData.children" :key="i.id">
      <RouterLink to="/">
        <img :src="i.picture" />
        <p>{{ i.name }}</p>
      </RouterLink>
    </li>
  </ul>
</div>
<div class="ref-goods" v-for="item in categoryData.children" :key="item.id">
  <div class="head">
    <h3>- {{ item.name }}-</h3>
  </div>
  <div class="body">
    <GoodsItem v-for="good in item.goods" :goods="good" :key="good.id" />
  </div>
</div>
```

## 路由缓存问题解决

> 缓存问题：当路由 path 一样，参数不同的时候会选择直接复用路由对应的组件，参考[带参数的动态路由匹配](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html)

- 解决方案：

1.  给 `routerv-view` 添加 key 属性，破坏缓存

```vue{7}
<template>
  <!-- 吸顶导航组件 -->
  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
   <!-- 添加key，破坏路由缓存机制 -->
  <RouterView /> // [!code --]
  <RouterView :key="$route.fullPath"/> // [!code ++]
  <LayoutFooter />
</template>

```

2.  使用`onBeforeRouteUpdate`钩子函数，做精确更新

```vue
<script setup>
import { onBeforeRouteUpdate } from "vue-router";
// 在路由发生变化时调用
onBeforeRouteUpdate((to) => {
  // 发起数据请求
  getCategory(to.params.id);
});
</script>
```

## 基于业务逻辑的函数拆分

> 基本思想：把组件内独立的业务逻辑通过 `useXXX` 函数做封装处理，在组件中做组合使用

<ImageView :imgArr="imgArr" :index="1" />

- 分类逻辑

```javascript
// 封装分类数据业务相关代码
import { onMounted, ref } from "vue";
import { getCategoryAPI } from "@/apis/category";
import { useRoute } from "vue-router";
import { onBeforeRouteUpdate } from "vue-router";

export function useCategory() {
  // 获取分类数据
  const categoryData = ref({});
  const route = useRoute();
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id);
    categoryData.value = res.result;
  };
  onMounted(() => getCategory());

  // 目标:路由参数变化的时候 可以把分类数据接口重新发送
  onBeforeRouteUpdate((to) => {
    // 存在问题：使用最新的路由参数请求最新的分类数据
    getCategory(to.params.id);
  });
  return {
    categoryData,
  };
}
```

- Banner逻辑

```javascript
// 封装banner轮播图相关的业务代码
import { ref, onMounted } from "vue";
import { getBannerAPI } from "@/apis/home";

export function useBanner() {
  const bannerList = ref([]);

  const getBanner = async () => {
    const res = await getBannerAPI({
      distributionSite: "2",
    });
    console.log(res);
    bannerList.value = res.result;
  };

  onMounted(() => getBanner());

  return {
    bannerList,
  };
}
```

- 逻辑整合

```vue
<script setup>
import GoodsItem from "../Home/components/GoodsItem.vue";
import { useBanner } from "./composables/useBanner";
import { useCategory } from "./composables/useCategory";
const { bannerList } = useBanner();
const { categoryData } = useCategory();
</script>
```
