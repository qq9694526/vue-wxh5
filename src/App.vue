<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      join: [],
      joinTotal: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    this.parentOpenId = this.getUrlParam("openId") || "";
    const code = this.getUrlParam("code"),
      openId = localStorage.getItem("openId");
    if (openId) {
      this.getInfoByOpenId(openId);
    } else if (code) {
      this.getInfoByCode(code);
    }
  },
  watch: {
    $route() {
      if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
        location.reload();
      }
    }
  },
  methods: {
    updateUser(data) {
      const { join, joinTotal, userInfo, userInfo: { openId } } = data;
      this.wxsdk.setShare(openId);
      this.join = join;
      this.joinTotal = joinTotal;
      localStorage.setItem("openId", openId);
      this.$store.commit("updateUser", userInfo);
    },
    getInfoByCode(code) {
      this.$vux.loading.show();
      this.http
        .form(`/api/wx/info`, {
          code,
          otherOpenId: this.parentOpenId
        })
        .then(resp => {
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            this.updateUser(resp.data);
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
            this.updateUser(resp.data);
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
