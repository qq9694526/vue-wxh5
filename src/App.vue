<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
body {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  background-color: #fbf9fe;
  font-family: "微软雅黑";
  font-size: 14px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
