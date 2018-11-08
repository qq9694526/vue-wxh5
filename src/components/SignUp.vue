<template>
  <div class="p-signup">
    <group>
      <x-input title="宝宝姓名" v-model="userName" required :disabled="user.userState==1" is-type="china-name"></x-input>
      <popup-picker title="性别" :data="sexList" v-model="sex" placeholder="请选择"></popup-picker>
      <popup-picker title="年龄" :data="ageList" v-model="age" placeholder="请选择"></popup-picker>
      <x-input title="家长电话" v-model="mobile" type="tel" required :disabled="user.userState==1" is-type="china-mobile"></x-input>
    </group>
    <div class="btn-wrap">
      <div v-if="user.userState==0" class="btn" @click="signUp">立即报名</div>
      <div v-else class="btn">已报名</div>
    </div>
  </div>
</template>
<script>
import { XInput, Group, PopupPicker } from "vux";
import { debug } from "util";

export default {
  components: { XInput, Group, PopupPicker },
  data() {
    return {
      userName: "",
      mobile: "",
      age: [],
      sex: [],
      ageList: [[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
      sexList: [["女", "男"]]
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {},
  methods: {
    signUp() {
      let { userName, mobile, age, sex } = this,
        { openId } = this.user;
      age = age[0];
      sex = sex[0];
      if (!userName || !mobile || !age || !sex) {
        this.$vux.toast.text("请填写完整信息");
        return;
      }
      const userSex = sex == "女" ? 0 : 1;
      this.http
        .post(`/api/wx/add/user`, {
          userName,
          mobile,
          userSex,
          age,
          openId
        })
        .then(resp => {
          if (resp.errno == 0) {
            // this.$vux.toast.text("报名成功，请支付");
            //这个需要重新请求更新下user状态
            // this.$store.commit("updateUser", openId);
            this.goPay(openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    },
    goPay(openId) {
      this.http
        .form(`/api/wx/getSign`, {
          openId
        })
        .then(resp => {
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
              cancel: () => {
                this.$store.commit("updateUser", openId);
              }
            });
            this.signupPopup = false;
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
            this.$store.commit("updateUser", openId);
          } else {
            this.$vux.toast.text(resp.errmsg);
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.btn-wrap {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>


