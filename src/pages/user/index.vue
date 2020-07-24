<template>
  <div>
    <div class="user-header">
      <div class="user-info">
        <div class="user-avatar">
          <open-data type="userAvatarUrl"></open-data>
        </div>
        <span><open-data type="userNickName"></open-data></span>
      </div>
      <div class="integral" @click="goPage(1)">
        <div class="integral-left">
          <div class="integral-icon">
            <img src="../../../static/images/icon_chufabi.png" mode='widthFix'/>
          </div>
          出发币
        </div>
        <span>{{integralNum}}</span>
      </div>    
    </div>
    
    <!--  -->
    <div class="user-content">
      <div class="orders">
        <div class="orders-header">
          <span class="order-header-title">我的订单</span>
          <span class="order-btn" @click="goOrders(0)">查看全部订单</span>
        </div>
        <div class="order-items">
          <div class="order-item" @click="goOrders(1)">
            <div class="order-icon">
              <img src="../../../static/images/order1.png" mode='widthFix'/>
            </div>
            <span>待付款</span>
            <!--  -->
            <div class="order-num" v-if="!(numbers[0]===0)">
              {{numbers[0]}}
            </div>
          </div>
          <div class="order-item" @click="goOrders(2)">
            <div class="order-icon">
              <img src="../../../static/images/order2.png" mode='widthFix'/>
            </div>
            <span>待发货</span>
            <div class="order-num" v-if="!(numbers[1]===0)">
              {{numbers[1]}}
            </div>
          </div>
          <div class="order-item" @click="goOrders(3)">
            <div class="order-icon">
              <img src="../../../static/images/order3.png" mode='widthFix'/>
            </div>
            <span>待收货</span>
            <div class="order-num" v-if="numbers[2]!==0">
              {{numbers[2]}}
            </div>
          </div>
          <div class="order-item" @click="goOrders(4)">
            <div class="order-icon">
              <img src="../../../static/images/order4.png" mode='widthFix'/>
            </div>
            <span>待评价</span>
            <div class="order-num" v-if="numbers[3]!==0">
              {{numbers[3]}}
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="user-items">
        <div class="user-item"  @click="goPage(2)">
          <div class="item-left">
            <div class="user-item-icon">
              <img src="../../../static/images/user_icon_1.png" mode='widthFix'/>
            </div>
            <span>我的信息</span>
          </div>
          <div class="face-righti-icon">
            <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
        </div>
        <div class="user-item" @click="goPage('/pages/address/main')">
          <div class="item-left">
            <div class="user-item-icon">
              <img src="../../../static/images/user_icon_2.png" mode='widthFix'/>
            </div>
            <span>收货地址</span>
          </div>
          <div class="face-righti-icon">
            <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
        </div>
        <div class="user-item" @click="goPage('/pages/coupon/main')">
          <div class="item-left">
            <div class="user-item-icon">
              <img src="../../../static/images/user_icon_3.png" mode='widthFix'/>
            </div>
            <span>优惠券</span>
          </div>
          <div class="face-righti-icon">
            <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
        </div>
        <div class="user-item"  @click="goPage(1)" style="border:none;">
          <div class="item-left">
            <div class="user-item-icon">
              <img src="../../../static/images/user_icon_4.png" mode='widthFix'/>
            </div>
            <span>终身保修</span>
          </div>
          <div class="face-righti-icon">
            <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
        </div>
        <!-- <button open-type="contact" session-from="weapp" class="user-item"  style="border:none;background:#fff">
          <div class="item-left">
            <div class="user-item-icon">
              <img src="../../../static/images/user_icon_4.png" mode='widthFix'/>
            </div>
            <span>联系我们</span>
          </div>
          <div class="face-righti-icon">
            <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
        </button> -->
      </div>
    </div>
    <!-- 底部热线 -->
    <div class="fix-bottom" @click="linkPhone">客户服务热线：400-0088-309</div>
    <!--  -->
    <modal1 :showModal="showModal" @modalShow='getModal' ></modal1>
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
import {wxRequest} from '@/components/common';
import modal1 from '@/components/modal';

export default {
    data(){
        return{
          showModal2:false,
          showModal:false,
          hasAgree:false,
          status:{0:'待付款',100:'已取消',200:'待发货',300:'已发货',400:'已收货',500:'已完成',600:'已取消',700:'待退款',800:'已退款'},
          numbers:[],
          integralNum:0
        }
    },
    components:{
      modal1
  },
    methods: {
        getUserInfo(e){
          if (e.mp.detail.rawData){
            let rawData =  JSON.parse(e.mp.detail.rawData)
            this.showModal = true; 
            this.hasAgree = true;
            getApp().globalData.login = 1; //保存用户登录状态
          console.log(this.showModal)
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
      goOrders(index){
        if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            wx.navigateTo({
              url:'/pages/orders/main?index='+index
            })
        }else{
            this.showModal = true;
          }
          }else{
          this.showModal2 = true;
        }
      },
      linkPhone(){
          wx.makePhoneCall({
              phoneNumber:'4000088309'
          })
      },
      goPage(url){
        if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
        if(url === 1){
          wx.navigateToMiniProgram({
            appId: 'wxb4aa148ab9b37bc5',
            envVersion: 'release',
            success(res) {
              console.log(res)
            },
            fail(res){
              console.log(res)
            }
          })
        }else if(url === 2){
          wx.navigateToMiniProgram({
            appId: 'wxb4aa148ab9b37bc5',
            path:'/pages/myinfo/main',
            envVersion: 'release',
            success(res) {
              console.log(res)
            },
            fail(res){
              console.log(res)
            }
          })
        }else{
          wx.navigateTo({
            url
          })
        }}else{
            this.showModal = true;
          }
          }else{
          this.showModal2 = true;
        }
 
      }
    },
    onShow(){
      // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
          this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){

          this.showModal = false;   
          
          let data = {
            token:wx.getStorageSync('token')
          }
          this.numbers = [];
          wxRequest('mp/shop/api/user/order/countGroupByStatus',{data}).then(res => {
            this.numbers.push(res.data.data[0])
            this.numbers.push(res.data.data[200])
            this.numbers.push(res.data.data[300])
            this.numbers.push(res.data.data[400])
          })

          let data1 ={
            token:wx.getStorageSync('token'),
            platform:'mini'
          }
          wxRequest('mall/user/info',{data:data1}).then(res => {
              console.log(res)
              this.integralNum = res.data.data.integralNum;
          })     
        }else{
          this.numbers = [0,0,0,0]
        }
      

    },
    onLoad(){

    }
}

</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .user-header{
    background: #FFd637;
    padding: 20px 0 40px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-info{
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .user-info span{
    letter-spacing: 1.8px;
  }
  .user-avatar{
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    margin-right: 10px;
    overflow: hidden;
  }
  .integral{
    height: 56rpx;
    border-top-left-radius: 28rpx;
    border-bottom-left-radius: 28rpx;
    background: rgba(255, 235, 215, 0.6);
    display: flex;
    padding-right: 30rpx;
    padding-left: 22rpx;
    align-items: center;
    color: rgb(235, 105, 18);
    font-size: 24rpx;
  }
  .integral-left{
    display: flex;
    margin-right: 12px
  }
  .integral-icon{
    width: 22px;
    margin-right: 8px
  }
  .user-content{
    padding: 0 12px;
    margin-top: -10px;
  }

  .orders{
    background: #fff;
    border-radius: 12px;
  }
  .orders-header{
    padding: 12px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ededed;
  }
  .order-header-title{
    font-size: 15px;
    color: #333;
  }
  .order-btn{
    color: #999;
    font-size: 12px;
  }
  .order-items{
    padding: 20px 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 14px;
    position: relative;
  }
  .order-item span{
    letter-spacing: 1.5px;
  }
  .order-icon{
    width: 30px;
    margin-bottom: 2px;
    
  }
  .order-num{
    position: absolute;
    top: -2px;
    right: 0px;
    font-size: 12px;
    color: rgb(255, 115, 59);
    border: 1px solid rgb(255, 115, 59);
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    z-index: 10;
  }
  .user-items{
    background: #fff;
    border-radius: 12px;
    margin-top: 12px;
  }
  .user-item{
    display: flex;
    padding: 12px 8px;
    justify-content: space-between;
    font-size: 15px;
    color: #333;
    align-items: center;
    border-bottom: 1px solid #ededed;
  }
  .item-left{
    display: flex;
    align-items: center;
  }
  .user-item-icon{
    width: 26px;
    margin-right: 16px;
  }
  .face-righti-icon{
    width: 20px;
  }
  .fix-bottom{
    position: fixed;
    bottom: 12px;
    text-align: center;
    color: #999;
    font-size: 12px;
    width: 100%;
    letter-spacing: 1px;
  }
</style>