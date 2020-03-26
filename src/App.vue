<script>
import global from '@/components/global'
import {getToken,saveUser,wxRequest} from '@/components/common'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
        //----------登录----------------
    
    wx.login({
      success (res) {
        if (res.code) {
          getApp().globalData.code = res.code;
          wx.getUserInfo({
            success: function(e) {//用户已授权
              getApp().globalData.login = 1;
                // 存储头像和姓名
                saveUser(e.userInfo.nickName,e.userInfo.avatarUrl,e.userInfo.gender);
                let data= {
                    encryptedData: e.encryptedData,
                    iv: e.iv,
                    code:getApp().globalData.code
                }
                console.log('data',data)
                  // -----------------判断是否绑定手机号------------------
                  wxRequest('miniProgram/api/get/shop/token',{data}).then(res => {
                      console.log('phone2',res)
                      if(res.data.status === 0){
                        wx.setStorageSync('token', res.data.token);
                        getApp().globalData.phone = 1;
                        console.log('已绑定手机号');
                      }else{
                        getApp().globalData.phone = 0;
                      }
                  })
                  // ------------------------------
            },
            fail(err){ //用户未授权
              getApp().globalData.login = 0;
              getApp().globalData.hasAgree = false;
              console.log(err)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
