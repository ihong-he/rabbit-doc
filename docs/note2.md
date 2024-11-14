---
outline: [1, 3]
---
<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref([ 'note2-2.png', 'note2-1.png'])

</script>
# Layout布局

## Layout页面搭建

<ImageView :imgArr="imgArr" :index="0" />

### 1. Nav部分

```vue
<script setup>

</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="true">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>周杰伦</a></li>
          <li>
            <el-popconfirm title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          <li><a href="javascript:;">我的订单</a></li>
          <li><a href="javascript:;">会员中心(个人中心)</a></li>
        </template>
        <template v-else>
          <li><a href="javascript:;">请先登录</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          // 使用sass颜色变量
          color: $xtxColor;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
```

### 2. Header部分

```vue
<script setup>

</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>
      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li> <RouterLink to="/">居家</RouterLink> </li>
        <li> <RouterLink to="/">美食</RouterLink> </li>
        <li> <RouterLink to="/">服饰</RouterLink> </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 头部购物车 -->
      
    </div>
  </header>
</template>


<style scoped lang='scss'>
...
</style>
```

### 3. Footer部分
```vue
<template>
  <footer class="app_footer">
    <!-- 联系我们 -->
    <div class="contact">
      <div class="container">
        <dl>
          <dt>客户服务</dt>
          <dd><i class="iconfont icon-kefu"></i> 在线客服</dd>
          <dd><i class="iconfont icon-question"></i> 问题反馈</dd>
        </dl>
        <dl>
          <dt>关注我们</dt>
          <dd><i class="iconfont icon-weixin"></i> 公众号</dd>
          <dd><i class="iconfont icon-weibo"></i> 微博</dd>
        </dl>
        <dl>
          <dt>下载APP</dt>
          <dd class="qrcode"><img src="@/assets/images/qrcode.jpg" /></dd>
          <dd class="download">
            <span>扫描二维码</span>
            <span>立马下载APP</span>
            <a href="javascript:;">下载页面</a>
          </dd>
        </dl>
        <dl>
          <dt>服务热线</dt>
          <dd class="hotline">400-0000-000 <small>周一至周日 8:00-18:00</small></dd>
        </dl>
      </div>
    </div>
    <!-- 其它 -->
    <div class="extra">
      <div class="container">
        <div class="slogan">
          <a href="javascript:;">
            <i class="iconfont icon-footer01"></i>
            <span>价格亲民</span>
          </a>
          <a href="javascript:;">
            <i class="iconfont icon-footer02"></i>
            <span>物流快捷</span>
          </a>
          <a href="javascript:;">
            <i class="iconfont icon-footer03"></i>
            <span>品质新鲜</span>
          </a>
        </div>
        <!-- 版权信息 -->
        <div class="copyright">
          <p>
            <a href="javascript:;">关于我们</a>
            <a href="javascript:;">帮助中心</a>
            <a href="javascript:;">售后服务</a>
            <a href="javascript:;">配送与验收</a>
            <a href="javascript:;">商务合作</a>
            <a href="javascript:;">搜索推荐</a>
            <a href="javascript:;">友情链接</a>
          </p>
          <p>CopyRight © 小兔鲜儿</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang='scss'>
...
</style>
```

### 4. Layout整体
```vue
<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <!-- 二级路由入口-主体内容区域 -->
  <RouterView />
  <LayoutFooter />
</template>
```

## 字体图标渲染
> 字体图标采用的是阿里的字体图标库，样式文件已经准备好，在 `index.html`文件中引入即可

```html
  <!-- 引入iconfont -->
  <link rel="stylesheet" href="//at.alicdn.com/t/font_2143783_iq6z4ey5vu.css">
  <!-- 使用iconfont -->
  <i class="iconfont icon-kefu"></i>
```
- 字体图标使用font-class引用，具体可参照[iconfont-帮助中心](https://www.iconfont.cn/help/detail?spm=a313x.help_detail.i1.d8d11a391.5b5c3a811LkT4P&helptype=code)

## 一级导航渲染

<ImageView :imgArr="imgArr" :index="1" />

**实现步骤**

1. 封装接口函数
2. 调用接口函数
3. `v-for`渲染模版

**示例代码**
```javascript
// /apis/layout.js
import httpInstance from '@/utils/http'

// 获取一级导航数据
export function getCategoryAPI () {
  return httpInstance({
    url: '/home/category/head'
  })
}
```
```vue
<script setup>
  // 导入接口函数
  import { getCategoryAPI } from '@/apis/layout'
  import { onMounted, ref } from 'vue'
  const categoryList = ref([])
  // 获取一级导航数据
  const getCategory = async () => {
    // 1.调用接口函数
    const res = await getCategoryAPI()
    // 2.保存数据
    categoryList.value = res.result
  }

  onMounted(() => getCategory())

</script>

<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">小兔鲜</RouterLink>
      </h1>
      <ul class="app-header-nav">
        <!-- 循环遍历一级导航数据 -->
        <li class="home" v-for="item in categoryList" :key="item.id">
          <!-- 跳转路由 -->
          <RouterLink to="/">{{ item.name }}</RouterLink>
        </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
        </div>
      <!-- 头部购物车 -->
    </div>
  </header>
</template>
```
## 吸顶导航交互实现
> 网站吸顶导航是一种网页设计技术，指的是当用户向下滚动页面时，页面顶部的导航栏会固定在屏幕的顶部，不会随着页面的滚动而消失。
### 1. 准备吸顶导航组件
```vue
<!-- Layout/components/LayoutFixed.vue -->
<script setup>

</script>

<template>
  <div class="app-header-sticky">
    <div class="container">
      <RouterLink class="logo" to="/" />
      <!-- 导航区域 -->
      <ul class="app-header-nav ">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li>
          <RouterLink to="/">居家</RouterLink>
        </li>

        ......

      </ul>

      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 此处为关键样式!!!
  // 状态一：往上平移自身高度 + 完全透明
  transform: translateY(-100%);
  opacity: 0;

  // 状态二：移除平移 + 完全不透明
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }
  ...
}

...

</style>
```

### 2. 实现吸顶交互
> 核心逻辑：根据滚动距离判断当前show类名是否显示，大于78显示，小于78，不显示

- 安装 [vueuse](https://vueuse.org/) 包

```npm
  npm i @vueuse/core
```
- 使用vueuse中的 [useScroll](https://vueuse.org/core/useScroll/) 获取滚动位置

```vue
<script setup>
// vueUse
import { useScroll } from '@vueuse/core'
const { y } = useScroll(window)
</script>

<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <!-- 省略部分代码 -->
  </div>
</template>
```
## Pinia优化重复请求

> 普通导航和吸顶导航会分别调用导航分类接口，会在同一页面重复请求两次

解决步骤：

- 使用store进行导航列表的数据管理

```javascript
// /stores/category.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from '@/apis/layout'
export const useCategoryStore = defineStore('category', () => {
  // 导航列表的数据管理
  // state 导航列表数据
  const categoryList = ref([])

  // action 获取导航数据的方法
  const getCategory = async () => {
    const res = await getCategoryAPI()
    categoryList.value = res.result
  }

  return {
    categoryList,
    getCategory
  }
})
```

- 在Layout调用获取导航数据的方法

```vue
<script setup>
import { useCategoryStore } from '@/stores/category'
import { onMounted } from 'vue'
// 引入store实例
const categoryStore  = useCategoryStore()

onMounted(() => {
  // 执行action方法
  categoryStore.getCategoryList()
})
</script>
```

- 在普通导航和吸顶导航中获取categoryList数据

```vue
<script setup>
import { useCategoryStore } from '@/stores/category'
// 引入store实例
const categoryStore  = useCategoryStore()
</script>
<template>
  <div class="app-header-sticky">
    <div class="container">
      <RouterLink class="logo" to="/" />
      <!-- 导航区域 -->
      <ul class="app-header-nav">
        <li v-for="item in categoryStore.categoryList" :key="item.id">
          <RouterLink to="/">{{ item.name }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
```

