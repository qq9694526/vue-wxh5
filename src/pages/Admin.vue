<template>
    <div class="p-admin">
        <!-- <view-box ref="viewBox"> -->
        <!-- <p v-for="i in 100">{{i}}</p> -->
        <router-view></router-view>
        <tabbar>
            <tabbar-item link="/">
                <span slot="label">活动首页</span>
            </tabbar-item>
            <tabbar-item :selected="currentPath==='/admin/performance'||currentPath==='/admin'" link="/admin/performance">
                <span slot="label">我的业绩</span>
            </tabbar-item>
            <tabbar-item :selected="currentPath==='/admin/ranklist'" link="/admin/ranklist">
                <span slot="label">排行榜</span>
            </tabbar-item>
        </tabbar>
        <!-- </view-box> -->
    </div>
</template>
<script>
import { Tabbar, TabbarItem } from "vux";

export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      currentPath: "/admin/performancen"
    };
  },
  created() {
    this.currentPath = this.$route.path;
  },
  watch: {
    $route(to, from) {
      this.currentPath = to.path;
    }
  }
};
</script>
<style scoped lang="less">
.p-admin {
  min-height: calc(100% + 1px);
  padding-bottom: 50px;
  box-sizing: border-box;
  .weui-tabbar {
    position: fixed;
  }
}
</style>



