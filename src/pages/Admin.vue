<template>
    <div class="p-admin">
        <!-- <view-box ref="viewBox"> -->
        <!-- <p v-for="i in 100">{{i}}</p> -->
        <router-view></router-view>
        <tabbar>
            <tabbar-item link="/">
                <span slot="label">活动首页</span>
            </tabbar-item>
            <tabbar-item selected link="/admin/performance">
                <span slot="label">我的业绩</span>
            </tabbar-item>
            <tabbar-item link="/admin/ranklist">
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
  created(){
      console.log(this.$route.path)
  }
};
</script>
<style scoped lang="less">
.p-admin {
  padding-bottom: 50px;
  .weui-tabbar {
    position: fixed;
  }
}
</style>



