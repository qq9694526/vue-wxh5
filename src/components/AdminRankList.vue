<template>
  <div class="p-rank-list">
    <div>
      <div style="padding:15px;">
        <div v-if="list.length==0">
          暂无数据
        </div>
        <x-table v-else full-bordered style="background-color:#fff">
          <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>已支付</th>
              <th>未支付</th>
              <th>已集齐</th>
              <th>总业绩</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,index) in list">
              <td>{{index}}</td>
              <td>{{row.busiName}}</td>
              <td>{{row.pay}}</td>
              <td>{{row.notPay}}</td>
              <td>{{row.medal}}</td>
              <td>{{row.amount}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, XTable, ViewBox } from "vux";

export default {
  components: {
    Tabbar,
    TabbarItem,
    XTable,
    ViewBox
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.http.post(`/api/wx/all/busi`, {}).then(resp => {
        if (resp.errno == 0) {
          this.list = resp.data;
        } else {
          this.$vux.toast.text(resp.errmsg);
        }
      });
    }
  }
};
</script>

