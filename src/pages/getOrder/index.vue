<template>
  <div>
      <div class="choose-address" @click="selAddress" v-if="addressInfo.userName===undefined">
          <div class="add-icon"><img src="../../../static/images/add.png" mode='widthFix'/></div>
          添加收货地址
      </div>
        <div class="user-location" @click="selAddress"  v-if="addressInfo.userName!==undefined">
          <div class="location-icon">
              <img src="../../../static/images/location.png" mode='widthFix'/>
          </div>
          <div class="location">
              <div>
                  <span style="margin-right:20px">{{addressInfo.userName}}</span>
                  <span>{{addressInfo.userPhone}}</span>
              </div>
              <div class="address">{{addressInfo.provinceName}}{{addressInfo.cityName}}{{addressInfo.districtName}}{{addressInfo.address}}</div>
          </div>
      </div>
      <!--  -->
      <div class="order-content">
        <!--  -->
        <div class="product-item border-bottom" v-for="(item,key) in list" :key="key">
            <div class="product-img">
                <img :src="item.img" mode='widthFix'>
            </div>
            <div class="product-detail">
                <div class="name-color"><span style="letter-spacing:1px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{item.name}}</span>
                <span style="margin-top:6px;color:#999;font-size:12px;" v-for="(value,id) in item.param" :key="id">{{value}}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:13px">
                    <div><span style="font-size:10px;">￥</span> {{item.price}}</div>
                    <span style="color:#888">x {{item.number}}</span>
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
              <span style="color:#333">运费</span>
              <div><span style="color:#999;font-size:10px">￥</span> 0</div>
          </div>
            <div class="flex-center order-item border-bottom" @click="selCoupon">
              <span style="color:#333">优惠券</span>
              <div style="display:flex;align-items:center">
                  <span style="color:red;font-size:12px;margin-right:14px" v-if="coupon.couponInfo">-￥{{coupon.couponInfo.discount}}</span> 
                <div style="width:14px"><img src="../../../static/images/face-right.png" mode='widthFix'/></div>
              </div>
          </div>
            <div class="order-item2 border-bottom">
              <span style="color:#333;width:80px;font-size:14px">优惠码</span>
              <input placeholder="不可与优惠券叠加" v-model="couponCode" placeholder-class="phcolor" style="width:calc(100% - 80px)"/>
          </div>
            <div class="order-item2 border-bottom">
              <span style="color:#333;width:80px;font-size:14px">买家留言</span>
              <input placeholder="选填，建议与卖家沟通" v-model="userNote" placeholder-class="phcolor" style="width:calc(100% - 80px)"/>
          </div>
      </div>
      <!--  -->
      <div class="fix-bottom">
          <div class="order-price-num">
              <span>共{{totalNumber}}件商品</span>
              <div>合计:￥<span> {{totalPrice}}</span></div>
          </div>
          <div class="fix-btn" @click="newOrder">提交订单</div>
      </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            addressInfo:{},
            userNote:'',
            sku:[],
            list:[],
            totalNumber:0,
            totalPrice:0,
            coupon:{},
            couponCode:''
        }
    },
    methods: {
        selAddress(){
            console.log(111)
            wx.navigateTo({
                url:'/pages/address/main?type=1'
            })
        },
        selCoupon(){
            wx.navigateTo({
                url:'/pages/selCoupon/main?price='+this.totalPrice
            })
        },
        getAddress(){
            let data = {
                token:wx.getStorageSync('token')
            }

            wxRequest('/mp/shop/api/user/location/query',{data}).then(res => {
                
                if(res.data.data.length !== 0){
                    res.data.data.forEach((item,key) => {
                        if(item.isDefault === 1){
                            this.addressInfo = item;
                            return;
                        }
                    })
                }

            })
        },
        newOrder(){
            let coupon = ''
            if(this.coupon.id === undefined)
              coupon = '';
            else{
                coupon = this.coupon.id
            }
            let data = {
                token:wx.getStorageSync('token'),
                skuJSON:this.sku,
                locationId:this.addressInfo.id,
                userNote:this.userNote,
                check:false,
                couponCode:this.couponCode,
                userCouponId:coupon
            }
            console.log(data)
            wxRequest('mp/shop/api/user/order/add',{data}).then(res => {
                console.log(res)
                if(res.data.code === 0){
                    let data1 = {
                        token:wx.getStorageSync('token'),
                        orderId:res.data.data.id
                    }
                    wxRequest('mp/shop/api/user/order/getPayParam',{data:data1}).then(res1 => {
                        console.log(res1)
                        let payInfo = res1.data.data;
                        console.log(112,payInfo) 
                        if(res.data.code === 0){
                            wx.requestPayment({
                                timeStamp: payInfo.timeStamp,
                                nonceStr: payInfo.nonceStr,
                                package: payInfo.package,
                                signType: 'MD5',
                                paySign: payInfo.paySign,
                                success (res) {
                                    console.log(res)
                                    wx.navigateTo({
                                        url:'/pages/orders/main'
                                    })
                                },
                                fail (err) {
                                    console.log(err)
                                    wx.navigateTo({
                                        url:'/pages/orders/main'
                                    })
                                 }
                            })
                        }
                    })
                }else{
                    wx.showToast({
                        title:res.data.msg,
                        icon:'none'
                    })
                }
            })
        }
    },
    onShow(){
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        console.log(currPage)
        if(currPage.address!==undefined){
            this.addressInfo = currPage.address;
        }else{
            this.getAddress();
        }
        if(currPage.coupon!==undefined){
            this.coupon = currPage.coupon;
        }else{
            this.coupon={};
        }
    },
    onLoad(query){
        this.totalNumber = 0;
        this.totalPrice = 0;
        this.sku = JSON.parse(query.sku);
        this.list = JSON.parse(query.products)
        console.log(this.list)
        this.list.forEach(item => {
            this.totalPrice += item.price * item.number;
            this.totalNumber += item.number;
        })

    }
}
</script>

<style>
    @import url('../../components/common.css');
    page{
        background: rgb(247, 248, 248);
    }
    .user-location{
      display: flex;
      align-items: center;
      padding: 24px 12px;
      color: #333;
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
    .choose-address{
        display: flex;
        padding: 26px 36px;
        background: #fff;
        letter-spacing: 1px;
        align-items: center;
        font-size: 14px;
    }
    .add-icon{
        width: 16px;
        margin-right: 10px;
    }
    .order-content{
        margin-top: 10px;
        background: #fff;
        margin-bottom: 50px;
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
    padding: 8px 16px;
    font-size: 14px;
    color: #666;
}
.order-item2{
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 12px;
}
.order-item2 div{
    font-size: 12px;
    color: #999;
}
.fix-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12px;
}
.order-price-num{
    font-size: 12px;
    color: #333;
    display: flex;
    align-items: center;
}
.order-price-num>span{
    margin-right: 20px;
}
.fix-btn{
    background: #FFD637;
    height: 100%;
    line-height: 50px;
    color: #333;
    padding: 0 30px;
    font-size: 13px;
    letter-spacing: 1px;
}
.phcolor{
    color: #999;
}
</style>