<template>
  <div class="p-home">
    <div class="userinfo">
      <img :src="user.wxPic" alt="">
      <div class="text">
        <div class="name">{{user.userName}}</div>
        <div class="tel">{{user.mobile}}</div>
      </div>
    </div>
    <div>
      获得国学少年印象诗.书.礼.乐精品主题小视频拍摄
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
      </div>
      <div class="item right">
        <div class="img-wrap">
          <div class="img-place"></div>
          <img v-if="user.picAddress" :src="user.picAddress" alt="">
          <div v-else class="">未上传</div>
        </div>
        <div class="btn" @click="chooseImage">上传图片</div>
      </div>
    </div>

    <!-- <x-button type="primary" @click.native="signUp" mini>签到</x-button> -->
    <!-- <x-button type="primary" @click.native="myPoster" mini>我的海报</x-button>
    <x-button type="primary" @click.native="chooseImage" mini>上传图片</x-button>
    <div>--------我上传的图片-----</div>
    <img id="myPic" :src="user.picAddress" alt="">
    <div>--------我的海报-----</div>
    <div id="posterWrap">
      <h1>这是我的海报</h1>
      <img :src="base64data" alt="">
    </div>
    <img :src="posterSrc" alt="" style="border:1px solid #ccc;"> -->
  </div>
</template>
<script>
import { XButton, XInput, Group } from "vux";
import html2canvas from "html2canvas";

export default {
  components: {
    XButton,
    XInput,
    Group
  },
  data() {
    return {
      base64data: "",
      posterSrc: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {},
  methods: {
    myPoster() {
      const myPosterWrap = document.getElementById("posterWrap");
      html2canvas(document.body).then(canvas => {
        // myPosterWrap.appendChild(canvas);
        this.posterSrc = canvas.toDataURL("image/png");
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
      flex: 0 0 70px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin-right: 20px;
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
        font-size: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        > img {
          display: inline-block;
          width: 70px;
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


