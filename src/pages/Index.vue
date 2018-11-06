<template>
  <div class="p-index">
    <div class="main">
      <img src="../assets/img/1.png" alt="">
      <img src="../assets/img/2.png" alt="">
      <img src="../assets/img/3.png" alt="">
      <div class="nums-wrap">
        已经有
        <span v-for="item in numList" class="num">{{item}}</span>位宝宝报名
      </div>
      <vue-seamless v-if="$parent.join.length>0" :data="$parent.join" :class-option="seamlessOption" class="vue-seamless">
        <div class="users-wrap">
          <div v-for="item in $parent.join" class="user">
            <img :src="item.wxPic" alt="">
            <div>{{item.userName}}</div>
          </div>
        </div>
      </vue-seamless>
      <div class="pop-wrap">活动浏览量：{{$parent.pop}}</div>
      <img class="img-padding" src="../assets/img/4.png" alt="">
      <img class="img-padding" src="../assets/img/5.png" alt="">
      <img class="img-padding" src="../assets/img/6.png" alt="">
      <img class="img-padding" src="../assets/img/7.png" alt="">
      <img class="img-padding" src="../assets/img/8.png" alt="">
      <!-- <div v-for="(src,index) in imgList">
        <x-img :src="src"></x-img>
      </div> -->
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
    <audio id="audio" src="../../static/bg.mp3" autoplay loop></audio>
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
          <group>
            <x-input title="姓名" v-model="userName" required :disabled="user.userState==1" is-type="china-name"></x-input>
            <x-input title="手机" v-model="mobile" type="tel" required :disabled="user.userState==1" is-type="china-mobile"></x-input>
          </group>
          <div class="btn-wrap">
            <div v-if="user.userState==0" class="btn" @click="signUp">立即报名</div>
            <div v-else class="btn">已报名</div>
          </div>
        </div>
      </popup>
    </div>
    <div class="poster-mask" :class="{hidden:!isShowPoster}" @click.self="isShowPoster=false">
      <div v-if="posterSrc" class="poster-wrap">
        <p class="tip">↓↓长按图片可保存至本地或发送给朋友↓↓</p>
        <img :src="posterSrc" alt="">
      </div>
      <div v-else id="posterWrap" class="poster-wrap">
        <img src="../assets/img/poster.png" alt="">
        <img class="qrcode" :src="qrcodeSrc" alt="">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, XInput, Group, Popup, TransferDom, XImg } from "vux";
import { debug } from "util";
import vueSeamless from "vue-seamless-scroll";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
export default {
  components: {
    XButton,
    XInput,
    Group,
    Popup,
    XImg,
    vueSeamless
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      qrcodeSrc: "",
      posterSrc: "",
      isShowPoster: false,
      musicPlaying: true,
      signupPopup: false,
      userName: "",
      mobile: "",
      imgList: [
        require("../assets/img/1.png"),
        require("../assets/img/2.png"),
        require("../assets/img/3.png"),
        require("../assets/img/4.png"),
        require("../assets/img/5.png"),
        require("../assets/img/6.png"),
        require("../assets/img/7.png"),
        require("../assets/img/8.png")
      ],
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
    }
  },
  watch: {
    user() {
      const { userName, mobile } = this.user;
      this.userName = userName;
      this.mobile = mobile;
    },
    "$parent.joinTotal"() {
      this.numList = (this.$parent.joinTotal + "").split("");
    }
  },
  created() {
    const { userName, mobile } = this.user;
    this.userName = userName;
    this.mobile = mobile;
    this.numList = (this.$parent.joinTotal + "").split("");
  },
  methods: {
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
    },
    togglePlay() {
      const isPlaying = this.musicPlaying,
        audio = document.getElementById("audio");
      if (isPlaying) {
        this.musicPlaying = false;
        audio.pause();
      } else {
        this.musicPlaying = true;
        audio.play();
      }
    },
    signUp() {
      const { userName, mobile } = this,
        { openId } = this.user;
      if (!userName || !mobile) {
        this.$vux.toast.text("请填写完整信息");
        return;
      }
      this.http
        .post(`/api/wx/add/user`, {
          userName,
          mobile,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            // this.$vux.toast.text("报名成功，请支付");
            //这个需要重新请求更新下user状态
            this.$parent.getInfoByOpenId(openId);
            this.goPay(openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    goPay(openId) {
      this.http
        .form(`/api/wx/getSign`, {
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            const {
              timeStamp: timestamp,
              nonceStr,
              package: packages, //package是严格模式下的保留字
              signType,
              paySign
            } = resp.data;
            wx.chooseWXPay({
              timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr, // 支付签名随机串，不长于 32 位
              package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign, // 支付签名
              success: res => {
                // 支付成功后的回调函数
                this.paySuccess(openId);
              },
              cancel: () => {
                this.$parent.getInfoByOpenId(openId);
              }
            });
            this.signupPopup = false;
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    paySuccess(openId) {
      this.http
        .form(`/api/wx/pay/check`, {
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("支付成功");
            this.$parent.getInfoByOpenId(openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
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
    width: 80%;
    margin: 0 auto;
    > img {
      width: 100%;
    }
    .qrcode {
      position: absolute;
      right: 16%;
      bottom: 6%;
      width: 31%;
    }
    .tip {
      position: absolute;
      text-align: center;
      color: #fff;
      margin-bottom: 10px;
      top: -30px;
      right: 0;
      left: 0;
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
.btn-wrap {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.p-index {
  padding-bottom: 50px;
  background-image: url("../assets/img/bg.jpg");
  background-size: 100% auto;
  background-repeat: repeat-y;
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
      height: 30px;
      padding: 10px 0;
      margin: 0 auto;
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
    bottom: 70px;
    width: 50px;
  }
  .busi-fixed {
    position: fixed;
    right: 10px;
    bottom: 70px;
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


