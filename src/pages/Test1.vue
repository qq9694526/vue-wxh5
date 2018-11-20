<template>
  <div>
    <h1>测试Ximg</h1>
    <x-img :src="require('../assets/img/1.jpg')"></x-img>
    <x-img :src="require('../assets/img/2.jpg')"></x-img>
    <x-img :src="require('../assets/img/3.jpg')"></x-img>
    <x-img :src="require('../assets/img/4.jpg')"></x-img>
    <x-img :src="require('../assets/img/5.jpg')"></x-img>
    <h1>测试IOS路由</h1>
    <div>location.href: </div>
    <div>{{href}}</div>
    <div>isIos:{{isIos}}</div>
    <div>isIos1:{{isIos1}}</div>
  </div>
</template>
<script>
import { XImg } from "vux";
export default {
  components: {
    XImg
  },
  data() {
    return {
      href: "",
      isIos: false,
      isIos1: false
    };
  },
  created() {
    this.href = location.href.split("#")[0];
    let u = navigator.userAgent;
    this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this.isIos1 = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
  }
};
</script>
<style scoped>
img {
  display: block;
  width: 100%;
}
</style>


