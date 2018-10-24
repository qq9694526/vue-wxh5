<template>
    <div class="p-index">
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
            <router-link class="circle" to="admin"></router-link>
        </div>
    </div>
</template>
<script>
export default {};
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


