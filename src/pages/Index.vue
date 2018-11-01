<template>
  <div class="p-index">
    <div class="main">
      <img src="../assets/img/1.png" alt="">
      <img src="../assets/img/2.png" alt="">
      <img src="../assets/img/3.png" alt="">
      <img src="../assets/img/4.png" alt="">
      <img src="../assets/img/5.png" alt="">
      <img src="../assets/img/6.png" alt="">
      <img src="../assets/img/7.png" alt="">
      <img src="../assets/img/8.png" alt="">
      <img src="../assets/img/9.png" alt="">
    </div>
    <div class="bottom">
      <!-- userCate//0-待审核商户，1-普通用户,2已审核商户,3-已报名用户（未缴费） -->
      <router-link v-if="user.userCate==2" class="circle" to="admin">后台管理</router-link>
      <router-link v-else class="circle" to="register">成为商家</router-link>
    </div>
    <div class="btn-fixed" @click="showSignUp">
      <img src="../assets/img/signup.png" alt="">
    </div>
    <!-- <div>已报名{{$parent.joinTotal}}</div>
    <router-link to="signup">立即报名</router-link>
    <div>openId:{{user.openId}}</div>
    <div>userName:{{user.userName}}</div>
    <div>parentOpenId:{{$parent.parentOpenId}}</div> -->
    <div v-transfer-dom>
      <popup v-model="signupPopup" position="top">
        <div class="popup0">
          <group>
            <x-input title="姓名" v-model="userName" required :disabled="user.userCate==3"></x-input>
            <x-input title="手机" v-model="mobile" required :disabled="user.userCate==3"></x-input>
          </group>
          <x-button @click.native="signUp">立即报名</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { XButton, XInput, Group, Popup, TransferDom } from "vux";

export default {
  components: {
    XButton,
    XInput,
    Group,
    Popup
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      signupPopup: true,
      userName: "",
      mobile: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    const { userName, mobile } = this.user;
    this.userName = userName;
    this.mobile = mobile;
  },
  methods: {
    showSignUp() {
      console.log(111);
      this.signupPopup = true;
    },
    signUp() {
      const { userName, mobile } = this,
        { openId } = this.user;
      this.http
        .post(`/api/wx/add/user`, {
          userName,
          mobile,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("报名成功，请支付");
            //这个需要重新请求更新下user状态
            this.userCate = 3;
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.vux-popup-dialog.vux-popup-top {
  background-color: #fff;
  width: 95%;
  margin: 0 auto;
  right: 0;
  top: 10px;
  .popup0 {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 20px;
  }
}

.p-index {
  padding-bottom: 50px;
  img {
    display: block;
    width: 100%;
  }
  .bottom {
    background-color: #ccc;
    text-align: center;
    > a {
      color: #333;
      text-decoration: underline;
    }
  }
  .btn-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(38, 28, 28, 0.7);
    text-align: center;
    height: 50px;
    padding: 10px 0;
    box-sizing: border-box;
    img {
      display: inline-block;
      width: auto;
      height: 100%;
    }
  }
  .fixed-wrap {
    position: fixed;
    right: 20px;
    bottom: 20px;
    .circle {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-color: red;
      border-radius: 50%;
    }
  }
}
</style>


