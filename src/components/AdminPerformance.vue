<template>
  <div class="p-performance">
    <tab>
      <tab-item :selected="currentIndex==0" @on-item-click="onItemClick(0)">未支付[{{list[0].length}}]人</tab-item>
      <tab-item :selected="currentIndex==1" @on-item-click="onItemClick(1)">已支付[{{list[1].length}}]人</tab-item>
      <tab-item :selected="currentIndex==2" @on-item-click="onItemClick(2)">全部勋章[{{list[2].length}}]人</tab-item>
      <tab-item v-if="list[3]" :selected="currentIndex==3" @on-item-click="onItemClick(3)">待审核商家[{{list[3].length}}]人</tab-item>
    </tab>
    <div class="list">
      <div v-for="item in list[currentIndex]" class="item">
        <img :src="item.wxPic" alt="">
        <div v-if="currentIndex==3" class="info">
          <div class="line">
            <span>{{item.userName}}</span>
          </div>
          <div class="line">
            <span>{{item.busiName}}</span>
          </div>
          <div class="line">
            <span>{{item.mobile}}</span>
            <div>
              <span class="smallbtn" @click="busiReject(item.openId)">拒绝</span>
              <span class="smallbtn btn-p" @click="busiCheck(item.openId)">通过</span>
            </div>
          </div>
        </div>
        <div v-else class="info">
          <div class="line">
            <span>{{item.userName}}</span>
            <span>{{item.mobile}}</span>
          </div>
          <div class="line">
            <span>状态:{{item.orPay==0?"未支付":"已支付"}}</span>
            <span>封面:{{item.picAddress?"已上传":"未上传"}}</span>
          </div>
          <div class="line">
            <span>邀请商家:{{item.otherBusi||"无"}}</span>
            <span>{{item.createTime|dateFormat}}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { Tab, TabItem, TabbarItem, XButton, dateFormat } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    TabbarItem,
    XButton
  },
  data() {
    return {
      datas: {},
      list: [[], [], [], []],
      currentIndex: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    user() {
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  filters: {
    dateFormat
  },
  methods: {
    onItemClick(index) {
      this.currentIndex = index;
    },
    getList() {
      const { openId } = this.user;
      if (!openId) {
        return;
      }
      this.http.form(`/api/wx/eve/busi`, { openId }).then(resp => {
        if (resp.errno == 0) {
          const datas = resp.data;
          this.datas = datas;
          this.list = [
            datas.notPay.info,
            datas.pay.info,
            datas.medal.info,
            datas.check.info
          ];
        } else {
          this.$vux.toast.text(resp.errmsg);
        }
      });
    },
    busiCheck(openId) {
      this.http.form(`/api/wx/check`, { openId }).then(resp => {
        if (resp.errno == 0) {
          this.$vux.toast.text("审核通过");
          this.getList();
        } else {
          this.$vux.toast.text(resp.errmsg);
        }
      });
    },
    busiReject(openId) {
      this.http.form(`/api/wx/reject`, { openId }).then(resp => {
        if (resp.errno == 0) {
          this.$vux.toast.text("已拒绝");
          this.getList();
        } else {
          this.$vux.toast.text(resp.errmsg);
        }
      });
    }
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
        .smallbtn {
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 10px;
          margin: 0 5px;
          padding: 0 10px;
          &.btn-p {
            border: 1px solid #04be02;
            color: #04be02;
          }
        }
      }
    }
  }
}
</style>


