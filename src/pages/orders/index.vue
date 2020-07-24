<template>
  <div>
    <van-tabs swipeable color='#FFD636' nav-class='my-tab' @change="changeTab" :active='active'>
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="待发货"></van-tab>
        <van-tab title="待收货"></van-tab>
        <van-tab title="待评价"></van-tab>
        <van-tab title="已完成"></van-tab>
        <van-tab title="已取消"></van-tab>

    </van-tabs>
    <!-- 订单列表 -->
    <div class="order-list">
        <div class="order-item" v-for="(item,key) in list" :key="key">
            <div class="order-header">
                <div style="display:flex;">
                    <div  v-if="item.groupProductInfo!==''&&item.groupProductInfo!==undefined" style="border:1px solid #FFD636;border-radius:4px;padding:1px 2px;color:#FFD636;font-size:12px;margin-right:8px">组合购</div>
                    <div class="order-num">
                        订单编号：{{item.id}}
                    </div>
                </div>
                
                <div style="font-size:12px;color:#999">{{item.createTime}}</div>
                <div class="order-icon" v-if="false">
                    <img src="../../../static/images/rubbish.png" mode='widthFix'/>
                </div>
            </div>
            <!-- 没有组合购 -->
            <div v-if="item.groupProductInfo===''||item.groupProductInfo===undefined">
                <div class="order-content" v-for="(value,id) in item.productInfo" :key="id" @click="goDetail(item)">
                    <div class="order-content-left" >
                        <div class="product-img">
                            <img :src="value.img" mode='widthFix'/>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{value.productInfo.name}}</div>
                            <div class="product-color" v-for="(sku,skuid) in value.skuName" :key="skuid">{{sku}}</div>
                        </div>
                    </div>
                
                    <div class="order-content-right">
                        <div v-if="value.price===0" class="product-price">￥ {{value.originalPrice}}</div>
                        <div v-else class="product-price">￥ {{value.price}}</div>
                        <div class="product-number">共{{value.quantity}}件</div>
                        <div class="order-type">{{status[item.status]}}</div>
                    </div>
                </div>
                <!-- 赠品 -->
                <div class="order-content" v-for="(value,id) in item.giveawayProductList" :key="id" @click="goDetail(item)">
                    <div class="order-content-left" >
                        <div class="product-img">
                            <img :src="value.img" mode='widthFix'/>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{value.productInfo.name}}<div>赠</div></div>
                            <div class="product-color" v-for="(sku,skuid) in value.skuName" :key="skuid">{{sku}}</div>
                        </div>
                    </div>
                
                    <div class="order-content-right">
                        <div class="product-number">共{{value.quantity}}件</div>
                    </div>
                </div>
            </div>
            
            <!-- 既有组合购又有单个商品时 -->
            <div v-else-if="item.productInfo!==''&&item.productInfo!==undefined&&item.groupProductInfo!==''&&item.groupProductInfo!==undefined">
                <div class="order-content" v-for="(value,id) in item.groupProductInfo" :key="id" @click="goDetail(item)">
                    <!-- 组合购 -->
                    <div class="order-content-left2" >
                        <div class="product-img"  v-for="(sku,sid) in value.skus" :key="sid">
                            <img :src="sku.img" mode='widthFix'/>
                        </div>
                    </div>

                    <div class="order-content-right">
                        <div v-if="value.price===0" class="product-price">￥ {{value.originalPrice}}</div>
                        <div v-if="value.price!==0" class="product-price">￥ {{value.price}}</div>
                        <!-- <div class="product-price" v-if="value.price===0">￥ {{value.originalPrice}}</div> -->
                        <div class="product-number">共{{value.quantity}}件</div>
                        <div class="order-type">{{status[item.status]}}</div>
                    </div>
                </div>
                <!--单个商品  -->
                <div class="order-content" v-for="(value,id) in item.productInfo" :key="id" @click="goDetail(item)">
                    <div class="order-content-left" >
                        <div class="product-img">
                            <img :src="value.img" mode='widthFix'/>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{value.productInfo.name}}</div>
                            <div class="product-color" v-for="(sku,skuid) in value.skuName" :key="skuid">{{sku}}</div>
                        </div>
                    </div>
                
                    <div class="order-content-right">
                        <div v-if="value.price===0" class="product-price">￥ {{value.originalPrice}}</div>
                        <div v-else class="product-price">￥ {{value.price}}</div>
                        <div class="product-number">共{{value.quantity}}件</div>
                        <div class="order-type">{{status[item.status]}}</div>
                    </div>
                </div>
                <!-- 赠品 -->
                <div class="order-content" v-for="(value,id) in item.giveawayProductList" :key="id" @click="goDetail(item)">
                    <div class="order-content-left" >
                        <div class="product-img">
                            <img :src="value.img" mode='widthFix'/>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{value.productInfo.name}}<div>赠</div></div>
                            <div class="product-color" v-for="(sku,skuid) in value.skuName" :key="skuid">{{sku}}</div>
                        </div>
                    </div>
                
                    <div class="order-content-right">
                        <div class="product-number">共{{value.quantity}}件</div>
                    </div>
                </div>
            </div>
            <!-- 订单中只有组合购时 -->
            <div v-else>
                <div class="order-content" v-for="(value,id) in item.groupProductInfo" :key="id" @click="goDetail(item)">
                    <div class="order-content-left2" >
                        <div class="product-img"  v-for="(sku,sid) in value.skus" :key="sid">
                            <img :src="sku.img" mode='widthFix'/>
                        </div>
                    </div>

                    <div class="order-content-right">
                        <div v-if="value.price===0" class="product-price">￥ {{value.originalPrice}}</div>
                        <div v-if="value.price!==0" class="product-price">￥ {{value.price}}</div>
                        <!-- <div class="product-price" v-if="value.price===0">￥ {{value.originalPrice}}</div> -->
                        <div class="product-number">共{{value.quantity}}件</div>
                        <div class="order-type">{{status[item.status]}}</div>
                    </div>
                </div>
                <!-- 赠品 -->
                <div class="order-content" v-for="(value,id) in item.giveawayProductList" :key="id" @click="goDetail(item)">
                    <div class="order-content-left" >
                        <div class="product-img">
                            <img :src="value.img" mode='widthFix'/>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{value.productInfo.name}}<div>赠</div></div>
                            <div class="product-color" v-for="(sku,skuid) in value.skuName" :key="skuid">{{sku}}</div>
                        </div>
                    </div>
                
                    <div class="order-content-right">
                        <div class="product-number">共{{value.quantity}}件</div>
                    </div>
                </div>
            </div>
            <div class="order-bottom">
                <div class="btn-pj" v-if="item.status===400" @click="goRate(item)">评价有礼</div>
                <div class="btn-pj" v-if="item.status===200" @click="waringPass">提醒发货</div>
                <div class="btn-pj" v-if="item.status===0||item.status===200" @click="cancelOrder(item.id,item.status)">取消订单</div>
                <div class="btn-buy" v-if="item.status===0" @click="payNow(item.id)">立即付款</div>
                <div class="btn-pj" v-if="item.status===300" @click="confirm(item.id)">确认收货</div>
                <div class="btn-buy" v-if="item.status===300" @click="goPage('/pages/logistics/main?id='+item.id+'&company='+item.expressName)">查看物流</div>
                <div class="btn-buy" v-if="item.status!==300 && item.status!==0" @click="addCart(item)">再次购买</div>
            </div>
        </div>
        <!-- 查找不到订单时 -->
        <div  v-if="list.length===0" style="font-size:26px;margin-top:100px;display:flex;justify-content:center;align-items:center;flex-direction:column">
            <div style="width:150px"><img src="../../../static/images/no_order.png" mode='widthFix'/></div>
            <div style="font-size:14px;color:#666;padding:16px 0 6px">您还没有订单哦~</div>
            <div style="color:#ffd636;font-size:14px" @click="goProduct">前去购买》</div> 
        </div>
    </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data(){
        return{
            status:{0:'待付款',100:'已取消',200:'待发货',300:'已发货',400:'已收货',500:'已完成',600:'已取消',700:'待退款',800:'已退款'},
            list:[],
            active:-1,
            statusType:'',
            page:0,
            lastPage:false, 
            flag:false,
            zpLiskSku:[]
        }
    },
    
    methods: {
        goProduct(){
            wx.switchTab({
                url:'/pages/products/main'
            })
        },
        addCart(item){
            let p = JSON.parse(JSON.stringify(item))
            if((p.groupProductInfo!==undefined&&p.groupProductInfo!=="")&&(p.productInfo!==undefined&&p.productInfo!=="")){
                p.productInfo = p.productInfo.concat(p.groupProductInfo[0].skus)
               
            }else if(p.groupProductInfo!==undefined&&p.groupProductInfo!==""){
                p.productInfo = p.groupProductInfo[0].skus;

            }
            let flag = false;
            
            p.productInfo.forEach(val => {
                let data = {
                    skuId:val.id,
                    token:wx.getStorageSync('token'),
                    quantity:2,
                    isIncrement:1
                }
                wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
                    
                    if(!flag){
                        if(res.statusCode === 200){
                            wx.showToast({
                                title: '已添加到购物车',
                                icon: 'success',
                                duration: 2000
                            })
                        }else{
                            wx.showToast({
                                title: '添加失败',
                                duration: 2000
                            })
                        }
                        flag = true;
                    }

                })
            })
        
        },
        waringPass(){
            wx.showToast({
                title:'提醒成功'
            })
        },
        cancelOrder(id,status){
            let that = this;
            let content = ''
            if(status===0){
                content = '是否确认取消？'
            }else{
                content = '是否申请退款？'
            }
             wx.showModal({
                title: '取消订单',
                content: content,
                success(res){
                    if(res.cancel){
                    }else if(res.confirm){
                        let data = {
                            token:wx.getStorageSync('token'),
                            orderId:id
                        }
                        console.log(data)
                        if(status===0){
                            wxRequest('mp/shop/api/user/order/cancel',{data}).then(res => {
                                console.log(res)
                                if(res.data.code === 0){
                                    wx.showToast({
                                        title:'取消成功'
                                    })
                                    that.lastPage = false;
                                    that.page = 0;
                                    that.list = [];
                                    that.getOrder();
                                }else{
                                    wx.showToast({
                                        title:'取消失败',
                                        icon:'none'
                                    })    
                                }
                            })
                            
                        }else{
                            wxRequest('mp/shop/api/user/order/cancelAndRefund',{data}).then(res => {
                                console.log(res)
                                if(res.data.code === 0){
                                    wx.showModal({
                                        content: '您好，您的订单已取消成功。支付金额将原路返回，请您注意查收。谢谢！',
                                        showCancel:false
                                    })
                                    that.lastPage = false;
                                    that.page = 0;
                                    that.list = [];
                                    that.getOrder();
                                    
                                }else if(res.data.code === 406){
                                    wx.showModal({
                                        content: '您好，您的订单已取消成功。支付金额将于72小时内原路返回，请您注意查收。谢谢！',
                                        showCancel:false
                                    })
                                    that.getOrder();
                                }else{
                                    wx.showToast({
                                        title:'取消失败',
                                        icon:'none'
                                    })
                                }
                            })
                        }
                            
                    }
                }
            })

        },
        changeTab(e){
            this.lastPage = false;
            this.active = e.mp.detail.index;
            this.page = 0;
            this.list = [];
            this.zpLiskSku = [];
            if(this.active === 0){
                this.statusType = '';
            }else if(this.active === 1){
                this.statusType = 0;
            }else if(this.active === 2){
                this.statusType = '200,700';
            }else if(this.active === 3){
                this.statusType = 300;
            }else if(this.active === 4){
                this.statusType = 400;
            }else if(this.active === 5){
                this.statusType = 500;
            }else if(this.active === 6){
                this.statusType = '100,600,800';
            }
            this.getOrder();
        },
        goDetail(item){
           
            wx.navigateTo({
                url:'/pages/placeOrder/main?detail='+JSON.stringify(item)
            })
        },
        goPage(url){
            wx.navigateTo({
                url
            })
        },
        goRate(item){

            wx.navigateTo({
                url:'/pages/rate/main?product='+JSON.stringify(item)
            })
        },
        confirm(id){
            let data = {
                token:wx.getStorageSync('token'),
                orderId:id
            }
            wxRequest('mp/shop/api/user/order/confirm',{data}).then(res => {
                if(res.data.code === 0){
                    wx.showToast({
                        title: '确认成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.lastPage = false;
                    this.page=0;
                    this.list = [];
                    this.getOrder();
                }else{
                    wx.showToast({
                        title: '确认失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        },
        getOrder(){
            if(!this.lastPage){
                wx.showLoading({
                    title:'加载中'
                })
                let data = {
                    token:wx.getStorageSync('token'),
                    status:this.statusType,
                    page:this.page,
                    size:8
                }
           
                wxRequest('mp/shop/api/user/order/query',{data}).then(res => {
                    console.log(889,res)
                    this.lastPage = res.data.data.last;
                    if(res.data.code === 0){

                        res.data.data.content.forEach(item => {
                            let quantity = 0;
                            // 是否有赠品 
                            if(item.giveawayProductInfo!=="" && item.giveawayProductInfo!==undefined){
                                item.giveawayProductList = JSON.parse(item.giveawayProductList);
                                console.log('z',item.giveawayProductList)
                                item.giveawayProductList.forEach(zp => {
                                    zp.skuName = zp.skuName.split(',');
                                    zp.img = zp.skuPicUrls.split(',')[0];
                                })
                                // item.giveawayProductInfo.forEach(val => {
                                //     val.tjList.forEach(sku => {
                                //         this.zpLiskSku.push(sku.productSkuId);
                                //     })
                                // })
                            }else{
                                item.giveawayProductInfo = [];
                            }
                           
                            // 既有组合购又有单个购 
                            if((item.groupProductInfo!==undefined&&item.groupProductInfo!=="") && (item.productInfo!==undefined&&item.productInfo!=="")){
                                item.productInfo = JSON.parse(item.productInfo);
                                item.productInfo.forEach(value => {
                                    quantity += value.quantity;
                                    value.img = value.skuPicUrls.split(',')[0];
                                    value.skuName = value.skuName.split(',');
                                    // if(this.zpLiskSku.indexOf(value.id)!==-1){
                                    //     value.iszp = true;
                                    // }
                                })
                                item.groupProductInfo = JSON.parse(item.groupProductInfo);
                                item.groupProductInfo.forEach(value => {
                                    quantity += value.quantity;
                                    value.skus.forEach(sku => {
                                        sku.img = sku.skuPicUrls.split(',')[0];
                                        // if(this.zpLiskSku.indexOf(sku.id)!==-1){
                                        //     sku.iszp = true;
                                        // }
                                    })
                                })
                            }
                            else if(item.groupProductInfo===undefined||item.groupProductInfo===""){//只有单个购
                                item.productInfo = JSON.parse(item.productInfo);
                 
                                item.productInfo.forEach(value => {
                                    quantity += value.quantity;
                                    value.img = value.skuPicUrls.split(',')[0];
                                    value.skuName = value.skuName.split(',');
                                    // if(this.zpLiskSku.indexOf(value.id)!==-1){
                                    //     value.iszp = true;
                                    // }
                                })
                            }else{//只有组合购
                                item.groupProductInfo = JSON.parse(item.groupProductInfo);
                                item.groupProductInfo.forEach(value => {
                                    quantity += value.quantity;
                                    value.skus.forEach(sku => {
                                        sku.img = sku.skuPicUrls.split(',')[0];
                                        // if(this.zpLiskSku.indexOf(sku.id)!==-1){
                                        //     sku.iszp = true;
                                        // }
                                    })
                                })
                            }
                            item.quantity = quantity;
                            item.totolFee = item.totolFee.toFixed(2)

                        })
                        
                        this.list = this.list.concat(res.data.data.content);
                        console.log(123,this.list);
                    }
                    wx.hideLoading();

                })
            }else{
                wx.showToast({
                    title:'已经到底啦~',
                    icon:'none'
                })
            }

        },
        payNow(id){
            wx.showLoading({
                title:'加载中'
            })
            let data = {
                token:wx.getStorageSync('token'),
                orderId:id
            }
            let that = this;
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
                            that.lastPage = false;
                            that.page = 0;
                            that.list = [];
                            that.getOrder();
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
    },
    //  onUnload: function () {
    //     wx.switchTab({
    //         url: '/pages/user/main',//指定界面
    //     })
    // },

    onReachBottom(){
      this.page++;
      this.getOrder();
    },
    onLoad(query){
 
        this.list = [];
    
        this.page = 0;
        this.lastPage = false;
        this.active = '6';

        this.active = parseInt(query.index);
        
        // if(this.flag){
        //     this.getOrder()
        // }
          if(this.active === 0){
                this.statusType = '';
            }else if(this.active === 1){
                this.statusType = 0;
            }else if(this.active === 2){
                this.statusType = '200,700';
            }else if(this.active === 3){
                this.statusType = 300;
            }else if(this.active === 4){
                this.statusType = 400;
            }else if(this.active === 5){
                this.statusType = 500;
            }else if(this.active === 6){
                this.statusType = '100,600,800';
            }
        this.getOrder();
        
    }
}
</script>

<style>
    @import url('../../components/common.css');
    page{
        background: rgb(247, 248, 248);
    }

    .van-tab{
        color: #333 !important;
    }
    .van-tab--active{
        color: #FFD636 !important;
    }
    .order-item{
        background: #fff;
        margin-top: 10px;
    }
    .order-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        color: #666;
        font-size: 13px;
        border-bottom: 1px solid #ededed;
    }
    .order-list{
        padding-bottom: 20px;
    }
    .order-icon{
        width: 16px;
    }
    .order-content{
        padding: 8px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ededed;
    }

    .order-content-left{
        display: flex;
        align-items: center;
        width: calc(100% - 100px);
    }
    .order-content-left2{
        display: flex;
        align-items: center;
        width: calc(100% - 100px);
        flex-wrap: nowrap;
        overflow: hidden;
    }

    .order-content-right{
        width:100px;
        text-align: right;
    }
    .product-img{
        width: 100px;
        margin-right: 10px;
    }
    .product-info{
        width: calc(100% - 60px);
    }
    .product-name{
        color: #333;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        display: flex;
        align-items: center;
    }
    .product-name>div{
        color: #fff;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: red;
        margin-left: 10px;
    }
    .product-color{
        color: #999;
        font-size: 13px;
        margin-top: 8px;
    }
    .product-price{
        font-size: 14px;
    }
    .product-number{
        font-size: 12px;
        color: #999;
        margin-top: 4px;
        text-align: right;
    }
    .order-type{
        color: #FFD636;
        font-size: 12px;
        margin-top: 4px;
        text-align: right;
    }
    .order-bottom{
        color: #666;
        font-size: 12px;
        display: flex;
        padding: 8px 14px;
        justify-content: flex-end;
    }
    .btn-pj{
        padding: 0px 6px;
        border:1px solid #999;
        margin-right: 10px;
        height: 22px;
        line-height: 22px;
    }
    .btn-buy{
        padding: 0px 6px;
        background: #FFD636;
        height: 24px; 
        line-height: 24px;
    }
</style>