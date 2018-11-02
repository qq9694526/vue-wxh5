import util from './util.js'

export default {
    install: (Vue) => {
        Vue.prototype.$updateUserInfo = (openId) => {
            util.http.form(`/api/wx/get/info`, { openId }).then(resp => {
                if (resp.errno == 0) {
                    const { userInfo } = resp.data;
                    console.log(Vue.$store)
                    Vue.$store.commit("updateUser", userInfo);
                } else {
                    Vue.$vux.toast.text(resp.errmsg);
                }
            });
        }

    }
}