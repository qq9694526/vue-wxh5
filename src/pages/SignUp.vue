<template>
  <div class="p-sign-up">
    <h1>报名</h1>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="user.userCate==3"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="user.userCate==3"></x-input>
    </group>
    <x-button v-if="user.userCate==3" type="primary" @click.native="goPay">支付99元</x-button>
    <x-button v-else @click.native="signUp">立即报名</x-button>
    <router-link to="home">我的海报</router-link>
  </div>
</template>
<script>
import { XButton, XInput, Group } from "vux";

export default {
  components: {
    XButton,
    XInput,
    Group
  },
  data() {
    return {
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
    },
    goPay() {
      //支付成功回调 /api/wx/pay/check
      this.getPaySgin();
      // this.$router.push({ name: "Home" });
    },
    getPaySgin() {
      this.http
        .form(`/api/wx/getSign`, {
          openId: this.user.openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            const {
              timeStamp: timestamp,
              nonceStr,
              package: packages, //package是严格模式下的保留字
              signType,
              paySign
            } = resp.data;
            wx.chooseWXPay({
              timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr, // 支付签名随机串，不长于 32 位
              package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign, // 支付签名
              success: res => {
                // 支付成功后的回调函数
                this.paySuccess();
              }
            });
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    paySuccess() {
      this.http
        .form(`/api/wx/pay/check`, {
          openId: this.user.openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("支付成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>
