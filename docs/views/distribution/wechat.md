---
title: 公众号小程序
date: 2020-05-31 15:53:26
sidebarDepth: 0
tags:
- 高级分销
categories:
- 高级分销
---
### login登录逻辑
- 1. 同其他登录逻辑，获取完所有页面需要登录信息，会触发toActivity函数
- 2. 函数内会获取分销信息
    ```js
      await this.getSeniorUser(this.routeQuery.agentId)
    ```
- 3. 获取分销信息函数
    ```js
    async getSeniorUser({ commit, state, dispatch }, agentId) { // 获取高级分销员信息
      const { openid, headimgurl, nickname, merchant_id, weapp_openid } = uni.getStorageSync('loginInfo')
      const info = await getBaseInfo(merchant_id)
       // 如果分享路由带过来分销员id，说明是别人分享的，需要获取一下分享人信息，显示在首页，***的小店
      if (agentId) dispatch('getShareSeniorInfo', agentId)
      if (info.data) {
        return new Promise((resolve, reject) => {
          let userOpenid = ''
          // #ifdef H5
          userOpenid = openid
          // #endif
          // #ifndef H5
          userOpenid = weapp_openid
          // #endif
          getSeniorUser({ openid: userOpenid }).then(agent => {
            // 获取当前用户的分销信息，如果没有，相当于假注册一下bindingAgent 具体逻辑问后端
            if (!agent.data && agentId) { // referrer_user_id 如果是0 则未绑定上级，如果有就返回id
              let data = {
                type: 'binding',
                referrer_user_id: agentId, // 推荐人id
                open_id: userOpenid,
                headimgurl,
                nickname,
                distribution_id: info.data.id
              }
              bindingAgent(data).then(bind => {
                getSeniorUser({ openid: userOpenid }).then(info => {
                  if (agentId) { // 如果是通过分享进入的，将分享id作为分销id保存起来
                    info.data.referrer_user_id = agentId
                  }
                  commit('SET_SENIOR_DISTRIBUTION', info.data)
                })
                resolve(true)
              }) // 绑定用户
            } else {
              if (agentId) {
                agent.data.referrer_user_id = agentId
              }
              commit('SET_SENIOR_DISTRIBUTION', agent.data)
              resolve(true)
            }
          })
        })
      } else {
        return Promise.resolve(true)
      }
    }
    ```

### 公众号小程序跳转逻辑
- 1. login页面会有，如果分享过来带的name是seniorDistribution，走高级分销跳转逻辑
- 2. 跳转时，需要判断分销信息，判断是否有用户，是否跳注册页面
    ```js
    let url = `${BASE_API}/mp/senior-distribution-ec.html?openid=${useropenid}&nickname=${nickname}&headimgurl=${encodeURIComponent(headimgurl)}&ditch=${from}&uid=${id}&appid=${appid}&merchant_id=${merchant_id}#/register`
      if (seniorAgentInfo.is_agent == 1) {
        url = `${BASE_API}/mp/senior-distribution-ec.html?openid=${useropenid}&nickname=${nickname}&headimgurl=${encodeURIComponent(headimgurl)}&ditch=${from}&agent_user_id=${seniorAgentInfo.agent_user_id}&uid=${id}&appid=${appid}&merchant_id=${merchant_id}`
      }
      if (seniorAgentInfo && seniorAgentInfo.status == 0 && seniorAgentInfo.is_agent == 1) {
        uni.showToast({
          title: '您提交的分销商申请正在审核中',
          icon: 'none'
        })
        url = '/pages/index'
      }
      if (seniorAgentInfo && seniorAgentInfo.status == 2  && seniorAgentInfo.is_agent == 1) {
        uni.showToast({
          title: '您提交的分销商申请被驳回',
          icon: 'none'
        })
        url = '/pages/index'
      }
      if (seniorAgentInfo && seniorAgentInfo.is_frozen == '-1'  && seniorAgentInfo.is_agent == 1) {
        uni.showToast({
          title: '您的分销账号已冻结，请联系商家',
          icon: 'none'
        })
        url = '/pages/index'
      }
    ```
- 3. 个人中心跳转同上
