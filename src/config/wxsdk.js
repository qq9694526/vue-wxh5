import util from '../assets/js/util.js'

const reqUrl = location.href.split('#')[0];
//获取jssdk需要的签名等参数
util.http.form('/api/wx/get/sign', {
    reqUrl
}).then((resp) => {
    if (resp.errno == 0) {
        const { signature, appId, nonceStr, timestamp } = resp.data;
        wx.config({
            signature, appId, nonceStr, timestamp, debug: false, jsApiList: ["chooseImage", "onMenuShareTimeline", "onMenuShareAppMessage", "getLocalImgData", "updateAppMessageShareData"]
        })
    }
})

export default {
    setShare: (openId) => {
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
                link: 'http://www.zhaohaipeng.com?openId' + openId,
                imgUrl: '',
            }, function (res) {
                //这里是回调函数 
            });
        });
    }
}
