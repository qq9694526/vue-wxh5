<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    const parentOpenId = this.getUrlParam("openId") || "",
      code = this.getUrlParam("code"),
      openId = window.localStorage.getItem("openId");
    if (openId) {
      this.$store.commit("updateUser", openId);
      this.wxsdk.setShare(openId);
    } else if (code) {
      this.getInfoByCode(code, parentOpenId);
    }
    window.addEventListener("pageshow", function(e) {
      // 通过persisted属性判断是否存在 BF Cache
      if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent) && e.persisted) {
        location.reload();
      }
    });
  },
  methods: {
    getInfoByCode(code, otherOpenId) {
      this.$vux.loading.show();
      this.http
        .form(`/api/wx/info`, {
          code,
          otherOpenId
        })
        .then(resp => {
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            const { userInfo: { openId } } = resp.data;
            this.wxsdk.setShare(openId);
            window.localStorage.setItem("openId", openId);
            this.$store.commit("updateUser", resp.data);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
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
  font-family: Microsoft YaHei;
  font-size: 14px;
}
.vux-popup-mask {
  background: rgba(0, 0, 0, 0.2);
}
#app {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  left: 0;
  top: 0;
}
.btn {
  display: inline-block;
  width: 130px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  text-align: center;
  color: #fff;
  background-color: #fdbe03;
  font-size: 18px;
}
</style>
