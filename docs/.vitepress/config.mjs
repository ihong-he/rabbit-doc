import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "小兔鲜儿-Web端",
  description: "A VitePress Site",
  head: [['link', { rel: 'icon', href: '/rabbit-doc/favicon.ico' }]], 
  base: '/rabbit-doc/', // 使用相对路径，线上部署非根路径时需要修改
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '开发笔记', link: '/note1' },
      { text: '演示网站', link: 'https://ihong-he.github.io/vue-rabbit/' }
    ],
    logo: '/image.png',

    search: {
      provider: 'local', // 可以开启本地搜索
    },

    sidebar: [
      {
        text: '开发指南',
        items: [
          { text: '项目起步', link: '/note1' },
          { text: 'Layout页', link: '/note2' },
          { text: 'Home页', link: '/note3' },
          { text: '一级分类页', link: '/note4' },
          { text: '二级分类页', link: '/note5' },
          { text: '商品详情页', link: '/note6' },
          { text: '登录页', link: '/note7' },
          { text: '购物车页', link: '/note8' },
          { text: '订单页', link: '/note9' },
          { text: '支付页', link: '/note10' },
          { text: '个人中心页', link: '/note11' },
          { text: 'Sku组件', link: '/note12' },
          { text: 'Examples', link: '/vue-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-2025 Panda工作室'
    },
  }
})
