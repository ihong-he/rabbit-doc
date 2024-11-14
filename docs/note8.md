---
outline: [1, 3]
---

<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note8-1.png', 'note8-2.png', 'note8-3.png', 'note8-4.png'])

</script>
# 购物车

## 模块梳理

<!-- ![image.png](/note/note8-1.png) -->
<ImageView :imgArr="imgArr" :index="0" />

## 本地购物车

<ImageView :imgArr="imgArr" :index="1" />
### 1. 添加购物车
> 基础思想：如果已经添加过相同的商品，就在其数量count上加一，如果没有添加过，就直接push到购物车列表中

```javascript
// stores/cartStore.js
// 封装购物车模块

import { defineStore } from "pinia";
import { ref } from "vue";

export const useCartStore = defineStore(
  "cart",
  () => {
    // 1. 定义state - cartList
    const cartList = ref([]);
    // 2. 定义action - addCart
    const addCart = (goods) => {
      console.log("添加", goods);
      // 添加购物车操作
      // 已添加过 - count + 1
      // 没有添加过 - 直接push
      // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
      const item = cartList.value.find((item) => goods.skuId === item.skuId);
      if (item) {
        // 找到了
        item.count++;
      } else {
        // 没找到
        cartList.value.push(goods);
      }
    };
    return {
      cartList,
      addCart,
    };
  },
  {
    persist: true,
  }
);
```

### 2. 头部购物车

<ImageView :imgArr="imgArr" :index="2" />

#### 2.1 渲染头部购物车数据

```vue
// Layout/components/HeaderCart.vue
<script setup>
import { useCartStore } from "@/stores/cartStore";
const cartStore = useCartStore();
</script>

<template>
  <div class="cart">
    <a class="curr" href="javascript:;">
      <i class="iconfont icon-cart"></i><em>{{ cartStore.cartList.length }}</em>
    </a>
    <div class="layer">
      <div class="list">
        <div class="item" v-for="i in cartStore.cartList" :key="i">
          <RouterLink to="">
            <img :src="i.picture" alt="" />
            <div class="center">
              <p class="name ellipsis-2">
                {{ i.name }}
              </p>
              <p class="attr ellipsis">{{ i.attrsText }}</p>
            </div>
            <div class="right">
              <p class="price">&yen;{{ i.price }}</p>
              <p class="count">x{{ i.count }}</p>
            </div>
          </RouterLink>
          <i
            class="iconfont icon-close-new"
            @click="cartStore.delCart(i.skuId)"
          ></i>
        </div>
      </div>
      <div class="foot">
        <div class="total">
          <p>共 {{ cartStore.allCount }} 件商品</p>
          <p>&yen; {{ cartStore.allPrice.toFixed(2) }}</p>
        </div>
        <el-button
          size="large"
          type="primary"
          @click="$router.push('/cartlist')"
          >去购物车结算</el-button
        >
      </div>
    </div>
  </div>
</template>
```

#### 2.2 删除功能实现

1- 添加删除 action 函数

```javascript
// stores/cartStore.js
// 删除购物车
const delCart = async (skuId) => {
  // 思路：
  // 1. 找到要删除项的下标值 - splice
  const idx = cartList.value.findIndex((item) => skuId === item.skuId);
  cartList.value.splice(idx, 1);
  // 2. 使用数组的过滤方法 - filter
  cartList.value = cartList.value.filter((item) => item.skuId !== skuId);
};
```

2- 组件触发 action 函数并传递参数

```vue
<i class="iconfont icon-close-new" @click="cartStore.delCart(i.skuId)"></i>
```

### 3. 列表购物车-基础内容渲染

<ImageView :imgArr="imgArr" :index="3" />

#### 3.1. 准备模版
```vue
<script setup>
const cartList = []
</script>

<template>
  <div class="xtx-cart-page">
    <div class="container m-top-20">
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <el-checkbox/>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 商品列表 -->
          <tbody>
            <tr v-for="i in cartList" :key="i.id">
              <td>
                <el-checkbox />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="i.picture" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ i.name }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ i.price }}</p>
              </td>
              <td class="tc">
                <el-input-number v-model="i.count" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ (i.price * i.count).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <p>
                  <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="delCart(i)">
                    <template #reference>
                      <a href="javascript:;">删除</a>
                    </template>
                  </el-popconfirm>
                </p>
              </td>
            </tr>
            <tr v-if="cartList.length === 0">
              <td colspan="6">
                <div class="cart-none">
                  <el-empty description="购物车列表为空">
                    <el-button type="primary">随便逛逛</el-button>
                  </el-empty>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          共 10 件商品，已选择 2 件，商品合计：
          <span class="red">¥ 200.00 </span>
        </div>
        <div class="total">
          <el-button size="large" type="primary" >下单结算</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
...
</style>

````
#### 3.2. 绑定路由
```javascript
import CartList from '@/views/CartList/index.vue'
...
routes: [
  {
    path: '/cartlist',
    component: CartList
  }
]
````

#### 3.3. 渲染列表

```vue
<script setup>
import { useCartStore } from '@/stores/cartStore'
// 获取购物车数据
const cartStore = useCartStore()
</script>

<template>
...
    <!-- 商品列表 -->
    <tbody>
      <tr v-for="i in cartStore.cartList" :key="i.id">
        <td>
          <!-- 单选框 -->
          <el-checkbox/>
        </td>
        <td>
          <div class="goods">
            <RouterLink to="/"><img :src="i.picture" alt="" /></RouterLink>
            <div>
              <p class="name ellipsis">
                {{ i.name }}
              </p>
            </div>
          </div>
        </td>
        <td class="tc">
          <p>&yen;{{ i.price }}</p>
        </td>
        <td class="tc">
          <el-input-number v-model="i.count" />
        </td>
        <td class="tc">
          <p class="f16 red">&yen;{{ (i.price * i.count).toFixed(2) }}</p>
        </td>
        <td class="tc">
          <p>
            <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="delCart(i)">
              <template #reference>
                <a href="javascript:;">删除</a>
              </template>
            </el-popconfirm>
          </p>
        </td>
      </tr>
      <tr v-if="cartStore.cartList.length === 0">
        <td colspan="6">
          <div class="cart-none">
            <el-empty description="购物车列表为空">
              <el-button type="primary">随便逛逛</el-button>
            </el-empty>
          </div>
        </td>
      </tr>
    </tbody>
...
</template>
```

### 4. 列表购物车-单选功能实现

> 基本思想：通过 skuId 找到要进行单选操作的商品，把控制是否选中的 selected 字段修改为当前单选框的状态

1- 添加单选 action

```javascript
// 单选功能
const singleCheck = (skuId, selected) => {
  // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
  const item = cartList.value.find((item) => item.skuId === skuId);
  item.selected = selected;
};
```

2- 触发 action 函数

```vue
<script setup>
// 单选回调
const singleCheck = (i, selected) => {
  console.log(i, selected);
  // store cartList 数组 无法知道要修改谁的选中状态？
  // 除了selected补充一个用来筛选的参数 - skuId
  cartStore.singleCheck(i.skuId, selected);
};
</script>

<template>
  <td>
    <!-- 单选框 -->
    <el-checkbox
      :model-value="i.selected"
      @change="(selected) => singleCheck(i, selected)"
    />
  </td>
</template>
```

### 5. 列表购物车-全选功能实现

> 基础思想：
>
> 1. 全选状态决定单选框状态 - 遍历 cartList 把每一项的 selected 都设置为何全选框状态一致
> 2. 单选框状态决定全选状态 - 只有所有单选框的 selected 都为 true, 全选框才为 true

1- store 中定义 action 和计算属性

```javascript
// 全选功能action
const allCheck = (selected) => {
  // 把cartList中的每一项的selected都设置为当前的全选框状态
  cartList.value.forEach((item) => (item.selected = selected));
};

// 是否全选计算属性
const isAll = computed(() => cartList.value.every((item) => item.selected));
```

2- 组件中触发 aciton 和使用计算属性

```vue
<script setup>
const allCheck = (selected) => {
  cartStore.allCheck(selected);
};
</script>

<template>
  <!-- 全选框 -->
  <el-checkbox :model-value="cartStore.isAll" @change="allCheck" />
</template>
```

### 6. 列表购物车-统计数据功能实现

```javascript
// 3. 已选择数量
const selectedCount = computed(() =>
  cartList.value
    .filter((item) => item.selected)
    .reduce((a, c) => a + c.count, 0)
);
// 4. 已选择商品价钱合计
const selectedPrice = computed(() =>
  cartList.value
    .filter((item) => item.selected)
    .reduce((a, c) => a + c.count * c.price, 0)
);
```

## 接口购物车

### 1. 加入购物车

1-接口封装

```javascript
// 加入购物车
export const insertCartAPI = ({ skuId, count }) => {
  return request({
    url: "/member/cart",
    method: "POST",
    data: {
      skuId,
      count,
    },
  });
};
```

2- action 中适配登录和非登录

```javascript
import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import { insertCartAPI } from "@/apis/cart";
export const useCartStore = defineStore(
  "cart",
  () => {
    const userStore = useUserStore();
    // 获取pinia的登录数据
    const isLogin = computed(() => userStore.userInfo.token);

    const addCart = async (goods) => {
      const { skuId, count } = goods;
      // 登录
      if (isLogin.value) {
        // 登录之后的加入购车逻辑
        await insertCartAPI({ skuId, count });
        updateNewList();
      } else {
        // 未登录
        const item = cartList.value.find((item) => goods.skuId === item.skuId);
        if (item) {
          // 找到了
          item.count++;
        } else {
          // 没找到
          cartList.value.push(goods);
        }
      }
    };
  },
  {
    persist: true,
  }
);
```

### 2. 删除购物车

1- 封装接口

```javascript
// 删除购物车
export const delCartAPI = (ids) => {
  return request({
    url: "/member/cart",
    method: "DELETE",
    data: {
      ids,
    },
  });
};
```

2- action 中适配登录和非登录

```javascript
// 删除购物车
const delCart = async (skuId) => {
  if (isLogin.value) {
    // 调用接口实现接口购物车中的删除功能
    await delCartAPI([skuId]);
    // 重新获取最新数据
    updateNewList();
  } else {
    // 思路：
    // 1. 找到要删除项的下标值 - splice
    // 2. 使用数组的过滤方法 - filter
    const idx = cartList.value.findIndex((item) => skuId === item.skuId);
    cartList.value.splice(idx, 1);
  }
};
```
