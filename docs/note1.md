---
outline: [1, 3]
---
<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note1-1.png', 'note1-2.png', 'note1-3.png', 'note1-4.png', 'note1-5.png'])

</script>
# 项目起步

## 项目介绍

> 小兔鲜儿电商项目网页端前台

<ImageView :imgArr="imgArr" :index="0" />
<ImageView :imgArr="imgArr" :index="1" />
<ImageView :imgArr="imgArr" :index="2" />

## 创建项目并整理目录

```bash
npm init vue@latest
```

<ImageView :imgArr="imgArr" :index="3" />

## 配置别名路径
> 配置别名路径可以在写代码时联想提示路径

```json
// jsconfig.json
{
  "compilerOptions" : {
    "baseUrl" : "./",
    "paths" : {
      "@/*":["src/*"]
    }
  }
}
```
⚠️ 因`create-vue`版本不同会有差异，新版本可能会主动生成
## elementPlus引入
### 1. 安装elementPlus
```bash
npm install element-plus --save
npm install -D unplugin-vue-components unplugin-auto-import
```
### 2. 配置按需导入
```javascript
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
  plugins: [
    // 配置插件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ]
})
```
### 3. 测试组件
```vue
<template>
  <el-button type="primary">i am button</el-button>
</template>
```
## 自定义elementPlus主题

> Element Plus 默认提供一套主题，CSS 命名采用 BEM 的风格，方便使用者覆盖样式。如果需要大规模替换样式，可以通过 [SCSS 变量](https://element-plus.org/zh-CN/guide/theming.html) 处理

### 1. 安装sass
> 基于vite的项目默认不支持css预处理器，需要开发者单独安装

```bash
npm i sass -D
```
### 2. 引入scss文件

> theme-chalk 使用SCSS编写而成。你可以在 `packages/theme-chalk/src/common/var.scss` 文件中查找SCSS变量

```scss
// styles/element/index.scss
/* 自定义element-plus主题色 */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      // 主色
      'base': #27ba9b,
    ),
    'success': (
      // 成功色
      'base': #1dc779,
    ),
    'warning': (
      // 警告色
      'base': #ffb302,
    ),
    'danger': (
      // 危险色
      'base': #e26237,
    ),
    'error': (
      // 错误色
      'base': #cf4444,
    ),
  )
)
```
### 3. 自动导入配置
> 如果你正在使用vite，并且你想在按需导入时自定义主题。使用 scss.additionalData 来编译所有应用 scss 变量的组件。

```javascript{22,36}
// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 按需导入配置
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        // 1. 配置elementPlus采用sass样式配色系统
        ElementPlusResolver({ importStyle: "sass" }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 2. 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `,
      }
    }
  }
})
```
⚠️ 新版本`sass`和`element-plus`可能会有兼容性问题

## Axios请求配置
> Axios 是一个基于 promise 网络请求库，作用于node.js 和浏览器中

### 1. 安装axios
```bash
npm i axios
```
### 2. 基础配置
- 官方文档地址：[https://axios-http.com/zh/docs/intro](https://axios-http.com/zh/docs/intro)

- 基础配置通常包括：
  1. 实例化 - baseURL + timeout
  2. 拦截器 - 请求携带token 及响应401拦截等

```javascript
// utils/http.js
import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 5000
})

// axios请求拦截器
instance.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
instance.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e)
})


export default instance
```
### 3. 封装请求函数

```javascript
// /apis/...
import http from '@/utils/http'

export function getCategoryAPI () {
  return http({
    url: 'home/category/head'
  })
}
```
## 路由整体设计
> 路由设计原则：根据页面的切换方式设计
- 如果是整体切换，则为一级路由
- 如果是在一级路由的内部进行的内容切换，则为二级路由
```html
<template>
  我是登录页
</template>
```

```html
<template>
  我是首页
</template>
```

```html
<template>
  我是home
</template>
```

```html
<template>
  我是分类
</template>
```
```javascript
// router/index.js

// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component对应关系的位置
  routes: [
    {
      // 一级路由
      path: '/',
      component: Layout,
      // 二级路由
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: 'category',
          component: Category
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

export default router
```
## 静态资源及VSCode插件
### 1. 静态资源引入
- 图片资源 - 把 images 文件夹放到 assets 目录下
- 样式资源 - 把 common.scss 文件放到 styles 目录下

### 2. Error Lens插件安装
> Error Lens插件会自动进行错误、警告和其他语言诊断的突出显示。

<ImageView :imgArr="imgArr" :index="4" />

## scss全局变量自动导入

>在var.scss中定义全局通用的sass颜色变量及其它sass变量

```scss
// @/styles/var.scss
$xtxColor: #27ba9b;
$helpColor: #e26237;
$sucColor: #1dc779;
$warnColor: #ffb302;
$priceColor: #cf4444;
```
```json{7}
css: {
    preprocessorOptions: {
      scss: {
        // 自动导入scss文件
        additionalData: `
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
      }
    }
}
```

