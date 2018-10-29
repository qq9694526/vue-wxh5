<template>
    <div class="p-hoem">
        <h1>我的主页</h1>
        <x-button type="primary" @click.native="signUp" mini>签到</x-button>

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
      user: {}
    };
  },
  created() {
    const user = this.storage.get("userInfo");
    if (user) {
      console.log(user);
      this.user = user;
    } else {
      this.$vux.toast.text("用户信息获取失败，请稍后重试");
    }
  },
  methods: {
    signUp() {
      const { openId } = this.user;
      this.http
        .form(`/api/wx/sign/up`, {
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("签到成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>

