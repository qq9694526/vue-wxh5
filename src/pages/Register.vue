<template>
  <div class="p-register">
    <div class="title">申请成为商家</div>
    <group>
      <x-input title="姓名" v-model="userName" required :disabled="user.userCate==0"></x-input>
      <x-input title="手机" v-model="mobile" required :disabled="user.userCate==0" is-type="china-mobile"></x-input>
      <x-input title="商户" v-model="busiName" required :disabled="user.userCate==0"></x-input>
    </group>
    <div v-if="user.userCate==0" class="btn">审核中……</div>
    <div v-else class="btn" @click="submit">提交申请</div>
    <!-- <x-button v-if="user.userCate==0">审核中……</x-button>
    <x-button v-else type="primary" @click.native="submit">提交申请</x-button> -->
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
  watch: {
    user() {
      const { userName, mobile, busiName, openId, userCate } = this.user;
      this.userName = userName || "";
      this.mobile = mobile || "";
      this.busiName = busiName || "";
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
      if (!userName || !mobile || !busiName) {
        this.$vux.toast.text("请填写完整信息");
        return;
      }
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
            this.$parent.getInfoByOpenId(openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.p-register {
  text-align: center;
  .title {
    color: #333;
    font-size: 20px;
    margin-top: 30px;
  }
  .btn {
    margin: 20px 0;
  }
}
</style>


