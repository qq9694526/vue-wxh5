import Vue from 'vue'
import util from './util.js'
import { WechatPlugin, ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(WechatPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

const wx = Vue.wechat;
const reqUrl = location.href.split('#')[0];

const parentOpenId = getUrlParam("openId") || "",
    code = getUrlParam("code"),
    user = util.storage.get("userInfo"),
    openId = user ? user.openId : "";

if (openId) {
    initSdk();
    getInfoByOpenId(openId);//更新信息
    alert("openId:" + openId)
    alert("parentOpenId:" + parentOpenId)
} else {
    if (code) {//根据code获取openId等信息
        getInfoByCode(code);
        alert("openId:" + openId)
        alert("parentOpenId:" + parentOpenId)
    } else {
        const appid = "wx9cb9ed7d7cc504b7",
            url = encodeURIComponent(reqUrl);
        location.href = `http://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    }
}
function getInfoByCode(code) {
    Vue.$vux.loading.show();
    util.http.form(`/api/wx/info`, {
        code,
        otherOpenId: parentOpenId
    }).then(resp => {
        Vue.$vux.loading.hide();
        if (resp.errno == 0) {
            const { join, joinTotal, userInfo } = resp.data,
                indexInfo = { join, joinTotal };
            util.storage.set("indexInfo", indexInfo);
            util.storage.set("userInfo", userInfo);
        } else {
            Vue.$vux.toast.text(resp.errmsg);
        }
    });
}
function getInfoByOpenId(openId) {
    Vue.$vux.loading.show();
    util.http.form(`/api/wx/get/info`, {
        openId,
        otherOpenId: parentOpenId
    }).then(resp => {
        Vue.$vux.loading.hide();
        if (resp.errno == 0) {
            const { join, joinTotal, userInfo } = resp.data,
                indexInfo = { join, joinTotal };
            util.storage.set("indexInfo", indexInfo);
            util.storage.set("userInfo", userInfo);
        } else {
            Vue.$vux.toast.text(resp.errmsg);
        }
    });
}

function initSdk() {
    //获取jssdk需要的签名等参数
    util.http.form('/api/wx/get/sign', {
        reqUrl
    }).then((resp) => {
        if (resp.errno == 0) {
            const { signature, appId, nonceStr, timestamp } = resp.data;
            wx.config({
                signature, appId, nonceStr, timestamp, debug: false, jsApiList: ["chooseImage", "onMenuShareTimeline", "onMenuShareAppMessage"]
            })
        } else {
            // this.$vux.toast.text(resp.errmsg);
        }
    })
    wx.ready(function () {
        //“分享给朋友”
        wx.onMenuShareAppMessage({
            title: '分享给朋友',
            desc: '我的openid' + openId,
            link: 'http://www.zhaohaipeng.com?openId=' + openId,
        }, function (res) {
            //这里是回调函数 
        });
        //“分享到朋友圈”
        wx.onMenuShareTimeline({
            title: '“分享到朋友圈”',
            link: 'http://www.zhaohaipeng.com?openId=123213',
            imgUrl: '',
        }, function (res) {
            //这里是回调函数 
        });
    });
}
//获取url中参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
