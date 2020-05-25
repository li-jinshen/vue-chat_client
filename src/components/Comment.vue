<template>
  <div class="container">
    <!-- 用户列表 -->
    <div class="user-list">
      <div class="header">
        <div class="avatar">
          <img class="img avatar_url" :src="avatar" alt="" />
        </div>
        <div class="info">
          <!--  -->
          <h3 class="username">{{ userName }}</h3>
        </div>
      </div>
      <div class="title"><h3>用户列表</h3></div>
      <ul>
        <li class="user" v-for="item in userlist" :key="item.userName">
          <span class="avatar"><img :src="item.avatar" alt=""/></span>
          <span class="name">{{ item.userName }}</span>
        </li>
      </ul>
    </div>
    <!-- 聊天主窗口 -->
    <div class="box">
      <!-- 聊天窗口头部 -->
      <div class="box-hd">
        <h3>
          聊天室(<span id="userCount">{{ userlist.length }}</span
          >)
        </h3>
      </div>

      <!-- 聊天窗口主体区域 -->
      <div class="box-bd" id="box-bd" v-html="comments">
        <!--
          <div class="system">
            <p class="message_system">
              <span class="content">"往事随风"邀请你和"Boy"加入了群聊</span>
            </p>
          </div>
          <div class="message-box">
            <div class="my message">
              <img class="avatar" src="images/avatar2.jpg" alt="" />
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">在干嘛</div>
                </div>
              </div>
            </div>
          </div>
          <div class="message-box">
            <div class="other message">
              <img class="avatar" src="images/avatar02.jpg" alt="" />
              <div class="content">
                <div class="nickname">小美</div>
                <div class="bubble">
                  <div class="bubble_cont">吃饭</div>
                </div>
              </div>
            </div>
          </div>
          -->
      </div>

      <!-- 聊天窗口底部区域 -->
      <div class="box-ft">
        <!-- 工具栏 -->
        <div class="toolbar">
          <a
            href="javascript:;"
            title="表情"
            class="face"
            @click="showEmoji = !showEmoji"
          ></a>
          <a href="javascript:;" title="截屏" class="screen-cut"> </a>
          <a href="javascript:;" title="图片" class="file">
            <label for="file"></label>
            <input
              type="file"
              id="file"
              @change="selectFile($event)"
              style="display: none;"
            />
          </a>
        </div>
        <emoji-panel @emojiClick="appendEmoji" v-if="showEmoji"></emoji-panel>
        <!-- 内容输入区域 -->
        <div class="content">
          <!-- div添加一个属性：contenteditable -->
          <div class="text" id="content" contenteditable></div>
        </div>
        <!-- 发送按钮 -->
        <div class="action">
          <a class="btn-send" id="btn-send" href="javascript:;" @click="send"
            >发送</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmojiPanel from "./emoji/EmojiPanel"
export default {
  data() {
    return {
      userName: "",
      avatar: "",
      userlist: [],
      comments: "",
      message: "",
      showEmoji: false,
    }
  },
  components: {
    EmojiPanel,
  },
  watch: {
    // comments: "scrollToBottom",
  },
  mounted() {
    // 登陆成功注册的事件
    this.sockets.listener.subscribe("loginSuccess", (res) => {
      this.userName = res.userName
      this.avatar = res.avatar
    })
    // 接收用户列表
    this.sockets.listener.subscribe("userList", (users) => {
      this.userlist = users
    })
    // 新用户加入群聊
    this.sockets.listener.subscribe("addUser", (user) => {
      this.comments += `<div class="system">
           <p class="message_system">
              <span class="content">${user.userName}加入了群聊</span>
           </p>
        </div> `
    })

    // 用户退出群聊
    this.sockets.listener.subscribe("delUser", (user) => {
      this.comments += `<div class="system">
           <p class="message_system">
              <span class="content">${user.userName}离开了群聊</span>
           </p>
        </div> `
    })

    // 用户接收信息（分为用户个人信息和其他用户的信息）
    this.sockets.listener.subscribe("sendAll", (data) => {
      if (data.userName === this.userName) {
        this.comments += `<div class="message-box">
        <div class="my message">
          <img class="avatar" src="${data.avatar}" alt="" />
          <div class="content">
            <div class="bubble">
              <div class="bubble_cont">${data.message}</div>
            </div>
          </div>
        </div>
      </div> `
      } else {
        this.comments += `<div class="message-box">
        <div class="other message">
          <img class="avatar" src="${data.avatar}" alt="" />
          <div class="content">
            <div class="nickname">${data.userName}</div>
            <div class="bubble">
              <div class="bubble_cont">${data.message}</div>
            </div>
          </div>
        </div>
      </div>`
      }
    })

    // 接收信息（图片）
    this.sockets.listener.subscribe("sendFileAll", (data) => {
      if (data.userName === this.userName) {
        this.comments += `<div class="message-box">
        <div class="my message">
          <img class="avatar"  src="${data.avatar}" alt="" />
          <div class="content">
            <div class="bubble">
              <div class="bubble_cont">
                <img src="${data.imgSrc}">
              </div>
            </div>
          </div>
        </div>
      </div>`
      } else {
        this.comments += `<div class="message-box">
        <div class="other message">
          <img class="avatar"  src="${data.avatar}" alt="" />
          <div class="content">
            <div class="nickname">${data.userName}</div>
            <div class="bubble">
              <div class="bubble_cont">
                <img src="${data.imgSrc}">
              </div>
            </div>
          </div>
        </div>
      </div>`
      }
    })
  },
  methods: {
    appendEmoji(text) {
      let emoji = this.emoji(text)
      let dom = document.getElementById("content")
      dom.innerHTML = dom.innerHTML + emoji
      this.showEmoji = false
    },
    emoji(name) {
      // 生成html
      return `<span class="emoji-item-common emoji-${name} emoji-size-small" ></span>`
    },
    send() {
      let dom = document.getElementById("content")
      if (!dom.innerHTML) return alert("不能发送空白信息")
      this.$socket.emit("sendMsg", {
        message: dom.innerHTML,
        userName: this.userName,
        avatar: this.avatar,
      })
      dom.innerHTML = ""
    },
    selectFile(event) {
      let file = event.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file) // 读出 base64
      reader.onloadend = () => {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
        var dataURL = reader.result

        this.$socket.emit("sendFile", {
          imgSrc: dataURL,
          userName: this.userName,
          avatar: this.avatar,
        })
      }
    },
  },
  updated() {
    // 页面更新时让滚动条保持在最底部
    this.$nextTick(() => {
      var div = document.getElementById("box-bd")
      div.scrollTop = div.scrollHeight
    })
  },
}
</script>
<style lang="scss">
.container {
  max-width: 1000px;
  min-width: 800px;
  height: 100%;
  margin: 0 auto;
  background-color: pink;
  display: flex;
}

.user-list {
  width: 280px;
  height: 100%;
  float: left;
  position: relative;
  background-color: #2e3238;
}

.box {
  width: calc(100% - 280px);
  overflow: hidden;
  height: 100%;
  background-color: #eee;
}

.box-hd {
  text-align: center;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 30px;
}

.box-hd h3 {
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  margin: 0 20px;
  border-bottom: 1px solid #ccc;
  z-index: 999;
  box-sizing: border-box;
}

.message-box {
  overflow: hidden;
}

.box-bd {
  height: calc(100% - 215px);
  width: 100%;
  bottom: 180px;
  top: 51px;
  overflow-y: auto;
  overflow-x: hidden;
}

.system {
  overflow: hidden;
}
.message_system {
  text-align: center;
  margin: 10px auto;
  max-width: 50%;
}

.message_system .content {
  display: inline-block;
  font-size: 12px;
  padding: 1px 18px;
  color: #b2b2b2;
  border-radius: 2px;
}

.other {
  margin-bottom: 16px;
  float: left;
  width: 100%;
  padding-left: 20px;
  box-sizing: border-box;
}

.my {
  margin-bottom: 16px;
  float: right;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  box-sizing: border-box;
}

.my.message .avatar {
  float: right;
}

.message .content {
  overflow: hidden;
}

.message .content .nickname {
  font-weight: 400;
  padding-left: 10px;
  font-size: 12px;
  height: 22px;
  line-height: 24px;
  color: #4f4f4f;
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}

.message .avatar {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  float: left;
  cursor: pointer;
}

.my.message .bubble {
  background-color: #b2e281;
}
.message .bubble {
  max-width: 500px;
  min-height: 1em;
  display: inline-block;
  vertical-align: top;
  position: relative;
  text-align: left;
  font-size: 14px;
  border-radius: 3px;
  margin: 0 10px;
  background-color: #fff;
}

.message .bubble img {
  display: inline-block;
  cursor: pointer;
  max-width: 350px;
  max-height: 240px;
}

.other .bubble:before {
  position: absolute;
  top: 14px;
  left: -10px;
  border: 6px solid transparent;
  content: " ";
  border-right-color: #fff;
  border-right-width: 4px;
}

.my .bubble:before {
  position: absolute;
  top: 14px;
  right: -10px;
  border: 6px solid transparent;
  content: " ";
  border-left-color: #b2e281;
  border-left-width: 4px;
}

.bubble_cont {
  word-wrap: break-word;
  word-break: break-all;
  padding: 9px;
  vertical-align: middle;
  span {
    vertical-align: middle;
  }
}

.box-ft {
  border-top: 1px solid #ccc;
  height: 180px;
  position: relative;
}

.box-ft .toolbar {
  height: 30px;
  padding: 5px 20px;
}

.box-ft .toolbar .face {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  background: url("./images/wechat-sprit.png") no-repeat -404px -398px;
}

.box-ft .toolbar .screen-cut {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  background: url("./images/wechat-sprit.png") no-repeat -30px -432px;
}

.box-ft .toolbar .file label {
  opacity: 0;
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
  background: rgb(255, 255, 255);
}

.box-ft .toolbar .file {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  background: url("./images/wechat-sprit.png") no-repeat -120px -432px;
}

.box-ft .content {
  height: 90px;
  overflow-x: hidden;
  padding: 0px 20px;
  vertical-align: middle;
  span {
    vertical-align: middle;
  }
}

.box-ft .content .text {
  resize: none;
  border: none;
  outline: none;
  width: 100%;
  height: 84px;
  font-size: 16px;
  background-color: #eee;
}

.box-ft .action {
  text-align: right;
  margin-top: 5px;
  padding-right: 20px;
}

.box-ft .action .desc {
  color: #888;
  font-size: 12px;
  margin-left: 10px;
  margin-right: 7px;
}

.btn-send {
  display: inline-block;
  border: 1px solid #c1c1c1;
  text-decoration: none;
  background-color: #fff;
  color: #222;
  border-radius: 4px;
  padding: 3px 30px;
  font-size: 14px;
}

.btn-send:hover {
  background-color: #d8d8d8;
}

.header {
  padding: 18px;
  position: relative;
}

.header .avatar {
  display: table-cell;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-all;
  white-space: nowrap;
  padding-right: 10.625px;
}

.header .avatar .img {
  width: 50px;
  height: 50px;
  border-radius: 2px;
  display: block;
  cursor: pointer;
}

.header .info {
  display: table-cell;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-all;
  width: 2000px;
}

.header .info h3 {
  display: inline-block;
  font-weight: 400;
  width: 156px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  color: #fff;
  font-size: 18px;
  vertical-align: top;
  line-height: 31px;
  text-decoration: none;
}

.title {
  padding: 13px 18px 11px;
  border-bottom: 1px solid #24272c;
  border-top: 1px solid #24272c;
  color: #fff;
}

.title h3 {
  font-weight: 400;
  font-size: 18px;
}

.user {
  overflow: hidden;
  padding: 12px 18px 11px;
  border-bottom: 1px solid #292c33;
  cursor: pointer;
  position: relative;
}

.user .avatar {
  float: left;
  margin-right: 10px;
  position: relative;
}

.user .avatar img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 2px;
}

.user .name {
  color: #fff;
  overflow: hidden;
  line-height: 36px;
}

.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 380px;
  height: 380px;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  background-color: #fff;
  box-shadow: #999 0 2px 10px;
}

.login_box h3 {
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: 400;
  line-height: 100px;
}

.login_box input {
  width: 300px;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  padding: 0;
  display: block;
  outline: none;
  margin-bottom: 5px;
}

.weui-btn {
  position: relative;
  display: block;
  width: 300px;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  line-height: 2.55555556;
  border-radius: 5px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  background-color: #1aad19;
  border: none;
  cursor: pointer;
  margin-top: 5px;
}

// 表情的样式
.emoji-item-common {
  background: url("/images/emoji_sprite.png");
  display: inline-block;
  margin-top: 2px;
  &:hover {
    cursor: pointer;
  }
}
.emoji-size-small {
  // 表情大小
  zoom: 0.4;
  vertical-align: top;
}
.emoji-size-large {
  zoom: 0.5; // emojipanel表情大小
  margin: 4px;
}
.comments-list {
  margin-top: 20px;
  .comments-list-item {
    margin-bottom: 20px;
    .comments-list-item-heading {
      display: inline-block;
      img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .comments-list-item-username {
        margin-left: 5px;
        font-weight: bold;
      }
    }
    .comments-list-item-content {
      margin: 10px 0px;
      border-bottom: 1px solid #cccccc;
      &:last-child {
        border-bottom: 0;
      }
      span {
        vertical-align: top;
      }
    }
  }
}
</style>
