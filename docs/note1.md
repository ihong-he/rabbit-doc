---
outline: [1, 3]
---
# 项目起步

## 创建项目并整理目录

```bash
npm init vue@latest
```

![image.png](/note/note1-1.png)

## 配置别名路径
> 配置别名路径可以在写代码时联想提示路径

```json
{
  "compilerOptions" : {
    "baseUrl" : "./",
    "paths" : {
      "@/*":["src/*"]
    }
  }
}
```
⚠️ 因`create-vue`版本不同会有差异，新版本可能无需配置
## elementPlus引入
### 1. 安装elementPlus和自动导入插件
```bash
npm install element-plus --save
npm install -D unplugin-vue-components unplugin-auto-import
```
### 2. 配置自动按需导入
```javascript
// 引入插件
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
## 定制elementPlus主题
### 1. 安装sass
> 基于vite的项目默认不支持css预处理器，需要开发者单独安装

```bash
npm i sass -D
```
### 2. 准备定制化的样式文件
```javascript
/* 只需要重写你需要的即可 */
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
> 这里自动导入需要深入到elementPlus的组件中，按照官方的配置文档来
> 1. 自动导入定制化样式文件进行样式覆盖
> 2. 按需定制主题配置 （需要安装 unplugin-element-plus）

```javascript
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
⚠️ 因目前`sass`和`element-plus`有兼容性问题，在控制台会有警告信息

## axios安装及封装
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
import axios from 'axios'

// 创建axios实例
const http = axios.create({
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


export default http
```
### 3. 封装请求函数
```javascript
import http from '@/utils/http'

export function getCategoryAPI () {
  return http({
    url: 'home/category/head'
  })
}
```
## 路由整体设计
> 路由设计原则：找页面的切换方式，如果是整体切换，则为一级路由；如果是在一级路由的内部进行的内容切换，则为二级路由
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
## 静态资源引入和Error Lens安装
### 1. 静态资源引入
- 图片资源 - 把 images 文件夹放到 assets 目录下
- 样式资源 - 把 common.scss 文件放到 styles 目录下

### 2. Error Lens插件安装
> Error Lens插件会改进错误、警告和其他语言诊断的突出显示。

![image.png](/note/note1-2.png)

## scss全局变量自动导入

>在var.scss中定义全局通用的sass颜色变量及其它sass变量

```css
// @/styles/var.scss
$xtxColor: #27ba9b;
$helpColor: #e26237;
$sucColor: #1dc779;
$warnColor: #ffb302;
$priceColor: #cf4444;
```
```json
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

