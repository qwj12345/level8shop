<template>
  <div>
      <div style="font-weight:bold;font-size:22px;padding:50px 0 30px;text-align:center;letter-spacing:2px">优惠券详情</div>
      <div class="coupon">
            <div class="coupon-left"><span style="font-size:12px;margin-top:-12px">￥</span><span style="font-size:32px;font-weight:bold">{{coupon.discount}}</span></div>
            <div class="coupon-right">
                <div class="coupon-right-left">
                    <div style="font-size:14px;margin-bottom:4px;font-weight:bold" >{{coupon.title}}</div>
                    <div class="coupon-rule-item" v-for="(rule,index) in coupon.ruleNote" :key="index">
                        <div class="coupon-cricle"></div>
                        <div>{{rule}}</div>
                    </div>

                    <div style="color:#bbb;font-size:10px;margin-top:10px;letter-spacing:0.5px;white-space: nowrap; overflow: hidden;text-overflow:ellipsis;">有效期{{coupon.startTime}}-{{coupon.endTime}}</div>
                </div>
            </div>
            <div class="cricle">
            </div>
            <div class="cricle2">
            </div>
        </div>
      <div class="fixed-bottom" @click="getCoupon">领取</div>
      <div class="rule" v-for="(rule,index) in coupon.ruleNote" :key="index">
          <div>{{index+1}}、{{rule}}</div>
      </div>
    <!--  -->
    <modal1 :showModal="showModal" @modalShow='getModal' @refuseModal='refuseAgree'></modal1>
    <!-- 授权弹出框 -->
    <van-popup :show="showModal2" custom-class="popup-class" >
        <div class="modal2">
          <div class="reg-title">
            获取微信授权信息
          </div>
          <div class="reg-text">
              微信登录需要获取您的用户信息，请前往授权
          </div>
          <div class="modal-btns">
            <div class="modal-cancel-btn" @click="hideModal">
              取消
            </div>
            <button class="reg-btn" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="hideModal">授权登录</button>
          </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import modal1 from '@/components/modal';
import {wxRequest} from '@/components/common';
export default {
    data() {
        return {
            hasAgree:false,
            showModal2:false,
            showModal:false,
            coupon:{}
        }
    },
      components:{
        modal1
    },
    methods: {
        getCoupon(){
            console.log(wx.getStorageSync('token'))
            if(this.hasAgree === true){   //先判断有没有授权
            if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                let data = {
                    token:wx.getStorageSync('token'),
                    couponId:this.coupon.id
                }
                wxRequest('/mp/shop/api/couponUser/query',{data}).then(res => {
                    console.log(res)
                    if(res.data.code===-1){
                        wx.showToast({
                            title:res.data.msg,
                            icon:'none'
                        })
                    }else if(res.data.code===0){
                        wx.showToast({
                            title:'领取成功',
                        })
                    }else{
                        wx.showToast({
                            title:'领取失败',
                            icon:'none'
                        })
                    }
                })
                }else{
                    this.showModal = true;
                }
            }else{
                this.showModal2 = true;
            }
        },
        getUserInfo(e){
            if (e.mp.detail.rawData){
                let rawData =  JSON.parse(e.mp.detail.rawData)

                this.showModal = true; 
                this.hasAgree = true;
                getApp().globalData.login = 1; //保存用户登录状态

            } else {  
                this.showModal2 = true;
                console.log('用户按了拒绝按钮')
            }
        },
        // modal组件中的值传过来
        getModal(e){
            this.showModal = e.showModal;
        },
        hideModal(){
            this.showModal2 = false;
        },
    },
    onShow(){
        // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
            this.hasAgree = true;
            this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
            this.showModal = false;        
        }
    },
    onShareAppMessage(){
        wx.showShareMenu({
            withShareTicket: true
        }) 
        let path = '/pages/getCoupon/main?item='+JSON.stringify(this.coupon);

        return {
            path: path // 路径，传递参数到指定页面。
        }
    },
    onLoad(query){
        this.coupon = JSON.parse(query.item);
        console.log(this.coupon)
        let that =this;
        // 因为如果只在APP.vue中请求一次的话会出现异步的问题，就是这个onLoad比APP.vue中的onLoad先执行完
        wx.getUserInfo({
            success: function(res) {
                getApp().globalData.login = 1
                that.hasAgree = true;
            },
            fail(err){
                that.hasAgree = false;
            }
        })
    }
}
</script>

<style>
@import url('../../components/common.css');
page{
    background: #ffd636;
  }
    .coupon{
        width: 90%;
        margin: 50px auto;

      display: flex;
      position: relative;
      border-radius: 8px;
      overflow: hidden;

  }
  .coupon-left{
      height: 110px;
      width: 32%;
      border-top-right-radius: -20px;
      background: #fff;
      color: #ffd636;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px dashed #ededed;
      box-sizing: border-box;
  }
  .cricle{
      position: absolute;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      left: calc(32% - 9px);
      top: -9px;
      z-index: 10;
      background: #ffd636;
  }
    .cricle2{
      position: absolute;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      left: calc(32% - 9px);
      bottom: -9px;
      z-index: 10;
      background: #ffd636;
  }
  .coupon-right{
      background: #fff;
      height: 110px;
      display: flex;
      align-items: center;
      width: 68%;
      padding: 0 10px 0 16px;
      box-sizing: border-box;

  }
  .coupon-rule-item{
      color: #999;
      font-size: 12px;
      display: flex;
      align-items: center;
      white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
  }
  .coupon-cricle{
      width: 4px;
      height: 4px;
      background: #999;
      border-radius: 50%;
      margin-right: 2px;
  }
  
  .coupon-right-left{
      width: calc(100%);
      overflow: hidden;
  }
    .fixed-bottom{
      width: 80%;
      margin: 10px auto;
      margin-top: 80px;
      border-radius: 26px;
      font-size: 18px;
      height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: #ffd636;
        border: 1px solid #fff;

      
  }
  .rule{
      width: 80%;
      margin: 50px auto;
      color: #333;
      font-size: 12px;
      line-height: 26px;
  }
</style>