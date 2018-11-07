<template>
  <div class="p-index">
    <div class="main">
      <img src="../assets/img/1.jpg" alt="">
      <img src="../assets/img/2.jpg" alt="">
      <div class="nums-wrap">
        已经有
        <span v-for="item in numList" class="num">{{item}}</span>位宝宝报名
      </div>
      <vue-seamless v-if="indexInfo.joinTotal>0" :data="indexInfo.join" :class-option="seamlessOption" class="vue-seamless">
        <div class="users-wrap">
          <div v-for="item in indexInfo.join" class="user">
            <img :src="item.wxPic" alt="">
            <div>{{item.userName}}</div>
          </div>
        </div>
      </vue-seamless>
      <div class="pop-wrap">活动浏览量：{{indexInfo.pop}}</div>
      <img src="../assets/img/3.jpg" alt="">
      <img src="../assets/img/4.jpg" alt="">
      <img src="../assets/img/5.jpg" alt="">
    </div>
    <div class="bottom">
      <router-link class="circle" to="/register">成为商家</router-link>
      <!-- <div class="circle" @click="$router.push('register')">成为商家</div> -->
    </div>
    <a class="tel-fixed" href="tel:4008001234">
      <img src="../assets/img/icon-tel.png" alt="">
    </a>
    <a v-show="user.userCate==1" class="busi-fixed" href="/admin">
      <img src="../assets/img/icon-admin.png" alt="">
    </a>
    <div class="aduio-wrap" @click="togglePlay">
      <img v-if="musicPlaying" src="../assets/img/music-runing.gif" alt="">
      <img v-else src="../assets/img/music-stop.png" alt="">
    </div>
    <audio v-if="autoplay" id="audio" src="../../static/bg.mp3" autoplay loop></audio>
    <audio v-else id="audio" src="../../static/bg.mp3" loop></audio>
    <!-- userState用户标示（0-普通用户，1，已报名（未缴费）） -->
    <div class="btn-fixed">
      <img v-if="user.userState==0" @click="signupPopup=true" src="../assets/img/signup.png" alt="">
      <div v-else class="flex-btn">
        <div class="left">
          <img @click="showPoster" src="../assets/img/share.png" alt="">
        </div>
        <div class="right">
          <img @click="$router.push('home')" src="../assets/img/mymedal.png" alt="">
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="signupPopup" position="top">
        <div class="popup0">
          <sign-up></sign-up>
        </div>
      </popup>
    </div>
    <div class="poster-mask" :class="{hidden:!isShowPoster}" @click.self="isShowPoster=false">
      <div v-if="posterSrc" class="poster-wrap">
        <p class="tip">↓↓长按图片保存至本地或发送给朋友↓↓</p>
        <img :src="posterSrc" alt="">
      </div>
      <div v-else id="posterWrap" class="poster-wrap">
        <img src="../assets/img/poster.jpg" alt="">
        <p class="text">我是【{{user.userName}}】特邀请你来参加“国学少年”</p>
        <img class="qrcode" :src="qrcodeSrc" alt="">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import SignUp from "@/components/SignUp";
import { Popup, TransferDom, XImg } from "vux";
import vueSeamless from "vue-seamless-scroll";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
export default {
  components: {
    Popup,
    XImg,
    vueSeamless,
    SignUp
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      autoplay: true,
      qrcodeSrc: "",
      posterSrc: "",
      isShowPoster: false,
      musicPlaying: true,
      signupPopup: false,
      numList: [0],
      seamlessOption: {
        step: 0.5,
        limitMoveNum: 10
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    indexInfo(value) {
      const indexInfo = this.$store.state.indexInfo;
      this.numList = (indexInfo.joinTotal + "").split("");
      return indexInfo;
    }
  },
  created() {
    this.numList = (this.indexInfo.joinTotal + "").split("");
    const autoplay = window.localStorage.getItem("autoplay") == 1;
    if (!autoplay) {
      this.musicPlaying = false;
      this.autoplay = false;
    }
  },
  mounted() {
    // 微信提供的事件，微信浏览器内部初始化完成后
    document.addEventListener(
      "WeixinJSBridgeReady",
      () => {
        document.getElementById("audio").load();
      },
      false
    );
  },
  methods: {
    togglePlay() {
      const isPlaying = this.musicPlaying,
        audio = document.getElementById("audio");
      if (isPlaying) {
        this.musicPlaying = false;
        audio.pause();
        window.localStorage.setItem("autoplay", "0");
        this.autoplay = false;
      } else {
        this.musicPlaying = true;
        audio.play();
        window.localStorage.setItem("autoplay", "1");
        this.autoplay = true;
      }
    },
    showPoster() {
      this.isShowPoster = true;
      if (this.posterSrc) {
        return;
      }
      this.$vux.loading.show();
      const myPosterWrap = document.getElementById("posterWrap");
      this.useqrcode(() => {
        setTimeout(() => {
          html2canvas(myPosterWrap).then(canvas => {
            this.posterSrc = canvas.toDataURL("image/png");
            this.$vux.loading.hide();
          });
        }, 1000);
      });
    },
    useqrcode(callback) {
      //生成的二维码内容，可以添加变量
      const self = this;
      const text = location.origin + "?openId=" + this.user.openId;
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, text, function(error) {
        if (error) console.error(error);
        self.qrcodeSrc = canvas.toDataURL("image/png");
        callback();
      });
    }
  }
};
</script>
<style lang="less" scoped>
#canvas {
  position: absolute;
  right: 16%;
  bottom: 6%;
  width: 31%;
  z-index: -100;
}
.poster-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  &.hidden {
    display: none;
  }
  .poster-wrap {
    position: relative;
    display: block;
    width: 75%;
    margin: 0 auto;
    > img {
      width: 100%;
    }
    .qrcode {
      position: absolute;
      right: 3%;
      bottom: 0;
      width: 25%;
    }
    .text {
      position: absolute;
      width: 100%;
      bottom: 14%;
      text-align: center;
    }
    .tip {
      position: fixed;
      text-align: center;
      color: #fff;
      margin-bottom: 10px;
      top: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 15px;
    }
  }
}
.vux-popup-dialog.vux-popup-top {
  background: #fff;
  width: 95%;
  margin: 0 auto;
  right: 0;
  top: 10px;
  .popup0 {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 20px;
  }
}

.p-index {
  padding-bottom: 50px;
  min-height: 100%;
  box-sizing: border-box;
  .img-padding {
    // width: 85%;
    margin: 40px auto;
  }
  img {
    display: block;
    width: 100%;
  }
  .vue-seamless {
    overflow: hidden;
    height: 178px;
    background-color: #515151;
  }
  .users-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: #515151;
    // height: 181px;
    box-sizing: border-box;
    padding: 0 10px;
    // overflow: hidden;
    .user {
      flex: 0 0 20%;
      text-align: center;
      box-sizing: border-box;
      color: #fff;
      padding: 8px 0;
      > img {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 50%;
      }
    }
  }
  .pop-wrap {
    background-color: #2f2f2f;
    color: #fff;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
  }
  .nums-wrap {
    display: flex;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    background-color: #fbda4e;
    justify-content: center;
    align-items: center;
    .num {
      display: inline-block;
      background-color: #333;
      width: 22px;
      height: 34px;
      line-height: 34px;
      color: #fbda4e;
      text-align: center;
      border-radius: 6px;
      margin: 0 3px;
      font-size: 16px;
      font-weight: 200;
    }
  }
  .bottom {
    background-color: #ccc;
    text-align: center;
    > a {
      color: #333;
      text-decoration: underline;
    }
  }
  .btn-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(38, 28, 28, 0.9);
    text-align: center;
    box-sizing: border-box;
    img {
      display: block;
      width: auto;
      height: 100%;
      height: 50px;
      margin: 0 auto;
      padding: 13px 0;
      box-sizing: border-box;
    }
    .flex-btn {
      display: flex;
      .left {
        flex: 0 0 50%;
        background-color: rgba(38, 28, 28, 0.9);
      }
      .right {
        flex: 0 0 50%;
        background-color: rgba(251, 218, 78, 0.9);
      }
    }
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
  .tel-fixed {
    position: fixed;
    left: 10px;
    bottom: 60px;
    width: 50px;
  }
  .busi-fixed {
    position: fixed;
    right: 10px;
    bottom: 60px;
    width: 50px;
  }
  .aduio-wrap {
    position: fixed;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>


