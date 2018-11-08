import Vue from 'vue'
import Vuex from 'vuex'
import util from '@/assets/js/util.js'
import { ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(Vuex)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

const store = new Vuex.Store({
    state: {
        user: {},
        indexInfo: {
            join: [],
            joinTotal: 0,
            pop: 0
        }
    },
    mutations: {
        updateUser(state, data) {
            if (typeof data == "string") {
                Vue.$vux.loading.show();
                util.http.form(`/api/wx/get/info`, {
                    openId: data
                }).then(resp => {
                    Vue.$vux.loading.hide();
                    if (resp.errno == 0) {
                        const { join, joinTotal, pop, userInfo } = resp.data;
                        state.user = userInfo;
                        state.indexInfo = {
                            join: filtJoin(join),
                            joinTotal,
                            pop
                        };
                    } else {
                        Vue.$vux.toast.text(resp.errmsg);
                        //未获取到用户信息，重新进行网页授权,用户被删除但本地存储有openId的情况
                        window.localStorage.removeItem("openId");
                        window.location.reload();
                    }
                });
            } else {
                const { join, joinTotal, pop, userInfo } = data;
                state.user = userInfo;
                state.indexInfo = {
                    join: filtJoin(join),
                    joinTotal,
                    pop
                };
            }

        }
    }
})
function filtJoin(join) {
    if (join.length > 5) {
        const joinLimit = join.length % 5;
        join = join.slice(0, join.length - joinLimit);
    }
    return join;
}

export default store