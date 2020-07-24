<template>
  <div>
      <div class="place-order-header flex-center">
          <div class="pay-status">
            <div class="pay-icon">
                <img src="../../../static/images/wait_pay.png" mode='widthFix'> 
            </div>
           {{status[orderDetail.status]}}
          </div>

          <div  v-if="orderDetail.status === 0">距订单自动关闭剩 {{lastTime}}</div>
          <div v-if="orderDetail.status === 300" style="padding:2px 6px;color:#666;font-size:12px;border:1px solid #666" @click="goPage('/pages/logistics/main?id='+orderDetail.id+'&company='+orderDetail.expressName)">查看物流</div>
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
          <div class="product-item border-bottom" v-for="(item,key) in orderDetail.productInfo" :key="key" @click="goPage('/pages/productDetail/main?id='+item.productId+'&sku='+item.id)">
              <div class="product-img">
                  <img :src="item.img" mode='widthFix'>
              </div>
              <div class="product-detail">
                  <div class="name-color"><span style="letter-spacing:1px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{item.productInfo.name}}</span>
                    <span style="margin-top:6px;color:#999;font-size:12px;" v-for="(parma,index) in item.skuName" :key="index">{{parma}}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:13px">
                      <div  v-if="item.price!==0"><span style="font-size:10px;">￥</span> {{item.price}}</div>
                      <div v-else><span style="font-size:10px;">￥</span> {{item.originalPrice}}</div>
                      <span style="color:#888">x {{item.quantity}}</span>
                    </div>
              </div>
          </div>
        <div class="product-item border-bottom" v-for="(item,key) in orderDetail.giveawayProductList" :key="key">
              <div class="product-img">
                  <img :src="item.img" mode='widthFix'>
              </div>
              <div class="product-detail">
                  <div class="name-color"><span style="letter-spacing:1px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;display:flex;align-items:center">{{item.productInfo.name}}<div style="color: #fff;width: 18px; height: 18px;  text-align: center; line-height: 18px;background: red;margin-left: 10px;font-size: 12px;">赠</div></span>
                    <span style="margin-top:6px;color:#999;font-size:12px;" v-for="(parma,index) in item.skuName" :key="index">{{parma}}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:13px">
                      <span></span>
                      <span style="color:#888">x {{item.quantity}}</span>
                    </div>
              </div>
          </div>
          <!--  -->
          <div class="integrall border-bottom">
              <div class="integrall-icon">出发币</div>
              <div class="integrall-text">确认该订单可获得 {{integralNum}} 出发币</div>
          </div>
          <!--  -->
          <div class="flex-center order-item border-bottom" v-if="orderDetail.groupProductInfo!==''&&orderDetail.groupProductInfo!==undefined">
              <span style="color:#333">组合购优惠</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.spreadPrice}}</div>
          </div>
          <div class="flex-center order-item border-bottom">
              <span style="color:#333">商品总价</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.productFee}}</div>
          </div>
          <div class="flex-center order-item border-bottom">
              <span style="color:#333">出发币抵扣</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{orderDetail.offsetIntegralNumFee}}</div>
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
            status:{0:'待付款',100:'已取消',200:'待发货',300:'已发货',400:'已收货',500:'已完成',600:'已取消',700:'待退款',800:'已退款'},
            orderDetail:{},
            lastTime:'',
            integralNum:0
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
                            wx.redirectTo({
                                url:'/pages/orders/main?index=0'
                            })
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
                                wx.redirectTo({
                                    url:'/pages/orders/main?index=0'
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
        goPage(url){
            wx.navigateTo({
                url
            })
        },
        linkPhone(){
            wx.makePhoneCall({
                phoneNumber:'4000088309'
            })
        }
    },
    onLoad(query){
        this.integralNum = 0;
        this.orderDetail = JSON.parse(query.detail);
        console.log(this.orderDetail)
        this.orderDetail.expireTime = new Date(this.orderDetail.expireTime.replace(/-/g, "/"));
        if(this.orderDetail.status === 0){
            let now = null;
            let minite = 0;
            let second = 0;
            let overTime = setInterval(()=>{
                now = new Date();
                minite = Math.floor((this.orderDetail.expireTime.getTime() - now.getTime()) / (1000*60));
                second = Math.floor((this.orderDetail.expireTime.getTime() - now.getTime()) % (1000*60) / 1000);
                if(minite === 0 && second === 0){
                    this.orderDetail.status === 100;
                    clearInterval(overTime);
                }
                if(minite<10)
                    minite = '0'+minite;
                if(second<10)
                    second = '0'+second;
                this.lastTime =  minite+ ':' + second; 
            },1000)
           
        }
        // let p = JSON.parse(JSON.stringify(item))
        // 没有单个商品时需要定义个productInfo
        if(this.orderDetail.productInfo===undefined||this.orderDetail.productInfo===""){
            this.orderDetail.productInfo = [];
        }
        if(this.orderDetail.groupProductInfo!==undefined&&this.orderDetail.groupProductInfo!==""){ // 包含组合购时需要把组合购里的商品加在productInfo中
            this.orderDetail.spreadPrice = 0;
            this.orderDetail.groupProductInfo.forEach(group => {
                this.orderDetail.spreadPrice += group.spreadPrice;// 计算组合购优惠
                group.skus.forEach(val => {
                    val.skuName = val.skuName.split(',');
                    val.quantity = 1;
                }) 
                this.orderDetail.productInfo = this.orderDetail.productInfo.concat(group.skus)
            })
            this.orderDetail.spreadPrice = this.orderDetail.spreadPrice.toFixed(2);
        }
        
        this.orderDetail.locationInfo = JSON.parse(this.orderDetail.locationInfo);
        this.orderDetail.productInfo.forEach(item => {
            this.integralNum += item.integralNum * item.quantity;
        })
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