---
title: 分享
date: 2020-05-31 15:53:26
sidebarDepth: 0
tags:
- 高级分销
categories:
- 高级分销
---
### vuex 中 shareAppMessage
- 1. 如果是公众号，正常分享，把需要分享的参数，拼成以activity-transform.html为路径的地址
- 2. redirect_uri拼接好后，activity-transform.html 会取出参数，跳转https://open.weixin.qq.com/connect/oauth2/authorize
- 3. activity-transform.html回调在回调到公众号项目，跳转完成
