<template>
  <div class="p-register">
    <h1>申请成为商家</h1>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="user.userCate==0"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="user.userCate==0"></x-input>
      <x-input title="商户" v-model="busiName" required :disabled="user.userCate==0"></x-input>
    </group>
    <x-button v-if="user.userCate==0">审核中……</x-button>
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
      busiName: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    const { userName, mobile, busiName, openId, userCate } = this.user;
    this.userName = userName;
    this.mobile = mobile;
    this.busiName = busiName;
  },
  methods: {
    submit() {
      const { userName, mobile, busiName } = this,
        { openId } = this.user;
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

