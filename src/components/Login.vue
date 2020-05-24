<template>
  <div class="login">
    <h4>登陆</h4>
    <input
      type="text"
      v-model="userName"
      class="name"
      placeholder="请您输入用户名"
    />
    <div class="avatarsbox">
      <span v-for="(item, index) in images" :key="index">
        <img
          :src="'/images/' + item + '.png'"
          alt=""
          :class="currentIndex == index ? 'active' : ''"
          @click="changeIndex($event, index)"
        />
      </span>
    </div>
    <div class="btnbox">
      <div class="btn" @click="submit">登陆</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: 9,
      currentIndex: 0,
      src: "/images/1.png",
      userName: "",
      isLogin: true,
    }
  },
  methods: {
    changeIndex($event, index) {
      //获取到图片的src
      this.src = $event.target.src
      this.currentIndex = index
    },
    submit() {
      if (!this.userName) {
        alert("用户名不能为空")
        return
      }
      this.$emit("changeShow", {
        userName: this.userName,
        avatar: this.src,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.login {
  height: 300px;
  width: 400px;
  border: 1px solid gainsboro;
  border-radius: 5px;
  box-shadow: 0 5px 5px rgba(10, 16, 20, 0.24), 0 0 5px rgba(10, 16, 20, 0.12);
  h4 {
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
  }
  .name {
    height: 30px;
    width: 80%;
    border: 1px solid gainsboro;
    border-radius: 5px;
    margin-left: 10%;
    margin-top: 10px;
    line-height: 30px;
    text-align: center;
  }
  .name:focus {
    outline: none;
  }
  .avatarsbox {
    width: 80%;
    height: 138px;
    margin-left: 10%;
    margin-top: 10px;
    border: 1px solid gainsboro;
    border-radius: 5px;
    span {
      display: inline-block;
      width: 20%;
      img {
        height: 50px;
        width: 50px;
        margin-left: 8.3px;
        margin-top: 12px;
        border-radius: 50%;
        box-sizing: border-box;
        opacity: 0.4;
        transition: 0.2s;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .active {
      opacity: 1;
    }
  }
  .btnbox {
    width: 100%;
    height: 60px;
    text-align: center;
    position: relative;
    .btn {
      height: 30px;
      width: 100px;
      position: absolute;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      background: rgb(11, 113, 197);
      color: white;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      opacity: 1;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
  }
}
</style>
