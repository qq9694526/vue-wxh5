<template>
  <div class="p-home">
    <img class="logo-top" src="../assets/img/logo-top.png" alt="">
    <div class="userinfo">
      <img :src="user.wxPic" alt="">
      <div class="text">
        <div class="name">{{user.userName}}</div>
        <div class="tel">{{user.mobile}}</div>
      </div>
    </div>
    <div class="desc">
      1、报名并支付报名费，点亮国学少年勋章；</br>
      2、连续在朋友圈分享活动海报3天，打卡三天，点亮打卡勋章；</br>
      3、到影楼选取孩子的国学少年模卡上传活动平台封面秀，攒够（50）人气值，点亮人气勋章
    </div>
    <div class="medal-wrap2">
      <div class="item">
        <img v-if="user.orPay==1" src="../assets/img/medal-1.png" alt="">
        <img v-else src="../assets/img/medal-1-0.png" alt="">
        <p class="name">国学少年勋章</p>
        <div v-if="user.orPay==1" class="btn">已支付</div>
        <div v-else class="btn" @click="goPay">继续支付</div>
      </div>
      <div class="item">
        <img v-if="user.signUp>=3" src="../assets/img/medal-2.png" alt="">
        <img v-else src="../assets/img/medal-2-0.png" alt="">
        <p class="name">打卡勋章</p>
        <div v-if="user.remark3==1" class="btn">今日已打卡</div>
        <div v-else class="btn" @click="signUp">打卡</div>
        <div class="tip">已打卡{{user.signUp||0}}次</div>
      </div>
    </div>
    <div class="medal-wrap">
      <div class="item left">
        <img v-if="user.picAddress" src="../assets/img/medal-3.png" alt="">
        <img v-else src="../assets/img/medal-3-0.png" alt="">
        <p class="name">人气勋章</p>
        <div class="tip">上传图片后可生成海报</div>
      </div>
      <div class="item right">
        <div class="img-wrap" @click="chooseImage">
          <div class="img-place"></div>
          <img v-if="user.picAddress" :src="user.picAddress" alt="">
          <div v-else class="tip">建议图片比例1:1.25</div>
        </div>
        <div v-if="user.qrAddress" class="btn" @click="isShowPoster=true">我的海报</div>
        <div v-else-if="user.picAddress" class="btn" @click="previewPoster">海报预览</div>
        <div v-else class="btn" @click="chooseImage">上传图片</div>
      </div>
    </div>
    <div class="poster-mask" :class="{hidden:!isShowPoster}" @click.self="isShowPoster=false">
      <div v-if="user.qrAddress" class="poster-wrap">
        <p class="tip">↓↓长按图片保存至本地或发送给朋友↓↓</p>
        <img :src="posterSrc||user.qrAddress" alt="">
      </div>
      <div v-else-if="posterSrc" class="poster-wrap">
        <p class="tip">↓↓长按图片保存至本地或发送给朋友↓↓</p>
        <img :src="posterSrc" alt="">
      </div>
      <div v-else class="poster-wrap">
        <div id="posterWrap">
          <img src="../assets/img/poster-bg.jpg" alt="">
          <div class="content">
            <div class="poster-img-wrap">
              <div class="poster-img-place"></div>
              <img class="poster-img" :src="user.picAddress" alt="">
            </div>
            <div class="text">我是【{{user.userName}}】，为“国学少年”代言</div>
            <img class="qrcode" :src="qrcodeSrc" alt="">
            <canvas id="canvas"></canvas>
          </div>
        </div>
        <div class="btn-create" @click="createPoster">确定生成</div>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton, XInput, Group } from "vux";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { setTimeout } from "timers";

export default {
  components: {
    XButton,
    XInput,
    Group
  },
  data() {
    return {
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
  created() {
    this.wxsdk.initConfig(location.href.split("#")[0], () => {
      this.wxsdk.setShare(this.user.openId);
    });
  },
  methods: {
    previewPoster() {
      this.isShowPoster = true;
      const myPosterWrap = document.getElementById("posterWrap");
      if (!this.qrcodeSrc) {
        this.useqrcode();
      }
    },
    createPoster() {
      this.$vux.loading.show();
      this.isShowPoster = true;
      const myPosterWrap = document.getElementById("posterWrap");
      setTimeout(() => {
        html2canvas(myPosterWrap).then(canvas => {
          this.posterSrc = canvas.toDataURL("image/png");
          this.uploadPosterImg(this.posterSrc);
        });
      }, 1000);
    },
    useqrcode() {
      //生成的二维码内容，可以添加变量
      const self = this;
      // const text = location.origin + "?openId=" + this.user.openId;
      const text = location.origin + "?openId=" + this.user.openId;
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, text, function(error) {
        if (error) console.error(error);
        self.qrcodeSrc = canvas.toDataURL("image/png");
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
          this.$vux.loading.hide();
          if (resp.errno == 0) {
            //更新个人信息
            this.$store.commit("updateUser", openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
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
            this.$store.commit("updateUser", openId);
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
            this.$vux.toast.text("打卡成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
          this.$store.commit("updateUser", openId);
        });
    },
    chooseImage() {
      const self = this;
      if (self.user.signUp < 3) {
        self.$vux.toast.text("打卡3次后才能上传哦");
        return;
      }
      if (self.user.qrAddress) {
        return;
      }
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          self.getLocalImg(localIds[0]);
        }
      });
    },
    getLocalImg(localId) {
      const self = this;
      wx.getLocalImgData({
        localId, // 图片的localID
        success: res => {
          let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          localData = localData.replace("jgp", "jpeg");
          localData = localData.replace("data:image/jpeg;base64,", "");
          const imgSize = self.getImgSize(localData);
          if (imgSize > 3 * 1024 * 1024) {
            self.$vux.toast.text("图片不能超过3M,请压缩后上传");
            return;
          }
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
            this.$store.commit("updateUser", openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
          this.$vux.loading.hide();
        });
    },
    getImgSize(base64url) {
      //获取base64图片大小，返回MB数字
      var str = base64url.replace("data:image/png;base64,", "");
      var equalIndex = str.indexOf("=");
      if (str.indexOf("=") > 0) {
        str = str.substring(0, equalIndex);
      }
      var strLength = str.length;
      var fileLength = parseInt(strLength - strLength / 8 * 2);
      return fileLength;
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
#posterWrap {
  position: relative;
}
.btn-create {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 150px;
  text-align: center;
  color: #fff;
  background-color: #fdbe03;
  font-size: 14px;
  margin: 10px auto 0 auto;
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
    width: 75%;
    margin: 0 auto;
    img {
      width: 100%;
    }
    .img-place {
      width: 100%;
      padding-top: 125%;
    }
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .poster-top {
        position: absolute;
        top: 3%;
        left: 0;
        right: 0;
        width: 60%;
        margin: 0 auto;
      }
      .poster-bottom {
        position: absolute;
        top: 74%;
        left: 13%;
        width: 37%;
      }
      .poster-img-wrap {
        position: absolute;
        top: 28%;
        left: 0;
        right: 0;
        width: 80%;
        margin: 0 auto;
        // &:after {
        //   position: absolute;
        //   content: "";
        //   width: 100%;
        //   height: 100%;
        //   top: 0;
        //   left: 0;
        //   box-shadow: 0 0 10px 20px #fff inset;
        // }
        .poster-img-place {
          width: 100%;
          padding-top: 125%;
        }
        .poster-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
      .text {
        position: absolute;
        width: 100%;
        bottom: 13.5%;
        text-align: center;
      }
    }
    .qrcode {
      position: absolute;
      right: 3%;
      bottom: 0;
      width: 25%;
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
.p-home {
  background-image: url("../assets/img/medal-bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: #fff;
  padding: 0 20px;
  min-height: 100%;
  box-sizing: border-box;
  img {
    display: block;
    width: 60%;
    margin: 0 auto;
  }
  .logo-top {
    width: 100%;
    display: block;
    padding: 10px 0;
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
    margin-bottom: 20px;
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
          width: 60%;
          margin: 0 auto 10px auto;
          .img-place {
            width: 100%;
            padding-top: 125%;
          }
          img {
            position: absolute;
            width: 100%;
            top: 0;
            height: 100%;
          }
          .tip {
            position: absolute;
            margin: 0 auto;
            top: 40%;
            color: #666;
            text-align: center;
            width: 100%;
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


