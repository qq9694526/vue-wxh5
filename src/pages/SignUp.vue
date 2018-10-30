<template>
  <div class="p-sign-up">
    <h1>报名</h1>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="userCate==3"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="userCate==3"></x-input>
    </group>
    <x-button v-if="userCate==3" type="primary" @click.native="goPay">支付99元</x-button>
    <x-button v-else @click.native="signUp">立即报名</x-button>
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
      mobile: "",
      userCate: 1
    };
  },
  created() {
    const user = this.storage.get("userInfo");
    if (user) {
      const { userName, mobile, openId, userCate } = user;
      this.userName = userName;
      this.mobile = mobile;
      this.openId = openId;
      this.userCate = userCate;
    } else {
      this.$vux.toast.text("用户信息获取失败，请稍后重试");
    }
  },
  methods: {
    signUp() {
      const { userName, mobile, openId } = this;
      this.http
        .post(`/api/wx/add/user`, {
          userName,
          mobile,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("报名成功，请支付");
            this.userCate = 3;
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    goPay() {
      //支付成功回调 /api/wx/pay/check
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
