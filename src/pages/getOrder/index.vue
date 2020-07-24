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
          <!-- 组合购 -->
        <div class="group-item" v-for="(group,key) in groupList" :key="key">
            <div class="group-item-header">
                <div style="display:flex;align-items:center">
                    <div class="group-name">{{group.ruleNote}}</div>
                    <div><span style="font-size:12px;">￥</span>{{group.price}}</div>
                    <div style="background:rgba(255,214,54,0.2);font-size:10px;align-self: baseline;color:#f77c2a;padding:2px 4px;margin-left:4px">组合购</div>
                </div>
                <div style="color:#888;font-size:13px">x {{group.quantity}}</div>
            </div>
            <div class="product-item" v-for="(item,index) in group.skus" :key="index">
                <div class="product-img">
                    <img :src="item.img" mode='widthFix'>
                </div>
                <div class="product-detail">  
                    <div class="name-color">
                        <div style="letter-spacing:1px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="item.productInfo">{{item.productInfo.name}}</div>
                        <span style="margin-top:1px;color:#999;font-size:12px;" v-for="(value,id) in item.param" :key="id">{{value}}</span>
                    </div>
                    <div v-if="item.discountInfo!==''&&item.discountInfo!==undefined" style="background:rgba(255,214,54,0.2);font-size:10px;align-self: baseline;color:#f77c2a;padding:2px 4px">优惠：{{item.discountInfo}}</div>
                    <div style="display:flex;justify-content:space-between;font-size:13px">
                        <div style="display:flex;align-items:center"><span style="font-size:10px;">￥</span> {{item.price}}<div v-if="item.originalPrice!==0&&item.originalPrice!==item.price" style="margin-left:4px;font-size:12px;color:#bbb;text-decoration:line-through">￥{{item.originalPrice}}</div></div>
                        <span style="color:#888">x {{item.quantity}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 单品  -->
        <div class="product-item border-bottom" v-for="(item,key) in list" :key="key">
            <div class="product-img">
                <img :src="item.img" mode='widthFix'>
            </div>
            <div class="product-detail">  
                <div class="name-color">
                    <div style="letter-spacing:1px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="item.productInfo">{{item.productInfo.name}}</div>
                    <span style="margin-top:1px;color:#999;font-size:12px;" v-for="(value,id) in item.param" :key="id">{{value}}</span>
                </div>
                <div v-if="item.discountInfo!==''&&item.discountInfo!==undefined" style="background:rgba(255,214,54,0.2);font-size:10px;align-self: baseline;color:#f77c2a;padding:2px 4px">优惠：{{item.discountInfo}}</div>
                <div style="display:flex;justify-content:space-between;font-size:13px">
                    <div style="display:flex;align-items:center"><span style="font-size:10px;">￥</span> {{item.price}}<div v-if="item.originalPrice!==0&&item.originalPrice!==item.price" style="margin-left:4px;font-size:12px;color:#bbb;text-decoration:line-through">￥{{item.originalPrice}}</div></div>
                    <span style="color:#888">x {{item.quantity}}</span>
                </div>
            </div>
        </div>
        
        <!-- 赠品 -->
        <div class="product-item border-bottom" v-for="(item,key) in zpList" :key="key">
            <div class="product-img">
                <img :src="item.img" mode='widthFix'>
            </div>
            <div class="product-detail">
                <div class="name-color">
                    <div style="letter-spacing:1px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;display:flex;align-items:center">{{item.name}}<div style="color: #fff;width: 18px; height: 18px;  text-align: center; line-height: 18px;background: red;margin-left: 10px;font-size: 12px;">赠</div></div>
                    <span style="margin-top:6px;color:#999;font-size:12px;" v-for="(value,id) in item.param" :key="id">{{value}}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:13px">
                    <div></div>
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
          <div class="flex-center order-item border-bottom">
              <span style="color:#333">运费</span>
              <div><span style="color:#999;font-size:10px">￥</span> {{freightFee}}</div>
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
              <div style="width:calc(100% - 80px);display:flex;align-items:center">
                <input style="width:calc(100% - 60px);font-size:12px" placeholder="不可与优惠券叠加" v-model="couponCode"  placeholder-class="phcolor" />
                <div class="code-btn" @click="getCouponCode">兑换</div>
              </div>
          </div>
          <div class="order-item2 border-bottom" v-if="offsetIntegralNum!==0">
              <span style="color:#333;width:80px;font-size:14px">出发币</span>
              <div style="width:calc(100% - 80px);display:flex;align-items:center;justify-content: space-between;">
                <div style="width:calc(100% - 60px);font-size:12px;color:#333">可用{{offsetIntegralNum}}出发币抵扣{{offsetIntegralNumFee}}元</div>
                <van-radio-group  :value='checkUser' @change="changeRadio"><van-radio icon-class='icon' checked-color='#FFd637' name="1" icon-size="14px" ></van-radio></van-radio-group>
              </div>
          </div>
          <div class="order-item2 border-bottom">
              <span style="color:#333;width:80px;font-size:14px">买家留言</span>
              <input placeholder="选填，建议与卖家沟通" v-model="userNote" placeholder-class="phcolor" style="width:calc(100% - 80px);font-size:12px"/>
          </div>
      </div>
      <!-- -->
      <div class="fix-bottom">
          <div class="order-price-num">
              <span>共{{totalNumber}}件商品</span>
              <div style="position:relative">合计:￥<span> {{totalPrice}}</span><div class="discount-tag" v-if="couponNote !== ''">{{couponNote}}</div></div>
          </div>
          <div class="fix-btn" @click="newOrder">提交订单</div>
      </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common';
var mta= require('@/utils/mta_analysis.js')
export default {
    data() {
        return {
            checkUser:'1',
            addressInfo:{},
            userNote:'',
            sku:[],
            list:[],
            groupList:[],
            zpList:[],
            totalNumber:0,
            totalPrice:0,
            coupon:{},
            couponCode:'',
            integralNum:0,
            freightFee:0,
            productPrice:0,
            isSelCoupon:false,
            ruleNote:'',
            couponNote:'',
            paying:false,
            groupJSON:[],
            offsetIntegralNum:0,
            offsetIntegralNumFee:0
        }
    },
    watch:{
        coupon:{
            deep: true,
            handler:function (newVal,oldVal){
                
                if(newVal.id===undefined)
                    this.isSelCoupon = false;
                else
                    this.isSelCoupon = true;
            }
        }
    },
    methods: {
        changeRadio(e){
            console.log(e.mp.detail)
            this.checkUser===""?this.checkUser="1":this.checkUser="";
            this.getCheckOrder()
            
        },
        selAddress(){ 
            wx.navigateTo({
                url:'/pages/address/main?type=1'
            })
        },
        selCoupon(){
            console.log(this.sku)

            let skuIds = [];
            this.sku.forEach(item => {
                skuIds.push(item.skuId)
            })
            if(this.couponCode !== ''){
                wx.showToast({
                    title:'优惠券和优惠码不能同时使用',
                    icon:'none'
                })
            }else{
                wx.navigateTo({
                    url:'/pages/selCoupon/main?price='+this.totalPrice+'&skuIds='+skuIds
                })
            }
            
        },
        getCouponCode(){
            console.log(this.isSelCoupon)
            if(this.isSelCoupon){
                wx.showToast({
                    title:'优惠券和优惠码不能同时使用',
                    icon:'none'
                })
                this.couponCode = '';
            }else{
                let coupon = ''
                if(this.coupon.id === undefined)
                    coupon = '';
                else{
                    coupon = this.coupon.id
                }
                if(this.addressInfo.id ===undefined){
                    wx.showToast({
                        title:'请选择地址',
                        icon:'none'
                    })
                }else{

                    this.getCheckOrder(1);  
                }
            }

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
                        }
                    })
                    this.getCheckOrder();
                }

            })
        },
        newOrder(){
            let coupon = '';
            
            if(!this.paying){
                this.paying = true;
            if(this.coupon.id === undefined)
              coupon = '';
            else{
                coupon = this.coupon.id
            }
            if(this.addressInfo.id ===undefined){
                wx.showToast({
                    title:'请选择地址',
                    icon:'none'
                })
                this.paying = false;
            }else{
                wx.showLoading({
                    title:'加载中'
                })
                this.sku.length===0 ? this.sku='':this.sku=this.sku;
                this.groupJSON.length===0 ? this.groupJSON='':this.groupJSON=this.groupJSON;

                    let data = {
                        token:wx.getStorageSync('token'),
                        skuJSON:this.sku,
                        groupJSON:this.groupJSON,
                        locationId:this.addressInfo.id,
                        userNote:this.userNote,
                        // check:false,
                        couponCode:this.couponCode,
                        userCouponId:coupon,
                        useIntegral:this.checkUser==="1"?true:false
                    }
                    
                    wxRequest('mp/shop/api/user/order/add',{data}).then(res => {
                        if(res.data.code === 0){
                            let data1 = {
                                token:wx.getStorageSync('token'),
                                orderId:res.data.data.id
                            }
                            wxRequest('mp/shop/api/user/order/getPayParam',{data:data1}).then(res1 => {
                                let payInfo = res1.data.data;
                                if(res.data.code === 0){
                                    wx.requestPayment({
                                        timeStamp: payInfo.timeStamp,
                                        nonceStr: payInfo.nonceStr,
                                        package: payInfo.package,
                                        signType: 'MD5',
                                        paySign: payInfo.paySign,
                                        success (res) {
                                            console.log(res)
                                            wx.reLaunch({
                                                url:'/pages/orders/main?index=0'
                                            })
                                        },
                                        fail (err) {
                                            console.log(err)
                                            wx.reLaunch({
                                                url:'/pages/orders/main?index=1'
                                            })
                                        }
                                    })
                                } 
                                wx.hideLoading();
                                this.paying = false;
  
                            })

                        }else{
                            this.paying = false;
                            wx.hideLoading();
                            wx.showToast({
                                title:res.data.msg,
                                icon:'none'
                            })
                        }
                    })
                }
            }

        },
        getCheckOrder(type){
            wx.showLoading();
            let coupon = ''
            if(this.coupon.id === undefined)
              coupon = '';
            else{
                coupon = this.coupon.id
            }
            let sku = JSON.parse(JSON.stringify(this.sku));
            let groupJSON = JSON.parse(JSON.stringify(this.groupJSON));
            // 防止测试订单时删除购物车
            sku.forEach(item => {
                item.isCart = false;
            })
            groupJSON.forEach(item => {
                item.isCart = false;
            })
            
            sku.length===0 ? sku='':sku=sku;
            groupJSON.length===0 ? groupJSON='':groupJSON=groupJSON;
            let id = '';
            JSON.stringify(this.addressInfo) == "{}"? id='':id=this.addressInfo.id;
            let data = {
                token:wx.getStorageSync('token'),
                skuJSON:sku,
                groupJSON:groupJSON,
                locationId:id,
                userNote:this.userNote,
                check:true,
                couponCode:this.couponCode,
                userCouponId:coupon,
                useIntegral:this.checkUser==="1"?true:false
            }
             
            wxRequest('mp/shop/api/user/order/add',{data}).then(res => {
                console.log(res)
                if(res.data.code===0){
                    // console.log('check',res.data.data[cou])
                    if(type === 1){
                        wx.showToast({
                            title:'兑换成功'
                        })
                    }else if(type !== 1){
                         // 是否有赠品  
                        if(res.data.data.giveawayProductInfo!=="" && res.data.data.giveawayProductInfo!==undefined){
                            this.zpList = JSON.parse(res.data.data.giveawayProductList).map(zp => {
                                zp.img = zp.skuPicUrls.split(',')[0];
                                zp.param = zp.skuName.split(',');
                                zp.name = zp.productInfo.name;
                                return zp;
                            })
                            
                        //     res.data.data.giveawayProductInfo = JSON.parse(res.data.data.giveawayProductInfo);
                        //     res.data.data.giveawayProductInfo.forEach(val => {
                        //         // this.zpLiskSku.push(sku.productSkuId);
                        //         //用逆向循环完成元素的删除，并且不会影响元素所在原有的位置  
                        //         for(let key = this.list.length-1;key>=0;key--){  
                        //             this.list[key].isZp = false;
                        //             val.tjList.forEach(sku => {
                        //                 if(this.list[key].skuId === sku.productSkuId) {
                        //                     this.list[key].isZp = true;
                        //                     this.list.push(this.list[key]);//为了将元素移到最后面，所以先添加再删除  
                        //                     this.list.splice(key,1);
                        //                 }
                        //             })
                        //         }
                        //         this.list = [...this.list];
                        //     })
                        }
                        // 获取商品 
                            let products = [];
                            let groupProducts = [];
                            this.totalNumber = 0; 
                            this.integralNum = res.data.data.getIntegralNum;
                            this.offsetIntegralNum = res.data.data.offsetIntegralNum;
                            this.offsetIntegralNumFee = res.data.data.offsetIntegralNumFee;
                            this.productPrice = 0;
                            if(res.data.data.productInfo!==undefined&&res.data.data.productInfo!==""){
                                products = JSON.parse(res.data.data.productInfo)
                            } 
                            if(res.data.data.groupProductInfo!==undefined&&res.data.data.groupProductInfo!==""){
                                   groupProducts = JSON.parse(res.data.data.groupProductInfo);
                                   groupProducts.forEach(product => {
                                       product.skus.forEach(sku => {
                                            sku.param = sku.skuName.split(',');
                                            sku.img = sku.skuPicUrls.split(',')[0];
                                            // 
                                            if(sku.price===0){
                                                sku.price = sku.originalPrice;
                                            }
                                            this.productPrice += sku.price * sku.quantity;
                                            this.totalNumber += sku.quantity;
                                            // this.integralNum += sku.integralNum * sku.quantity;
                                       })
                                   })
                            }
               
                            // let products = JSON.parse(res.data.data.productInfo).concat(JSON.parse(res.data.data.groupProductInfo).skus);
                            products.forEach(product => {
                                console.log(product)
                                product.param = product.skuName.split(',');
                                product.img = product.skuPicUrls.split(',')[0];
                                // 
                                if(product.price===0){
                                    product.price = product.originalPrice;
                                }
                                this.productPrice += product.price * product.quantity;
                                this.totalNumber += product.quantity;
                                // this.integralNum += product.integralNum * product.quantity;
                            })
                            this.list = [...products];
                            this.groupList = [...groupProducts];
                    }

                    if(res.data.data.couponJson!==undefined)
                        this.couponNote = '优惠券码折扣'+JSON.parse(res.data.data.couponJson).discount;
                    else{
                        this.couponNote = '';
                    }
                    this.totalPrice = res.data.data.totolFee.toFixed(2);
                    this.freightFee = 0;
                    this.freightFee = res.data.data.freightFee;
                }else{
                    if(type === 1){
                        wx.showToast({
                            title:'兑换失败',
                            icon:'none'
                        })
                        this.couponCode = '';
                    }else{
                        wx.showToast({
                            title:res.data.msg,
                            icon:'none'
                        })
                    }
                    this.coupon = {};
                }
                wx.hideLoading();
            })
        }

    },
    onShow(){
        this.addressInfo = {};
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        this.coupon = {};
        if(currPage.address!==undefined){
            this.addressInfo = currPage.address;
            if(currPage.coupon!==undefined){
                this.coupon = currPage.coupon;
            }else{
                this.coupon={};
            }
            this.getCheckOrder();

        }else{
            if(currPage.coupon!==undefined){
                this.coupon = currPage.coupon;
            }else{
                this.coupon={};
            }
            this.getAddress();
        }

    },
    onLoad(query){
        mta.Page.init({
          "appID":"500717591",
          "autoReport": true,
          "statParam": true,
          "ignoreParams": [],
          "autoReport": true, //开启自动上报
          "statParam": true, //每个页面均加入参数上报
        });
        this.paying = false;
        this.totalNumber = 0;
        this.totalPrice = 0;
        this.integralNum = 0;
        this.productPrice = 0;
        this.couponCode = '';
        this.coupon = {};
        this.groupJSON = [];
        this.checkUser = "1";
        this.sku = JSON.parse(query.sku);
         
        if(query.groupJSON!==undefined)
            this.groupJSON = JSON.parse(query.groupJSON); 
    }
}
</script>

<style>
    @import url('../../components/common.css');
    page{
        background: rgb(247, 248, 248);
    }
    .group-item{
        margin-bottom: 10px;
    }
    .group-item-header{
        display: flex;
        justify-content: space-between;
        padding: 10px 22px 10px 18px;
        font-size: 14px;
        border-bottom: 1px solid #ededed;
        background: #fff;
    }
    .group-name{
        font-weight: bold;
        width: 110px;
    }
    .code-btn{
        background: #FFD637;
        letter-spacing: 1px;
        font-size: 12px;
        width: 60px;
        padding: 4px 0;
        border-radius: 2px;
        color: #000 !important;
        text-align: center;
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
        background: rgb(247, 248, 248);
        margin-bottom: 50px;
    }
    .border-bottom{
      border-bottom: 1px solid #ededed;
  }
  .product-item{
      display: flex;
      align-items: center;
      padding: 6px 12px;
      background: #fff;
  }
  .product-img{
      width: 110px;
  }
  .product-detail{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 120px;
      padding: 6px 10px;
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
      background: #fff;
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
    background: #fff;
}
.order-item2{
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 12px;
    background: #fff;
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
    z-index: 2; 
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
.discount-tag{
    position: absolute;
    top: 0px;
    right: 0;
    transform: translate(0,-100%);
    color: #fff;
    background: red;
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 2px;
    
}
</style>