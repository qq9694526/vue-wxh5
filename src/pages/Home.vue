<template>
  <div class="p-home">
    <h1>我的主页</h1>
    <x-button type="primary" @click.native="signUp" mini>签到</x-button>
    <x-button type="primary" @click.native="myPoster" mini>我的海报</x-button>
    <x-button type="primary" @click.native="chooseImage" mini>上传图片</x-button>
    <div>--------我上传的图片-----</div>
    <img id="myPic" :src="user.picAddress" alt="">
    <div>--------我的海报-----</div>
    <div id="posterWrap">
      <h1>这是我的海报</h1>
      <img :src="base64data" alt="">
    </div>
    <img :src="posterSrc" alt="" style="border:1px solid #ccc;">
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
      base64data:"",
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
    signUp() {
      const { openId } = this.user;
      this.http
        .form(`/api/wx/sign/up`, {
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            this.$vux.toast.text("签到成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
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
  img {
    display: block;
    width: 60%;
    margin: 0 auto;
  }
}
</style>


