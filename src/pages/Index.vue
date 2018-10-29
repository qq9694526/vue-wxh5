<template>
  <div class="p-index">
    <div>已报名{{joinTotal}}</div>
    <router-link to="signup">立即报名</router-link>
    <img src="../assets/img/index1.jpeg" alt="">
    <img src="../assets/img/index2.jpeg" alt="">
    <img src="../assets/img/index3.jpeg" alt="">
    <img src="../assets/img/index4.jpeg" alt="">
    <img src="../assets/img/index5.jpg" alt="">
    <img src="../assets/img/index6.jpeg" alt="">
    <img src="../assets/img/index7.jpg" alt="">
    <img src="../assets/img/index8.jpeg" alt="">
    <img src="../assets/img/index9.jpeg" alt="">
    <div class="fixed-wrap">
      <!-- userCate//0-待审核商户，1-普通用户,2已审核商户,3-已报名用户（未缴费） -->
      <router-link v-if="user.userCate==2" class="circle" to="admin"></router-link>
      <router-link v-else class="circle" to="register"></router-link>
      <!-- <router-link class="circle" to="register"></router-link> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      join: [],
      joinTotal: 0,
      user: {}
    };
  },
  created() {
    // const openId="oJfSQ50fHFMmyzUFVYYx89eTyfa8";//赵海鹏
    // const openId="xxaa";//超级管理员
    const openId = "oJfSQ59F5-q1_j0hs3NKTWAplSSA"; //郭帅

    this.getInfoByOpenId(openId);
  },
  methods: {
    getInfo() {
      this.$vux.loading.show();
      const code = "021QPaT62tzW3K0JYQS62p1LS62QPaT4";
      this.http
        .form(`/api/wx/info`, {
          code,
          otherOpenId: ""
        })
        .then(resp => {
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            const { join, joinTotal, userInfo } = resp.data;
            this.user = userInfo;
            this.join = join;
            this.joinTotal = joinTotal;
            this.storage.set("userInfo", userInfo);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    getInfoByOpenId(openId) {
      this.$vux.loading.show();
      this.http
        .form(`/api/wx/get/info`, {
          openId
        })
        .then(resp => {
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            const { join, joinTotal, userInfo } = resp.data;
            this.user = userInfo;
            this.join = join;
            this.joinTotal = joinTotal;
            this.storage.set("userInfo", userInfo);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.p-index {
  > img {
    display: block;
    width: 100%;
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


