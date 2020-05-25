# 基于vue+koa2+socket.io实现多人在线实时聊天

### 安装依赖

```
npm install
```

### 运行

```
npm run serve
```

### 打包

```
npm run build
```

## 项目效果

<video id="video" controls="" muted   autoplay="autoplay" preload="none">
    <source id="mp4" src="./效果图/1.mp4" type="video/mp4">
</video>



## 前端技术栈

- vue
- vue-socket.io
- scss

## 使用到的插件

项目里使用的表情组件是 [vue-emoji-comment](https://github.com/pppercyWang/vue-emoji-comment)

## 实现功能

已经基本实现了信息发送（图片，文字，表情）

## 关于 vue-socket.io 3.0.9版本存在的bug

在 vue-socket.io 3.0.9 版本中会出现无法接收到信息的 bug (也就是你在 sockets中定义的方法是没有办法触发的) ，关于这个问题我们可以通过以下方法解决

### 方法一： this.sockets.listener.subscribe

```javascript
 this.sockets.listener.subscribe("事件名", (参数) => {
      //逻辑
 })
```

### 方法二 ：使用  socket.io-client

```javascript
import io from 'socket.io-client'
export default {
  mounted() {
    io('http://127.0.0.1:8080').on('hi', (res) => {
      console.log('socket.io-client', res)
    })
  },
}
```

以上两种解决办法可以文章 ：[vue-socket.io3.08，3.09有bug接收不到数据](https://segmentfault.com/a/1190000022624044 )

### 方法三：回退版本到 3.0.7

这个版本是不存在该bug的

## 后台

[基于vue+koa2+socket.io实现多人在线实时聊天---后台](https://gitee.com/ymshen/chat_serve)

