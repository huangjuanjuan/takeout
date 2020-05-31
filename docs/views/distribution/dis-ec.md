---
date: 2020-05-31 15:53:26
tags:
- 高级分销
categories:
- 高级分销
---
### 高级分销

### src -> api -> api.js
```js
参数均为页面参数代入
token 小程序或公众号页面代入
merchantId 商家merchantId
uid 用户id
open_id 小程序取用户信息weapp_openid 公众号取个人信息的openid
ditch 标记页面来源 move为公众号跳入，applet为小程序跳入
agent_user_id 用户的分销员id
```

### src -> api -> api.js 基本方法介绍
```js
getBaseInfo 获取分销基本信息，返回当前商家开通分销的基本信息，如分销id，返利比例等基本信息
getWxJssdkData 获取公众号分享参数
getWechatInfo 获取商家小程序 公众号信息
getAgentUserInfo 根据agent_user_id获取分销员信息
getPoster 获取分享二维码
其他基本见页面用法

```

### app.vue 中引用vuex中方法及功能
```js
methods: {
    ...mapActions([
      'getDistributionInfo', // 获取分销员信息
      'getWechatInfo', // 获取当前商家公众号 小程序信息，weapp.data wechat.data
      'getAllStore', // 获取商家下门店信息，提前缓存，页面直接引用
      'setLoginInfo', // 获取当前用户的信息，如果是公众号的话，公户信息直接在
      // localstorage可以直接拿到, 小程序的话，如果是注册，需要把信息从url带过来
      'shareAppMessage', // 页面分享公共方法
      'setCashCode' // 提现获取code逻辑
    ])
}
```
### app.vue created函数逻辑简介
```js
判断注册或者是已经注册等逻辑，需要依赖其他信息，这里async await函数处理一下
await this.getWechatInfo() // 获取小程序信息
await this.getDistributionInfo()
await this.getAllStore()
this.loading = false
this.setLoginInfo()
this.shareAppMessage({params: { name: 'pagesShare', pages: '/pages/index', agentId: this.agentUserInfo.id }, custom: { title: '分享赚钱' }})
// 上边逻辑取完用户信息，判断用户是否是没有注册过的
// 如果没有个人信息需要注册  
if (!this.agentUserInfo || !this.agentUserInfo.id || this.agentUserInfo.is_agent == 0) {
  this.$route.name === 'register' ? '' : this.$router.replace('/register')
  return
}
// 这里取一下url参数，如果是从提现页面跳转出去，需要判断一下，如果有涉及提现信息，跳转回到对应页面，并缓存一下code，具体逻辑提现页面再说
const urlParams = getUrlKey(window.location.search)
if (urlParams.code && !this.cashCode) {
  this.setCashCode(urlParams.code)
  if (urlParams.state == 'tocash') {
    this.$router.push('/cash')
  }
  if (urlParams.state == 'toRecharge') {
    this.$router.push('/recharge')
  }
}
```
- 页面通过watch路由变化，设置分享页面的路径，小程序忽略
