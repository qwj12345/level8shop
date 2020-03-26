import global from '@/components/global'

// 时间戳转
export function timeFormat(nS) {
    let date = new Date(parseInt(nS)) // 时间戳为10位需乘1000，为13位则不用
    console.log(date)
    let Y = date.getFullYear() // 年
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
    let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '' // 日
    // return 125896455;
    return `${Y}/${M}/${D}`; // yyyy-mm-dd
}
export function getToken(encryptedData,iv){
    // wx.setStorageSync('token', 'z7t16+yUU1iAOqgnO/7hnw==');
        // -----------------获取token------------------
        return new Promise(function(resolve,reject){
            wx.login({
                success (res) {
            
                    if (res.code) {
                        wx.request({
                            url: global.ip1+'miniProgram/api/get/shop/token', //仅为示例，并非真实的接口地址
                            data: {
                                encryptedData: encryptedData,
                                iv: iv,
                                code:res.code
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success (res) {
                                if(res.data.status === 0){
                                    wx.setStorageSync('token', res.data.token);
                                }else{
                                    console.log(9869,res.data);
                                }
                                resolve(res)
                            }
                        })
                    }
                }
            })
        })
        // ------------------------------
}
export function saveUser(nickName,avatarUrl,sex){
    // -----------------传头像和名字------------------
    wx.request({
        url: global.ip1+'miniProgram/api/user/basic/add/', //仅为示例，并非真实的接口地址
        data: {
        userName: nickName,
        userImg: avatarUrl,
        sex: sex,
        token:wx.getStorageSync('token')
        },
        header: {
        'content-type': 'application/json' // 默认值
        },
        success (res) {
           
            getApp().globalData.integralNum = res.data.integralNum;
        }
    })
    // ----------------------------------------------
}
// -----------------------封装wx.request请求--------------------
export function wxRequest(url,config){
    return new Promise(function(resolve,reject){
        let { 
            data = {},
            contentType = 'application/json',
            method = 'GET',
            ...other
        } = {...config}   //解构赋值
        
        wx.request({
            url:global.ip1 + url,
            data:{...data},
            method: method,
            header: {
                'content-type': contentType
            },
            success(res){
                // console.log(res)
                resolve(res)
            }
        })
    })
}