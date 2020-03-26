<template>
  <div>
    <div v-show="showModal" class="modal-back" catchtouchmove="ture">
      <div class="modal" >
        <!--  -->
        <img class="model-icon" src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/3843d7db-8dc1-4d23-836e-0b746c5b1860.png"/>
        <!--  -->
        <div class="modal-header">
          <div class="modal-logo">
            <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/d11ace11-815d-465e-ae52-c84bde0147ba.png"/>
          </div>
        </div>
        <!--  -->
        <div class="modal-title">
          登录后即注册完成
        </div>
        <!--  -->
        <div class="modal-text">
          请仔细阅读以下协议<br/>如不同意相关协议内容，您可暂停授权
        </div>

        <!--  -->
        <div class="checks">
          <div class="check" @click="checkYS">
            <icon class="margin-R margin-L" v-if="seliIcon" type='success' size='15' color='#FFD637'/>
            <div v-if="!seliIcon" class="no-sel-icon margin-R"></div>
            <div class="check-text">我已阅读并同意<text class="colorYellow" @click.stop="goConceal">《LEVEL8隐私条款》</text>
            <!-- 和<text class="color000" @click.stop="goVIPRule">《会员规则》</text> -->
            </div>
          </div>
          <!-- <div class="check" @click="checkYS2">
            <icon class="margin-R margin-L" v-if="seliIcon2" type='success' size='14' color='#FFD637'/>
            <div v-if="!seliIcon2" class="no-sel-icon margin-R" ></div>
            <div class="check-text">同意接收LEVEL8品牌的信息推送</div>
          </div> -->
        </div>
        <!--  -->
        <button class="modal-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled='!selAll' >微信手机号快速登录</button>
        <!-- <button class="modal-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">微信手机号快速登录</button> -->
        <button class="modal-btn2" @click="refuseLog">暂不授权>></button>
      </div>

    </div>
  </div>
</template>

<script>
import global from '@/components/global'
import {getToken,saveUser,wxRequest} from '@/components/common'
export default {
  data () {
    return {
      checkedRule:true,
      seliIcon:true,
      seliIcon2:false,
      
    }
  },
  computed: {
    selAll:function(){
      if(this.seliIcon === true){
        return true;
      }else{
        return false;
      }
    }
  },
  props: ['showModal'],
  methods: {
    getPhoneNumber (e) {

      let that = this;
      if(e.mp.detail.errMsg === 'getPhoneNumber:ok'){
        getApp().globalData.phone = 1;

          wx.login({
          success (res) {

            if (res.code) {
              console.log(e.mp.detail.encryptedData)
              console.log(e.mp.detail.iv)
              console.log(res.code)
              wx.request({
                url: global.ip1+'miniProgram/api/shop/user/login', //
                data: {
                  encryptedData: e.mp.detail.encryptedData,
                  iv: e.mp.detail.iv,
                  code:res.code 
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success (res) {

                  console.log('phone',res.data)
                  if(res.data.status == 0){
                    that.showModal = false; 
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })

                    wx.getUserInfo({
                      success: function(e) {//用户已授权
                      console.log(e)
                        getToken(e.encryptedData,e.iv).then(res => {
                          that.$emit('modalShow', {showModal:that.showModal});
                        });
                      }
                    })

                  }else{
                    wx.showToast({
                      title: '授权失败',
                      image: '/static/images/errorToast.png',
                      duration: 1000
                    })
                  }
                }
              })
              }}
            })
          }else{
            getApp().globalData.phone = 0;
          }
    },

    refuseLog(){
      this.showModal = false; 
      this.$emit('refuseModal', this.showModal);
    },
    checkYS(){
      this.seliIcon === false ? this.seliIcon = true : this.seliIcon = false;
      
    },
    checkYS2(){
      this.seliIcon2 === false ? this.seliIcon2 = true : this.seliIcon2 = false;
    },
    goConceal(){
      wx.navigateTo({
        url:'/pages/conceal/main'
      })
    },
    goVIPRule(){
      wx.navigateTo({
        url:'/pages/viprule/main'
      })
    }
  },
}
</script>

<style>
img{
  width: 100%;
  height: 100%;
  display: block;
}
.modal-back{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
  width: 100vw;
  height: 100vh;
  background: rgba(000, 000, 000, 0.5)
}
.modal{
  width: 300px;
  margin: 0 auto;
  margin-top: calc(50vh - 200px);
  height: 400px;
  background: url('https://level8cases.oss-cn-hangzhou.aliyuncs.com/40ec0651-1687-454a-8afb-f7795723792b.png');
  background-size: 100% 100%;
  border-radius: 8px;
  padding-bottom: 20px;
  box-sizing: border-box;
  position: relative;
}
.model-icon{
  position: absolute;
  width: 100px !important;
  height: 100px !important;
  top: -2px; 
  left:-2px;
  z-index: 600;
}
.modal-header{
  padding: 40px 10px 10px;
}
.modal-logo{
  height: 85px;
  width: 85px;
  margin: 0 auto;
}
.modal-title{
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 0 20px;
  letter-spacing: 2px;
}
.modal-text{
  color:#adadad;
  font-size: 12px;
  /* text-align: center; */
  margin-top: 70px;
  padding-left: 20px;
}
.checks{
  margin: 12px 20px 0px 20px;
  overflow: hidden;
}
.check{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.check-text{
  color: #000;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1px;
}
.color000{
  color: #333;
  text-decoration:underline;
}
.colorYellow{
  color: #FFD637;
}
.no-sel-icon{
  border: 1px solid #999;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-left: 1px;
  /* margin:4px 0; */
}
.margin-R{
  margin-right: 6px;
}
.margin-L{
  margin-left: 2px;
}
.modal-btn{
  margin: 0 auto;
  margin-top: 8px;
  padding: 0px 20px;
  width: 220px;
  font-size: 16px;
  border-radius: 20px;
  text-align: center;
  background: #FFD637;
}

.modal-btn2{
  margin-top: 10px;
  padding: 0px 20px;
  font-size: 14px;
  text-align: center;
  color: #999;
  background: #fff;
}
button::after {
  border: none;
}
</style>