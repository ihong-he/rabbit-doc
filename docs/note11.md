---
outline: [1, 3]
---
<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note11-1.png', 'note11-2.png', 'note11-3.png', 'note11-4.png'])

</script>
# 个人中心

## 整体认识和页面渲染
<ImageView :imgArr="imgArr" :index="0" />

### 1. 准备路由模版
```vue
<script setup> </script>

<template>
  <div class="container">
    <div class="xtx-member-aside">
      <div class="user-manage">
        <h4>我的账户</h4>
        <div class="links">
          <RouterLink to="/member/user">个人中心</RouterLink>
        </div>
        <h4>交易管理</h4>
        <div class="links">
          <RouterLink to="/member/order">我的订单</RouterLink>
        </div>
      </div>
    </div>
    <div class="article">
      <!-- 三级路由的挂载点 -->
      <!-- <RouterView /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
...
</style>
```

### 2. 配置路由
```javascript
import Member from '@/views/Member/index.vue'


{
    path: '/member',
    component: Member,
}
```
### 3. 个人信息和我的订单组件

- 个人信息
```vue
<script setup>
const userStore = {}
</script>

<template>
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img :src="userStore.userInfo?.avatar" />
      </div>
      <h4>{{ userStore.userInfo?.account }}</h4>
    </div>
    <div class="item">
      <a href="javascript:;">
        <span class="iconfont icon-hy"></span>
        <p>会员中心</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-aq"></span>
        <p>安全设置</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-dw"></span>
        <p>地址管理</p>
      </a>
    </div>
  </div>
  <div class="like-container">
    <div class="home-panel">
      <div class="header">
        <h4 data-v-bcb266e0="">猜你喜欢</h4>
      </div>
      <div class="goods-list">
        <!-- <GoodsItem v-for="good in likeList" :key="good.id" :good="good" /> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
...
</style>
```

- 我的订单
```vue
<script setup>
// tab列表
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]
// 订单列表
const orderList = []

</script>

<template>
  <div class="order-container">
    <el-tabs>
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />

      <div class="main-container">
        <div class="holder-container" v-if="orderList.length === 0">
          <el-empty description="暂无订单数据" />
        </div>
        <div v-else>
          <!-- 订单列表 -->
          <div class="order-item" v-for="order in orderList" :key="order.id">
            <div class="head">
              <span>下单时间：{{ order.createTime }}</span>
              <span>订单编号：{{ order.id }}</span>
              <!-- 未付款，倒计时时间还有 -->
              <span class="down-time" v-if="order.orderState === 1">
                <i class="iconfont icon-down-time"></i>
                <b>付款截止: {{order.countdown}}</b>
              </span>
            </div>
            <div class="body">
              <div class="column goods">
                <ul>
                  <li v-for="item in order.skus" :key="item.id">
                    <a class="image" href="javascript:;">
                      <img :src="item.image" alt="" />
                    </a>
                    <div class="info">
                      <p class="name ellipsis-2">
                        {{ item.name }}
                      </p>
                      <p class="attr ellipsis">
                        <span>{{ item.attrsText }}</span>
                      </p>
                    </div>
                    <div class="price">¥{{ item.realPay?.toFixed(2) }}</div>
                    <div class="count">x{{ item.quantity }}</div>
                  </li>
                </ul>
              </div>
              <div class="column state">
                <p>{{ order.orderState }}</p>
                <p v-if="order.orderState === 3">
                  <a href="javascript:;" class="green">查看物流</a>
                </p>
                <p v-if="order.orderState === 4">
                  <a href="javascript:;" class="green">评价商品</a>
                </p>
                <p v-if="order.orderState === 5">
                  <a href="javascript:;" class="green">查看评价</a>
                </p>
              </div>
              <div class="column amount">
                <p class="red">¥{{ order.payMoney?.toFixed(2) }}</p>
                <p>（含运费：¥{{ order.postFee?.toFixed(2) }}）</p>
                <p>在线支付</p>
              </div>
              <div class="column action">
                <el-button  v-if="order.orderState === 1" type="primary"
                  size="small">
                  立即付款
                </el-button>
                <el-button v-if="order.orderState === 3" type="primary" size="small">
                  确认收货
                </el-button>
                <p><a href="javascript:;">查看详情</a></p>
                <p v-if="[2, 3, 4, 5].includes(order.orderState)">
                  <a href="javascript:;">再次购买</a>
                </p>
                <p v-if="[4, 5].includes(order.orderState)">
                  <a href="javascript:;">申请售后</a>
                </p>
                <p v-if="order.orderState === 1"><a href="javascript:;">取消订单</a></p>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background layout="prev, pager, next" />
          </div>
        </div>
      </div>

    </el-tabs>
  </div>

</template>

<style scoped lang="scss">
...
</style>
```
### 4. 配置三级路由
```javascript
import MemberInfo from '@/views/Member/components/UserInfo.vue'
import MemberOrder from '@/views/Member/components/UserOrder.vue'


{
  path: '/member',
  component: Member,
  children: [
    {
      path: '',
      component: MemberInfo
    },
    {
      path: 'order',
      component: MemberOrder
    }
  ]
}
```

## 个人中心信息渲染
### 1. 使用Pinia数据渲染个人信息
```vue
<script setup>
// 导入userStore
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>

<template>
  <!-- 用户信息 -->
  <div class="user-meta">
    <div class="avatar">
      <img :src="userStore.userInfo?.avatar" />
    </div>
    <h4>{{ userStore.userInfo?.account }}</h4>
  </div>
</template>
```
### 2. 封装猜你喜欢接口
```javascript
export const getLikeListAPI = ({ limit = 4 }) => {
  return request({
    url:'/goods/relevant',
    params: {
      limit 
    }
  })
}
```
### 3. 渲染猜你喜欢数据
```vue
<script setup>
import { onMounted, ref } from 'vue'
// 导入GoodsItem组件
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
// 获取猜你喜欢列表
const likeList = ref([])
const getLikeList = async () => {
  const res = await getLikeListAPI({ limit: 4 })
  likeList.value = res.result
}

onMounted(() => getLikeList())
</script>

<template>
   <div class="goods-list">
      <GoodsItem v-for="good in likeList" :key="good.id" :goods="good" />
    </div>
</template>
```
## 我的订单
<ImageView :imgArr="imgArr" :index="1" />

### 1. 基础列表渲染

- 封装获取订单列表的接口

```javascript
/*
params: {
	orderState:0,
  page:1,
  pageSize:2
}
*/


export const getUserOrder = (params) => {
  return request({
    url:'/member/order',
    method:'GET',
    params
  })
}
```
- 列表渲染
```vue
<script setup>
import { getUserOrder } from '@/apis/order'
import { onMounted, ref } from 'vue'

// 获取订单列表
const orderList = ref([])
const params = ref({
  orderState: 0, // 订单状态
  page: 1, // 当前页码
  pageSize: 2 // 每页条数
})
const getOrderList = async () => {
  const res = await getUserOrder(params.value)
  orderList.value = res.result.items
  total.value = res.result.counts
}
onMounted(() => getOrderList())
</script>
```
### 2. tab切换实现
```vue
<script setup>
// tab列表
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]

// tab切换
const tabChange = (type) => {
  params.value.orderState = type
  getOrderList()
}

</script>

<template>
  <el-tabs @tab-change="tabChange">
    <!-- 省略... -->
  </el-tabs>
</template>
```
### 3. 分页逻辑实现
> 页数 = 总条数 / 每页条数

```vue
<script setup>
// 补充总条数
const total = ref(0)
const getOrderList = async () => {
  const res = await getUserOrder(params.value)
  // 设置总条数
  total.value = res.result.counts
}
// 页数切换
const pageChange = (page) => {
  params.value.page = page // 修改页码
  getOrderList() // 重新获取列表数据
}
</script>

<template>
   <el-pagination 
     :total="total" 
     @current-change="pageChange" 
     :page-size="params.pageSize" 
     background
     layout="prev, pager, next" />
</template>
```

## 细节优化
### 1. 默认三级路由设置
- 方法一：置空第一个子路由path
```javascript
{
  path: 'member',
  component: Member,
  children: [
    {
      path: '', // 置空path
      component: UserInfo
    },
    {
      path: 'order',
      component: UserOrder
    }
  ]
}
```
- 方法二：跳转第一个子路由
```js
// 个人中心路由
{
  path: '/member',
  name: 'Member',
  redirect: '/member/user', // 跳转第一个子路由
  component: Member,
  children: []
}
```
### 2. 订单状态显示适配
```vue
<script setup>
  // 配置订单状态
  const fomartPayState = (payState) => {
    const stateMap = {
      1: '待付款',
      2: '待发货',
      3: '待收货',
      4: '待评价',
      5: '已完成',
      6: '已取消'
    }
    return stateMap[payState]
  }
</script>


<template>
  <!-- 订单状态 -->
  <p>{{ fomartPayState(order.orderState)}}</p>
</template>
```
