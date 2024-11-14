---
outline: [1, 3]
---

<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note9-1.png', 'note9-2.png', 'note9-3.png', 'note9-4.png'])

</script>

#  订单页

## 整体认识和页面渲染

<ImageView :imgArr="imgArr" :index="0" />

### 1. 准备组件模版
```vue
<script setup>
const checkInfo = {}  // 订单对象
const curAddress = {}  // 地址对象

</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="toggleFlag = true">切换地址</el-button>
              <el-button size="large" @click="addFlag = true">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.price }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" >提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <!-- 添加地址 -->
</template>

<style scoped lang="scss">
...
</style>

````
### 2. 配置路由

```javascript
import Checkout from '@/views/Checkout/index.vue'
...
routes: [
  {
    path: '/checkout',
    component: Checkout
  }
]
````

### 3. 封装接口

```javascript
import request from "@/utils/request";
/**
 * 获取结算信息
 */
export const getCheckoutInfoAPI = () => {
  return request({
    url: "/member/order/pre",
  });
};
```

### 4. 渲染数据

```vue
<script setup>
import { onMounted, ref } from "vue";
import { getOrderInfoAPI } from "@/apis/checkout";

const checkInfo = ref({}); // 订单对象
const curAddress = ref({}); // 地址对象

// 获取订单信息
const getOrderInfo = () => {
  getOrderInfoAPI().then((res) => {
    checkInfo.value = res.result;
    // 获取默认地址
    curAddress.value = checkInfo.value.userAddresses.filter(
      (item) => item.isDefault === 0
    )[0];
  });
};

// 初始化数据
onMounted(() => getOrderInfo());
</script>
```

## 切换地址-打开弹框交互

### 1. 准备弹框模版

```html
<el-dialog title="切换收货地址" width="30%" center>
  <div class="addressWrapper">
    <div
      class="text item"
      v-for="item in checkInfo.userAddresses"
      :key="item.id"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
      </ul>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </span>
  </template>
</el-dialog>
```

### 2. 控制弹框打开

```vue
<script setup>
const showDialog = ref(false);
</script>
<template>
  <el-button size="large" @click="showDialog = true">切换地址</el-button>

  <el-dialog v-model="showDialog" title="切换收货地址" width="30%" center>
    ...
  </el-dialog>
</template>
```

## 切换地址-地址切换交互

> 基础思想：记录当前点击项，通过动态 class 判断当前 div 是否有激活类名

```vue
<script setup>
// 切换地址
const activeAddress = ref({});
const switchAddress = (item) => {
  activeAddress.value = item;
};
</script>

<template>
  <div
    class="text item"
    :class="{ active: activeAddress.id === item.id }"
    @click="switchAddress(item)"
    :key="item.id"
  >
    <!-- 省略... -->
  </div>
</template>
```

## 创建订单生成订单 ID

### 1. 准备支付页组件并绑定路由

```vue
<script setup>
const payInfo = {};
</script>

<template>
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>支付还剩 <span>24分30秒</span>, 超时后将取消订单</p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ payInfo.payMoney?.toFixed(2) }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <a class="btn alipay" :href="payUrl"></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
...
</style>
```

### 2. 准备生成订单接口

```javascript
// 创建订单
export const createOrderAPI = (data) => {
  return request({
    url: "/member/order",
    method: "POST",
    data,
  });
};
```

### 3. 调用接口携带 id 跳转路由

```vue
<script setup>
import { createOrderAPI } from "@/apis/checkout";

// 创建订单
const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: "",
    goods: checkInfo.value.goods.map((item) => {
      return {
        skuId: item.skuId,
        count: item.count,
      };
    }),
    addressId: curAddress.value.id,
  });
  const orderId = res.result.id;
  router.push({
    path: "/pay",
    query: {
      id: orderId,
    },
  });
};
</script>

<template>
  <!-- 提交订单 -->
  <div class="submit">
    <el-button @click="createOrder" type="primary" size="large"
      >提交订单</el-button
    >
  </div>
</template>
```
