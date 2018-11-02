<template>
  <div class="p-home">
    <div class="userinfo">
      <img :src="user.wxPic" alt="">
      <div class="text">
        <div class="name">{{user.userName}}</div>
        <div class="tel">{{user.mobile}}</div>
      </div>
    </div>
    <div class="desc">
      1、报名勋章，报名并支付报名费获取；</br>
      2、签到勋章，签到3次获取；</br>
      3、照片勋章，上传图片获取。
    </div>
    <div class="medal-wrap2">
      <div class="item">
        <img v-if="user.orPay==1" src="../assets/img/medal-1.png" alt="">
        <img v-else src="../assets/img/medal-1-0.png" alt="">
        <p class="name">报名勋章</p>
        <div v-if="user.orPay==1" class="btn">已支付</div>
        <div v-else class="btn" @click="goPay">继续支付</div>
      </div>
      <div class="item">
        <img v-if="user.signUp>=3" src="../assets/img/medal-2.png" alt="">
        <img v-else src="../assets/img/medal-2-0.png" alt="">
        <p class="name">签到勋章</p>
        <div v-if="user.remark3==1" class="btn">今日已签到</div>
        <div v-else class="btn" @click="signUp">签到</div>
        <div class="tip">已签到{{user.signUp||0}}次</div>
      </div>
    </div>
    <div class="medal-wrap">
      <div class="item left">
        <img v-if="user.picAddress" src="../assets/img/medal-3.png" alt="">
        <img v-else src="../assets/img/medal-3-0.png" alt="">
        <p class="name">照片勋章</p>
        <div class="tip">上传图片后可生成海报</div>
      </div>
      <div class="item right">
        <div class="img-wrap">
          <div class="img-place"></div>
          <img v-if="user.picAddress" :src="user.picAddress" alt="">
          <div v-else class="">未上传</div>
        </div>
        <div v-if="user.qrAddress" class="btn" @click="isShowPoster=true">我的海报</div>
        <div v-else-if="user.picAddress" class="btn" @click="createPoster">生成海报</div>
        <div v-else class="btn" @click="chooseImage">上传图片</div>
      </div>
    </div>
    <div class="poster-mask" :class="{hidden:!isShowPoster}" @click.self="isShowPoster=false">
      <div v-if="user.qrAddress" class="poster-wrap">
        <img :src="posterSrc||user.qrAddress" alt="">
      </div>
      <div v-else-if="posterSrc" class="poster-wrap">
        <img :src="posterSrc" alt="">
      </div>
      <div v-else id="posterWrap" class="poster-wrap">
        <img src="../assets/img/poster.png" alt="">
        <canvas id="canvas"></canvas>
        <img class="qrcode" :src="qrcodeSrc" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, XInput, Group } from "vux";
import html2canvas from "html2canvas";
import { setTimeout } from "timers";
import QRCode from "qrcode";

export default {
  components: {
    XButton,
    XInput,
    Group
  },
  data() {
    return {
      base64data: "",
      posterSrc: "",
      qrcodeSrc: "",
      isShowPoster: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {},
  methods: {
    createPoster() {
      this.$vux.loading.show();
      this.isShowPoster = true;
      const myPosterWrap = document.getElementById("posterWrap");
      this.useqrcode(() => {
        setTimeout(() => {
          html2canvas(myPosterWrap).then(canvas => {
            this.posterSrc = canvas.toDataURL("image/png");
            this.uploadPosterImg(this.posterSrc);
          });
        }, 1000);
      });
    },
    useqrcode(callback) {
      //生成的二维码内容，可以添加变量
      const self = this;
      // const text = location.origin + "?openId=" + this.user.openId;
      const text =
        "http://http://www.zhaohaipeng.com/?openId=" + this.user.openId;
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, text, function(error) {
        if (error) console.error(error);
        self.qrcodeSrc = canvas.toDataURL("image/png");
        callback();
      });
    },
    uploadPosterImg(base64) {
      const baseString = base64.replace("data:image/png;base64,", ""),
        { openId } = this.user;
      this.http
        .form(`/api/wx/uploadPic`, {
          openId,
          baseString,
          status: 1 //0-个人图片上传，1-合成图片上传
        })
        .then(resp => {
          if (resp.errno == 0) {
            //更新个人信息
            this.$store.commit("updateUser", resp.data);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
          this.$vux.loading.hide();
        });
    },
    goPay() {
      this.$vux.loading.show();
      const { openId } = this.user;
      this.http
        .form(`/api/wx/getSign`, {
          openId
        })
        .then(resp => {
          this.$vux.loading.hide();
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
              cancel: () => {}
            });
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
    },
    signUp() {
      this.$vux.loading.show();
      const { openId } = this.user;
      this.http
        .form(`/api/wx/sign/up`, {
          openId
        })
        .then(resp => {
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            this.$vux.toast.text("签到成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
          this.$parent.getInfoByOpenId(openId);
        });
    },
    chooseImage() {
      const self = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          self.getLocalImg(localIds[0]);
        }
      });
    },
    getLocalImg(localId) {
      const self = this;
      wx.getLocalImgData({
        localId, // 图片的localID
        success: function(res) {
          var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          localData = localData.replace("jgp", "jpeg");
          localData = localData.replace("data:image/jpeg;base64,", "");
          self.uploadImg(localData);
        }
      });
    },
    uploadImg(baseString) {
      this.$vux.loading.show();
      const { openId } = this.user;
      this.http
        .form(`/api/wx/uploadPic`, {
          openId,
          baseString,
          status: 0 //0-个人图片上传，1-合成图片上传
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("上传成功");
            //更新个人信息
            this.base64data = "data:image/jpeg;base64," + baseString;
            this.$store.commit("updateUser", resp.data);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
          this.$vux.loading.hide();
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
  }
}
.p-home {
  background-image: url("../assets/img/bg.png");
  background-size: 100% auto;
  background-repeat: repeat-y;
  padding: 30px 20px;
  min-height: 100%;
  box-sizing: border-box;
  img {
    display: block;
    width: 60%;
    margin: 0 auto;
  }
  .userinfo {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    > img {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
      border: 4px solid #fff;
    }
    .text {
      flex: 1;
      line-height: 2;
      .name {
        font-size: 16px;
      }
      .tel {
        color: #666;
      }
    }
  }
  .desc {
    padding: 0 10px;
  }
  .medal-wrap {
    display: flex;
    border: 2px dashed #333;
    border-radius: 6px;
    background-color: #fff;
    padding: 10px 0;
    .item {
      flex: 0 0 50%;
      text-align: center;
      &.left {
        position: relative;
        font-size: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: 20px;
        .name {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        > img {
          display: inline-block;
          width: 70px;
        }
        .tip {
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
          color: #fdbe03;
          font-size: 14px;
        }
      }
      &.right {
        .img-wrap {
          position: relative;
          width: 70%;
          margin: 0 auto 10px auto;
          .img-place {
            width: 100%;
            padding-top: 71.5%;
          }
          img {
            position: absolute;
            width: 100%;
            top: 0;
            height: 100%;
          }
        }
      }
    }
  }
  .medal-wrap2 {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    .item {
      position: relative;
      flex: 0 0 46%;
      text-align: center;
      border: 2px dashed #333;
      border-radius: 6px;
      background-color: #fff;
      padding: 10px 0 30px 0;
      .name {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
      }
      > img {
        display: inline-block;
        width: 70px;
      }
      .tip {
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        color: #fdbe03;
      }
    }
  }
}
</style>


