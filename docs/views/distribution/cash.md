---
title: 提现
date: 2020-05-31 15:53:26
sidebarDepth: 0
tags:
- 高级分销
categories:
- 高级分销
---
### 提现页面逻辑
- 1. 如果个人信息中没有小泥人商城的openid，需要获取小泥人商城的openid，才能够发起提现，小泥人商城发起转账
- 2. 如果用户第一次没有，并且获取过openid，agentUserInfo中会多一个wechat_openid字段，为小泥人商城openid，不需要再次获取
### 获取openid流程
- 1. 判断vuex中是否缓存cashCode，只有第一次提现，才会出现cashCode
- 2. 第二次提现，因为之前获取过cashCode，后端会自动将小泥人商城openid绑定在用户上，就不需要在跳转页面获取
- 3. 跳转逻辑如下，需要跳转微信，回调地址填分销项目，获取成功，url会带回code，并用state=tocash标记，是从提现页面跳转出去的
- 4. 回跳回分销之后，state如果为tocash，在app.vue中判断，直接跳到提现页面，完成获取code过程
- 5. 页面中的数据用vuex-persistedstate持久缓存，不必担心，跳转之后缓存数据丢失

```js
if (!this.cashCode && !this.agentUserInfo.wechat_openid && Number(this.agentUserInfo.balance) > 0) {
  let url = encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
  let appid = window.location.host.includes('www1') ? 'wx20395f51a8f9bca9' : 'wx809b0da3a85cd7b5'
  window.location.replace(
    `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=tocash#wechat_redirect`
  )
}
```
