<template>
  <div class="p-register">
    <h1>申请成为商家</h1>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="userCate==0"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="userCate==0"></x-input>
      <x-input title="商户" v-model="busiName" required :disabled="userCate==0"></x-input>
    </group>
    <x-button v-if="userCate==0">审核中……</x-button>
    <x-button v-else type="primary" @click.native="submit">提交申请</x-button>
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
      busiName: "",
      openId: "xxaa",
      userCate: 1
    };
  },
  created() {
    const user = this.storage.get("userInfo");
    if (user) {
      console.log(user);
      const { userName, mobile, busiName, openId, userCate } = user;
      this.userName = userName;
      this.mobile = mobile;
      this.busiName = busiName;
      this.openId = openId;
      this.userCate = userCate;
    } else {
      this.$vux.toast.text("用户信息获取失败，请稍后重试");
    }
  },
  methods: {
    submit() {
      const { userName, mobile, busiName, openId } = this;
      this.http
        .post(`/api/wx/add/busi`, {
          userName,
          mobile,
          busiName,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("提交成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>

