<template>
    <div>
        <h1>测试IOS路由</h1>
        <div>location.href: </div>
        <div>{{href}}</div>
        <div>isIos:{{isIos}}</div>
        <div>isIos1:{{isIos1}}</div>
    </div>
</template>
<script>
export default {
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

