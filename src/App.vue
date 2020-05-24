<template>
  <div id="app">
    <login id="login" v-show="isShow" @changeShow="changeShow"></login>
    <comment v-show="!isShow"></comment>
  </div>
</template>

<script>
import Login from "./components/Login"
import Comment from "./components/Comment"
export default {
  name: "App",
  data() {
    return {
      isShow: true,
    }
  },
  components: { Login, Comment },
  mounted() {
    //如果用户名已经存在触发的函数 因为sockets里的函数无法触发，
    //所以使用this.sockets.listener.subscribe 这种形式订阅事件
    this.sockets.listener.subscribe("login", (res) => {
      if (res) {
        alert("该用户已经存在，请重新输入")
      } else {
        this.isShow = false
      }
    })
  },
  methods: {
    changeShow(data) {
      this.$socket.emit("submit", {
        userName: data.userName,
        avatar: data.avatar,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  width: 100%;
  position: relative;
  #login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
