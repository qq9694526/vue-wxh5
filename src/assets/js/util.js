import axios from 'axios';
const querystring = require('querystring');
const BaseUrl = "/zt-wx"
let http = {};
http.ajax = axios.create();
http.get = function (url, data) {
    return new Promise((resolve, reject) => {
        http.ajax.get(BaseUrl + url, data || {}).then((res) => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.status);
            }
        }).catch((error) => {
            reject(error);
        });
    })
}
http.post = function (url, data) {
    return new Promise((resolve, reject) => {
        http.ajax.post(BaseUrl + url, data).then((res) => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.status);
            }
        }).catch((error) => {
            reject(error);
        });
    })
}
http.form = function (url, data) {
    return new Promise((resolve, reject) => {
        http.ajax.post(BaseUrl + url, querystring.stringify(data), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }).then((res) => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.status);
            }
        }).catch((error) => {
            reject(error);
        });
    })
}

let storage = {}
storage.set = function (key, data) {
    const str = JSON.stringify(data);
    sessionStorage.setItem(key, str)
}
storage.get = function (key) {
    let data = sessionStorage.getItem(key) || null;
    return JSON.parse(data)
}

export default {
    http,
    storage
};