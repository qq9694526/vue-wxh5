<template>
  <div class="p-index">
    <div>已报名{{$parent.joinTotal}}</div>
    <router-link to="signup">立即报名</router-link>
    <div>openId:{{user.openId}}</div>
    <div>userName:{{user.userName}}</div>
    <div>parentOpenId:{{$parent.parentOpenId}}</div>
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
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
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


