---
outline: [1, 3]
---
<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note3-1.png', 'note3-2.png', 'note3-3.png'])

</script>
# Home页

## 整体认识和页面渲染

<ImageView :imgArr="imgArr" :index="0" />

### 1. 整体结构搭建

<ImageView :imgArr="imgArr" :index="1" />

1- 按照结构新增五个组件，准备最简单的模版，分别在Home模块的入口组件中引入

- HomeCategory
- HomeBanner
- HomeNew
- HomeHot
- HomeProduct
```vue
<script setup>
</script>

<template>
  <div> HomeCategory </div>
</template>
```

2- Home模块入口组件中引入并渲染
```vue
<script setup>
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
import homeProduct from './components/HomeProduct.vue'
</script>

<template>
  <div class="container">
    <HomeCategory />
    <HomeBanner />
  </div>
  <HomeNew />
  <HomeHot />
  <homeProduct />
</template>
```
### 2. 左侧分类

- 代码实现

```vue
<script setup>
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

</script>

<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in categoryStore.categoryList" :key="item.id">
        <RouterLink to="/">{{ item.name }}</RouterLink>
        <RouterLink v-for="i in item.children.slice(0, 2)" :key="i" to="/">{{ i.name }}</RouterLink>
        <!-- 弹层layer位置 -->
        <div class="layer">
          <h4>分类推荐 <small>根据您的购买或浏览记录推荐</small></h4>
          <ul>
            <li v-for="i in item.goods" :key="i.id">
              <RouterLink to="/">
                <img :src="i.picture" alt="" />
                <div class="info">
                  <p class="name ellipsis-2">
                    {{ i.name }}
                  </p>
                  <p class="desc ellipsis">{{ i.desc }}</p>
                  <p class="price"><i>¥</i>{{ i.price }}</p>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
```
## banner轮播图实现

### 1. 封装接口
```javascript
/**
 * @description: 获取banner图
 * @param {*}
 * @return {*}
 */
import  httpInstance  from '@/utils/http'
function getBannerAPI (){
  return httpInstance({
    url:'home/banner'
  })
}
```
### 2. 获取数据并渲染
```vue
<script setup>
import { getBannerAPI } from '@/apis/home'
import { onMounted, ref } from 'vue'

const bannerList = ref([])
// 获取banner数据
const getBanner = async () => {
  const res = await getBannerAPI()
  console.log(res)
  bannerList.value = res.result
}

onMounted(() => getBanner())

</script>



<template>
  <div class="home-banner">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

```
## 面板组件封装

### 1. 代码实现
```vue
<script setup>
// 接收父组件传递的参数
defineProps({
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <div class="home-panel">
    <div class="container">
      <div class="head">
        <!-- 主标题和副标题 -->
        <h3>
          {{ title }}<small>{{ subTitle }}</small>
        </h3>
      </div>
      <!-- 主体内容区域 -->
      <slot name="main" />
    </div>
  </div>
</template>

<style scoped lang='scss'>
...
</style>
```
## 新鲜好物实现

### 1. 封装接口
```javascript
/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
  return httpInstance({
    url:'/home/new'
  })
}
```

### 2. 获取数据并渲染 
```vue
<script setup>
import HomePanel from './HomePanel.vue'
import { getNewAPI } from '@/apis/home'
import { ref } from 'vue'
const newList = ref([])
const getNewList = async () => {
  const res = await getNewAPI()
  newList.value = res.result
}

getNewList()
</script>

<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <template #main>
      <ul class="goods-list">
        <li v-for="item in newList" :key="item.id">
          <RouterLink :to="`/detail/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </HomePanel>
</template>
```
## 人气推荐实现

同上

## 懒加载指令实现

<ImageView :imgArr="imgArr" :index="2" />

### 1. 封装全局指令
```javascript
// @/directives/index.js
// 定义懒加载插件
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  // 全局指令的配置对象
  install (app) {
    // 自定义指令逻辑
    app.directive('img-lazy', {
      mounted (el, binding) {
        // el: 指令绑定的那个元素 img
        // binding: binding.value  需要绑定的表达式的值  图片url
        console.log(el, binding.value)
        // 懒加载指令逻辑
        const { stop } = useIntersectionObserver(
          el,
          ([{ isIntersecting }]) => {
            console.log(isIntersecting)
            if (isIntersecting) {
              // 进入视口区域
              el.src = binding.value
              // 停止监听，优化性能
              stop()
            }
          },
        )
      }
    })
  }
}
```
### 2. 注册全局指令
```javascript
// 全局指令注册
import { directivePlugin } from '@/directives'
app.use(directivePlugin)
```

## Product产品列表实现
### 1. 基础数据渲染
1- 准备静态模版
```vue
<script setup>
import HomePanel from './HomePanel.vue'

</script>

<template>
  <div class="home-product">
    <!-- <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
      <div class="box">
        <RouterLink class="cover" to="/">
          <img :src="cate.picture" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="good in cate.goods" :key="good.id">
            <RouterLink to="/" class="goods-item">
              <img :src="good.picture" alt="" />
              <p class="name ellipsis">{{ good.name }}</p>
              <p class="desc ellipsis">{{ good.desc }}</p>
              <p class="price">&yen;{{ good.price }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </HomePanel> -->
  </div>
</template>

<style scoped lang='scss'>
...
</style>
```
2- 封装接口
```javascript
/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}
```
3- 获取并渲染数据
```vue
<script setup>
import HomePanel from './HomePanel.vue'
import { getGoodsAPI } from '@/apis/home'
import { ref } from 'vue'
const goodsProduct = ref([])
const getGoods = async () => {
  const { result } = await getGoodsAPI()
  goodsProduct.value = result
}
onMounted( ()=> getGoods() )
</script>

<template>
  <div class="home-product">
    <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
      <div class="box">
        <RouterLink class="cover" to="/">
          <img :src="cate.picture" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="goods in cate.goods" :key="good.id">
            <RouterLink to="/" class="goods-item">
              <img :src="goods.picture" alt="" />
              <p class="name ellipsis">{{ goods.name }}</p>
              <p class="desc ellipsis">{{ goods.desc }}</p>
              <p class="price">&yen;{{ goods.price }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>
```
### 2. 图片懒加载
```html{6}
<div class="home-product">
  <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
    <div class="box">
      <RouterLink class="cover" to="/">
        <!-- 指令替换 -->
        <img v-img-lazy="cate.picture" />
      </RouterLink>
      <ul class="goods-list">
        <li v-for="goods in cate.goods" :key="goods.id">
          <RouterLink to="/" class="goods-item">
             <!-- 指令替换 -->
            <img v-img-lazy="goods.picture" alt="" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </HomePanel>
</div>
```
## GoodsItem组件封装
### 1. 封装组件
```vue

<script setup>
defineProps({
  goods: {
    type: Object,
    default: () => { }
  }
})
</script>

<template>
  <RouterLink to="/" class="goods-item">
    <img :src="goods.picture" alt="" />
    <p class="name ellipsis">{{ goods.name }}</p>
    <p class="desc ellipsis">{{ goods.desc }}</p>
    <p class="price">&yen;{{ goods.price }}</p>
  </RouterLink>
</template>


<style scoped lang="scss">
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  transition: all .5s;

  &:hover {
    transform: translate3d(0, -3px, 0); // 3D效果
    box-shadow: 0 3px 8px rgb(0 0 0 / 20%); // 阴影
  }
  ...
}
</style>
```
### 2. 使用组件
```html
<ul class="goods-list">
  <li v-for="goods in cate.goods" :key="item.id">
    <GoodsItem :goods="goods" />
  </li>
</ul>
```


