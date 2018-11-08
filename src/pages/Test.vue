<template>
    <div class="p-test">
        <h1>微信上传图片测试</h1>
        <div class="btn" @click="$router.push('test1')">跳转Test1</div>

        <div class="btn" @click="chooseImage">上传图片</div>
        <div>
            文件大小：{{imgSize}}
        </div>
        <hr/>
        <div class="section">
            <h2>chooseImageRes</h2>
            <div>{{chooseImageRes}}</div>
        </div>
        <hr/>
        <div class="section">
            <h2>getLocalImgDataRes</h2>
            <div>{{getLocalImgDataRes}}</div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      chooseImageRes: "",
      getLocalImgDataRes: "",
      imgSize: 0
    };
  },
  created() {
  },
  methods: {
    chooseImage() {
      const self = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.chooseImageRes = JSON.stringify(res);
          const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          this.getLocalImg(localIds[0]);
        }
      });
    },
    getLocalImg(localId) {
      const self = this;
      wx.getLocalImgData({
        localId, // 图片的localID
        success: res => {
          this.getLocalImgDataRes = JSON.stringify(res);
          this.imgSize = this.getImgSize(res.localData);
          if (imgSize > 1 * 1024 * 1024) {
            alert(imgSize);
            return;
          }
        }
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
<style scoped>
.section {
  word-wrap: break-word;
}
</style>


