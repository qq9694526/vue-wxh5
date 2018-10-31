<template>
  <div class="p-sign-up">
    <h1>报名</h1>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="user.userCate==3"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="user.userCate==3"></x-input>
    </group>
    <x-button v-if="user.userCate==3" type="primary" @click.native="goPay">支付99元</x-button>
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
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
