// wx-js-sdk授权
import util from '../assets/js/util.js'

//获取jssdk需要的签名等参数
export default {
    initConfig: (reqUrl) => {
        util.http.post('/api/wx/get/sign', {
            reqUrl
        }).then((resp) => {
            if (resp.errno == 0) {
                const { signature, appId, nonceStr, timestamp } = resp.data;
                wx.config({
                    signature, appId, nonceStr, timestamp, debug: false, jsApiList: ["chooseWXPay", "chooseImage", "onMenuShareTimeline", "onMenuShareAppMessage", "getLocalImgData", "updateAppMessageShareData"]
                })
            }
        })
    },
    setShare: (openId) => {
        const origin = location.origin;
        wx.ready(function () {
            //“分享给朋友”
            wx.onMenuShareAppMessage({
                title: '分享给朋友',
                desc: '我的openid' + openId,
                link: origin + '?openId=' + openId,
            }, function (res) {
                //这里是回调函数 
            });
            //“分享到朋友圈”
            wx.onMenuShareTimeline({
                title: '“分享到朋友圈”',
                link: origin + '?openId' + openId,
                imgUrl: '',
            }, function (res) {
                //这里是回调函数 
            });
        });
    }
}
