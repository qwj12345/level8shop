<template>
  <div>
      <div class="place-order-header flex-center">
          <div class="pay-status">
            <div class="pay-icon">
                <img src="../../../static/images/wait_pay.png" mode='widthFix'> 
            </div>
           {{status[orderDetail.status]}}
          </div>

          <div  v-if="orderDetail.status === 0">距订单自动关闭剩 12:34</div>
      </div>
      <!--  -->
      <div class="user-location">
          <div class="location-icon">
              <img src="../../../static/images/location.png" mode='widthFix'/>
          </div>
          <div class="location">
              <div>
                  <span style="margin-right:20px">{{orderDetail.locationInfo.userName}}</span>
                  <span>{{orderDetail.locationInfo.userPhone}}</span>
              </div>
              <div class="address">{{orderDetail.locationInfo.provinceName}}{{orderDetail.locationInfo.cityName}}{{orderDetail.locationInfo.districtName}}{{orderDetail.locationInfo.address}}</div>
          </div>
      </div>
      <!--  -->
      <div class="order-detail">
          <div class="order-detail-header flex-center border-bottom" @click="goHome">
              <div class="order-header-left">
                <div class="shop-icon">
                    <img src="../../../static/images/shop_icon.png" mode='widthFix'/>
                </div>
                LEVEL8 官方商城
              </div>
              <div class="order-header-right">
                  <img src="../../../static/images/face-right.png" mode='widthFix'/>
              </div>
          </div>
          <!--  -->
          <div class="product-item border-bottom" v-for="(item,key) in orderDetail.productInfo" :key="key">
              <div class="product-img">
                  <img :src="item.img" mode='widthFix'>
              </div>
              <div class="product-detail">
                  <div class="name-color"><span style="letter-spacing:1px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{item.productInfo.name}}</span>
                  <span style="margin-top:6px;color:#999;font-size:12px;" v-for="(parma,index) in item.skuName" :key="index">{{parma}}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:13px">
                      <div><span style="font-size:10px;">￥</span> {{item.price}}</div>
                      <span style="color:#888">x {{item.quantity}}</span>
                    </div>
              </div>
          </div>

          <!--  -->
          <div class="integrall border-bottom">
              <div class="integrall-icon">出发币</div>
              <div class="integrall-text">确认该订单可获得 1890 出发币</div>
          </div>
          <!--  -->
          <div class="flex-center order-item border-bottom">
              <span style="color:#333">商品总价</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.productFee}}</div>
          </div>
            <div class="flex-center order-item border-bottom">
              <span style="color:#333">运费</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.freightFee}}</div>
          </div>
        <div class="flex-center order-item">
              <span style="color:#333">付款</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.totolFee}}</div>
          </div>

      </div>
        <div class="remark">
            <span>买家留言</span>
            <div></div>
        </div>
        <div class="order-number flex-center">
            <div>
                <span>订单编号:</span>
                <span style="color:#666"> {{orderDetail.id}}</span>
            </div>
            <div class="copy-btn" @click="copyNumber">复制</div>
        </div>
        <!--  -->
        <div class="fix-bottom">
            <div class="fix-bottom-btn1" @click="linkPhone">联系客服</div>
            <div v-if="orderDetail.status === 0" class="fix-bottom-btn1" @click="cancelOrder">取消订单</div>
            <div v-if="orderDetail.status === 0" class="fix-bottom-btn2" @click="payNow">立即付款</div>
        </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            status:{0:'待付款',100:'已取消',200:'待发货',},
            orderDetail:{}
        }
    },
    methods: {
        payNow(){
            wx.showLoading({
                title:'加载中'
            })
            let data = {
                token:wx.getStorageSync('token'),
                orderId:this.orderDetail.id
            }
    
            wxRequest('mp/shop/api/user/order/getPayParam',{data}).then(res => {
                wx.hideLoading();
    
                let payInfo = res.data.data;
                if(res.data.code === 0){
                    wx.requestPayment({
                        timeStamp: payInfo.timeStamp,
                        nonceStr: payInfo.nonceStr,
                        package: payInfo.package,
                        signType: 'MD5',
                        paySign: payInfo.paySign,
                        success (res) {
                            console.log(res)
                        },
                        fail (err) {
                            console.log(err)
                        }
                    })
                }else{
                    wx.showToast({
                        title:'支付失败',
                        icon:'none',
                        duration:2000
                    })
                }
            })   
           
        },
        cancelOrder(){
            let that = this;
            wx.showModal({
                title: '提示',
                content: '是否取消订单',
                success (res) {
                    if (res.confirm) {
                        let data = {
                            token:wx.getStorageSync('token'),
                            orderId:that.orderDetail.id
                        }
                        wxRequest('mp/shop/api/user/order/cancel',{data}).then(res => {
                            console.log(res)
                            if(res.data.code === 0){
                                wx.showToast({
                                    title:'取消成功',
                                    duration:2000
                                })
                            }else{
                                wx.showToast({
                                    title:'取消失败',
                                    icon:'none',
                                    duration:2000
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
                })
        },
        copyNumber(){
            wx.setClipboardData({
                data: this.orderDetail.id.toString(),
                success: function () {
                    // 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
                    wx.showToast({
                        title: '复制成功',
                        duration: 3000
                    })
                },
                fail(err){
                    console.log(err)
                }
            })
        },
        goHome(){
            wx.switchTab({
                url:'/pages/index/main'
            })
        },
        linkPhone(){
            wx.makePhoneCall({
                phoneNumber:'4000088309'
            })
        }
    },
    onLoad(query){
        console.log(JSON.parse(query.detail))
        this.orderDetail = JSON.parse(query.detail);
        this.orderDetail.locationInfo = JSON.parse(this.orderDetail.locationInfo);
    }
}
</script>

<style>
  @import url('../../components/common.css');   
  page{
    background: rgb(247, 248, 248);
  }
  .place-order-header{
      background: #FFD637;
      padding: 30px 12px;
      color: #666;
      font-size: 12px;
  }
  .pay-status{
      display: flex;
      font-size: 14px;
      color: #333;
      align-items: center;
  }
  .pay-icon{
      width: 24px;
      margin-right: 10px;
  }
  .user-location{
      display: flex;
      align-items: center;
      padding: 24px 12px;
      color: #666;
      font-size: 14px;
      letter-spacing: 1.5px;
      background: #fff;
  }
  .location-icon{
      width: 14px;
      margin-right: 24px;
  }
  .location .address{
      font-size: 13px;
      margin-top: 4px;
      letter-spacing: normal;
      color: #777;

  }
  .order-detail{
      margin-top: 10px;
      background: #fff;
  }
  .order-detail-header{
      color: #666;
      font-size: 16px;
      padding: 10px 12px;
  }
  .order-header-left{
      display: flex;
      align-items: center;
  }
  .order-header-right{
      width: 20px;
  }
  .shop-icon{
      width: 19px;
      margin-right: 10px;
  }
  .border-bottom{
      border-bottom: 1px solid #ededed;
  }
  .product-item{
      display: flex;
      align-items: center;
      padding: 6px 12px;
  }
  .product-img{
      width: 110px;
  }
  .product-detail{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 120px;
      padding: 10px;
      font-size: 14px;
      box-sizing: border-box;
      color: #333;
      width: calc(100% - 110px)
  }
  .name-color{
      display: flex;
      flex-direction: column;
      letter-spacing: 1px;
  }
  .integrall{
      display: flex;
      padding: 8px 12px;
      color: #666;
      align-items: center;
  }
.integrall-icon{
    background: #FFD637;
    padding: 2px 4px;
    color: #fff;
    font-size: 13px;
    border-radius: 6px;
}
.integrall-text{
    margin-left: 10px;
    font-size: 12px;
    color: #666;

}
.order-item{
    padding: 8px 12px;
    font-size: 14px;
    color: #666;
}
.remark{
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 8px 12px;
    font-size: 14px;
    color: #444;
    background: #fff;
}
.remark input{
    margin-left: 10px;
    color: #777;
}
.order-number{
    padding: 8px 12px;
    margin-top: 10px;
    background: #fff;
    color: #333;
    font-size: 14px;
    margin-bottom: 100px;
}
.copy-btn{
    border: 1px solid #999;
    font-size: 10px;
    padding: 2px 10px;
}
.fix-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    color: #333;
}
.fix-bottom-btn1{
    border: 1px solid #666;
    padding: 0px 10px;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
    border-radius: 4px;
    box-sizing: border-box;
}
.fix-bottom-btn2{
    padding: 0px 8px;
    height: 28px;
    line-height: 28px;
    background: #FFD637;
    border-radius: 4px;
}

</style>