<template>
    <div class="p-rank-list">
        <div>
            <!-- <load-more tip="default" :show-loading="false" background-color="#fbf9fe"></load-more> -->
            <div style="padding:15px;">
                <x-table full-bordered style="background-color:#fff">
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
                        <tr>
                            <td>0</td>
                            <td>总计</td>
                            <td>100</td>
                            <td>10</td>
                            <td>20</td>
                            <td>9900</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>小太阳</td>
                            <td>100</td>
                            <td>10</td>
                            <td>20</td>
                            <td>9900</td>
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
  }
};
</script>

