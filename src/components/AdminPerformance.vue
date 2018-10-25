<template>
    <div class="p-performance">
        <tab>
            <tab-item selected @on-item-click="onItemClick">未支付[0]人</tab-item>
            <tab-item @on-item-click="onItemClick">已支付[0]人</tab-item>
            <tab-item @on-item-click="onItemClick">全部勋章[0]人</tab-item>
        </tab>
        <div class="list">
            <div v-for="i in 10" class="item">
                <img src="../assets/img/headimg.jpeg" alt="">
                <div class="info">
                    <div class="line">
                        <span>赵海鹏</span>
                        <span>15638830111</span>
                    </div>
                    <div class="line">
                        <span>状态:已支付</span>
                        <span>封面:已上传</span>
                    </div>
                    <div class="line">
                        <span>业绩:卫视在线网</span>
                        <span>2018-6-20 16:24:52</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="../assets/img/headimg.jpeg" alt="">
                <div class="info">
                    <div class="line">
                        <span>赵海鹏</span>
                        <span>15638830111</span>
                    </div>
                    <div class="line">
                        <span>状态:未支付</span>
                        <span>封面:已上传</span>
                    </div>
                    <div class="line">
                        <span>业绩:卫视在线网</span>
                        <span>2018-6-20 16:24:52</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Tab, TabItem, TabbarItem } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    TabbarItem
  },
  methods: {
    onItemClick() {}
  }
};
</script>
<style lang="less" scoped>
.p-performance {
  .list {
    .item {
      display: flex;
      padding: 10px;
      background-color: #fff;
      margin: 15px 0;
      align-items: center;
      border-radius: 6px;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      > img {
        flex: 0 0 45px;
        width: 45px;
        height: 45px;
        margin-right: 10px;
      }
      .info {
        flex: 1;
        font-size: 14px;
        .line {
          display: flex;
          line-height: 20px;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>


