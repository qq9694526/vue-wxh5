<template>
  <div class="p-hoem">
    <h1>我的主页</h1>
    <x-button type="primary" @click.native="signUp" mini>签到</x-button>
    <x-button type="primary" @click.native="chooseImage" mini>上传图片</x-button>
    <img :src="imgsrc" alt="">
  </div>
</template>
<script>
import { XButton, XInput, Group } from "vux";

export default {
  components: {
    XButton,
    XInput,
    Group
  },
  data() {
    return {
      user: {},
      imgsrc: ""
    };
  },
  created() {
    const user = this.storage.get("userInfo");
    if (user) {
      this.user = user;
    } else {
      this.$vux.toast.text("用户信息获取失败，请稍后重试");
    }
  },
  methods: {
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
      this.$wechat.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log(res);
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          self.imgsrc = localIds[0];
          self.getLocalImg(localIds[0]);
        }
      });
    },
    getLocalImg(localId) {
      const self = this;
      this.$wechat.getLocalImgData({
        localId, // 图片的localID
        success: function(res) {
          var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          self.uploadImg(localData);
        }
      });
    },
    uploadImg(localData) {
      const { openId } = this.user;
      this.http
        .form(`/api/wx/upload/pic`, {
          openId,
          file: localData
        })
        .then(resp => {
          // this.$vux.loading.hide();
          if (resp.errno == 0) {
            this.$vux.toast.text("上传成功");
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>

