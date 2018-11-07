<template>
  <div class="p-register">
    <div class="title">申请成为商家</div>
    <group>
      <x-input title="姓名" v-model="busiUsername" required :disabled="user.userCate==0||user.userCate==1"></x-input>
      <x-input title="手机" v-model="busiMobile" required :disabled="user.userCate==0||user.userCate==1" is-type="china-mobile"></x-input>
      <x-input title="商家名称" v-model="busiName" required :disabled="user.userCate==0||user.userCate==1"></x-input>
    </group>
    <!-- userCate（0-待审核商户，1-已审核商户，2-审核未通过商户） -->
    <div v-if="user.userCate==0" class="btn">审核中……</div>
    <div v-else-if="user.userCate==1" class="btn">审核已通过</div>
    <div v-else class="btn" @click="submit">提交申请</div>
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
      busiUsername: "",
      busiMobile: "",
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
      const {
        busiUsername,
        busiMobile,
        busiName,
        openId,
        userCate
      } = this.user;
      this.busiUsername = busiUsername || "";
      this.busiMobile = busiMobile || "";
      this.busiName = busiName || "";
    }
  },
  created() {
    const { busiUsername, busiMobile, busiName, openId, userCate } = this.user;
    this.busiUsername = busiUsername;
    this.busiMobile = busiMobile;
    this.busiName = busiName;
  },
  methods: {
    submit() {
      const { busiUsername, busiMobile, busiName } = this,
        { openId } = this.user;
      if (!busiUsername || !busiMobile || !busiName) {
        this.$vux.toast.text("请填写完整信息");
        return;
      }
      this.http
        .post(`/api/wx/add/busi`, {
          busiUsername,
          busiMobile,
          busiName,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("提交成功");
            this.$store.commit("updateUser", openId);
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


