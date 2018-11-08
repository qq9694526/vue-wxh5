// wx-js-sdk授权
import util from '../assets/js/util.js'

//获取jssdk需要的签名等参数
export default {
    initConfig: (reqUrl, callback) => {
        util.http.post('/api/wx/get/sign', {
            reqUrl
        }).then((resp) => {
            if (resp.errno == 0) {
                const { signature, appId, nonceStr, timestamp } = resp.data;
                wx.config({
                    signature, appId, nonceStr, timestamp, debug: false, jsApiList: ["chooseWXPay", "chooseImage", "onMenuShareTimeline", "onMenuShareAppMessage", "getLocalImgData", "updateAppMessageShareData"]
                })
                if (callback) {
                    callback();
                }
            }
        })
    },
    setShare: (openId) => {
        const origin = location.origin;
        wx.ready(function () {
            //“分享给朋友”
            wx.onMenuShareAppMessage({
                title: '中原首届国学文化艺术节',
                desc: '为国学打call 为少年加油 国学少年成长路期待您的参与',
                imgUrl: "http://h5.ztuo.cn/img/shareimg.jpg",
                link: origin + '?openId=' + openId,
            }, function (res) {
                //这里是回调函数 
            });
            //“分享到朋友圈”
            wx.onMenuShareTimeline({
                title: '中原首届国学文化艺术节',
                desc: '为国学打call 为少年加油 国学少年成长路期待您的参与',
                imgUrl: "http://h5.ztuo.cn/img/shareimg.jpg",
                link: origin + '?openId' + openId,
            }, function (res) {
                //这里是回调函数 
            });
        });
    }
}
