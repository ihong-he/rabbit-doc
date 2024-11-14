---
outline: [1, 3]
---

<script setup>
import ImageView from './components/ImageView.vue'
import { ref } from 'vue'

const imgArr = ref(['note7-1.png'])

</script>
# 登录页

## 整体认识和页面渲染

<ImageView :imgArr="imgArr" :index="0" />

### 1. 准备模版

```vue
<script setup></script>

<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">小兔鲜</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a href="javascript:;">账户登录</a>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form label-position="right" label-width="60px" status-icon>
              <el-form-item label="账户">
                <el-input />
              </el-form-item>
              <el-form-item label="密码">
                <el-input />
              </el-form-item>
              <el-form-item label-width="22px">
                <el-checkbox size="large">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <el-button size="large" class="subBtn">点击登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight &copy; 小兔鲜儿</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
...
</style>
```

### 2. 配置路由跳转

```html
<!-- javascript:; 通常用于创建一个“假链接”，点击它时不会导致页面跳转或刷新-->
<li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
```

## 表单校验实现

### 1. 校验要求

- 用户名：不能为空，字段名为 `account`
- 密码：不能为空且为 6-14 个字符，字段名为 `password`
- 同意协议：必选，字段名为 `agree`

### 2. 代码实现

```vue
<script setup>
import { ref } from "vue";
// 表单数据对象
const userInfo = ref({
  account: "",
  password: "",
  agree: true,
});

// 规则数据对象
const rules = {
  account: [{ required: true, message: "用户名不能为空" }],
  password: [
    { required: true, message: "密码不能为空" },
    { min: 6, max: 24, message: "密码长度要求6-14个字符" },
  ],
  agree: [
    {
      validator: (rule, val, callback) => {
        return val ? callback() : new Error("请先同意协议");
      },
    },
  ],
};
</script>

<template>
  <div class="form">
    <el-form ref="formRef" :model="userInfo" :rules="rules" status-icon>
      <el-form-item prop="account" label="账户">
        <el-input v-model="userInfo.account" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="userInfo.password" />
      </el-form-item>
      <el-form-item prop="agree" label-width="22px">
        <el-checkbox v-model="userInfo.agree" size="large">
          我已同意隐私条款和服务条款
        </el-checkbox>
      </el-form-item>
      <el-button size="large" class="subBtn">点击登录</el-button>
    </el-form>
  </div>
</template>
```

## 登录基础业务实现

> 基础思想
>
> 1. 调用登录接口获取用户信息
> 2. 提示用户当前是否成功
> 3. 跳转到首页

```jsx
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { useRouter } from "vue-router";

const router = useRouter();
const doLogin = () => {
  const { account, password } = form.value;
  // 调用实例方法
  formRef.value.validate(async (valid) => {
    // valid: 所有表单都通过校验  才为true
    console.log(valid);
    // 以valid做为判断条件 如果通过校验才执行登录逻辑
    if (valid) {
      // TODO LOGIN
      const res = await loginAPI({ account, password });
      if (res.code == 1) {
        // 1. 登录成功，提示用户
        ElMessage({ type: "success", message: "登录成功" });
        // 2. 跳转首页
        router.replace({ path: "/" });
      }
    }
  });
};
```

## Pinia 管理用户数据

> 基本思想：Pinia 负责用户数据相关的 state 和 action，组件中只负责触发 action 函数并传递参数

```javascript
// 管理用户数据相关
import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI } from "@/apis/user";

export const useUserStore = defineStore("user", () => {
  // 1. 定义管理用户数据的state
  const userInfo = ref({});
  // 2. 定义获取接口数据的action函数
  const getUserInfo = async ({ account, password }) => {
    const res = await loginAPI({ account, password });
    userInfo.value = res.result;
  };
  // 3. 以对象的格式把state和action return
  return {
    getUserInfo,
  };
});
```

## Pinia 数据持久化

> pinia 中的 state 数据是存储在内存中的，当页面刷新后，数据会丢失。而使用 Pinia 插件 `Persistedstate`
> 可配置 Pinia 存储持久化

1. 安装 [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)

```bash
npm i pinia-plugin-persistedstate
```

2. 将插件添加到你的 pinia 实例中：

```ts
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

3. 在声明 store 时，请将新 persist 选项设置为 true

```javascript{11}
// 管理用户数据相关
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    ...
  },
  {
    persist: true,
  }
);
```

## 请求拦截器携带 token

> token 是登录成功后，服务器返回的，用来标识当前用户身份的唯一标识符。

```javascript
// axios请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    // 1. 从pinia获取token数据
    const userStore = useUserStore();
    // 2. 按照后端的要求拼接token数据
    const token = userStore.userInfo.token;
    if (token) {
      // 3. 在请求头中添加token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);
```

## 退出登录实现

> 基础思想：
>
> 1. 清除用户信息
> 2. 跳转到登录页

1- 新增清除用户信息 action

```javascript
// /stores/user.js
// 退出时清除用户信息
const clearUserInfo = () => {
  userInfo.value = {};
};
```

2- 组件中执行业务逻辑

```vue
<script setup>
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const router = useRouter();
const confirm = () => {
  console.log("用户要退出登录了");
  // 退出登录业务逻辑实现
  // 1.清除用户信息 触发action
  userStore.clearUserInfo();
  // 2.跳转到登录页
  router.push("/login");
};
</script>
```

## token 过期处理

> token 过期是指：token 在服务器端已经失效，但是客户端保存的 token 信息仍然存在，导致后续请求接口时，携带的 token 已经失效，从而导致接口返回 401 错误。

```javascript
// utils/http.js
// axios响应式拦截器
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // 统一错误提示
    ElMessage({ type: "error", message: err.response.data.message });
    console.log("err:", err);
    // 判断401错误
    if (err.response.status === 401) {
      // 清空用户信息
      const userStore = useUserStore();
      userStore.clearUserInfo();
      // 跳转到登录页
      router.push("/login");
    }
    return Promise.reject(err);
  }
);
```

## 回到登录前页面

> 为了在用户重新登录后回到原来的页面，可以在跳转到登录页之前记录下当前页面的路径，并在登录成功后重定向回去。

- 实现步骤如下：

1. 在响应拦截器中记录跳转前的页面路径：当检测到 401 状态码（未授权）时，将当前的页面路径保存在路由参数或本地存储中，然后跳转到登录页。
2. 登录成功后进行重定向：在用户完成登录后，检查是否有保存的重定向路径，有则跳转回该路径。

```javascript{12,14}
// axios响应式拦截器
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // 统一错误提示
    ElMessage({ type: "error", message: err.response.data.message });
    if (err.response.status === 401) {
      // 清空用户信息
      const userStore = useUserStore();
      userStore.clearUserInfo();
      // 记录当前路径
      const currentPath = router.currentRoute.value.fullPath;
      // 跳转到登录页，参数携带当前路径信息
      router.replace({ path: "/login", query: { redirect: currentPath } });
    }
    return Promise.reject(err);
  }
);
```

```javascript{10,12}
// 点击登录
const sumbit = () => {
  const { account, password } = loginForm.value
  formRef.value.validate(valid => {
    if (valid) {
      console.log('通过验证');
      // 调用登录方法
      ...
      // 获取当前路由的query路径参数
      const { redirect } = router.currentRoute.value.query
      // 登录成功，跳转原来的页面
      router.push(redirect || '/')
    } else {
      console.log('验证失败');
    }

  })
}

```
