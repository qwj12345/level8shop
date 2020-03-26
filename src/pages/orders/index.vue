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
        <div class="order-item" v-for="(item,key) in listShow" :key="key">
            <div class="order-header">
                <div class="order-num">
                    订单编号：{{item.id}}
                </div>
                <div class="order-icon">
                    <img src="../../../static/images/rubbish.png" mode='widthFix'/>
                </div>
            </div>
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
                    <div class="product-price">￥ {{value.price}}</div>
                    <div class="product-number">共{{value.quantity}}件</div>
                    <div class="order-type">{{status[item.status]}}</div>
                </div>
            </div>
            <div class="order-bottom">
                <div class="btn-pj" v-if="item.status===400" @click="goRate(item)">评价有礼</div>
                <div class="btn-pj" v-if="item.status===200">提醒发货</div>
                <div class="btn-pj" v-if="item.status===300" @click="confirm(item.id)">确认收货</div>
                <div class="btn-buy" v-if="item.status===300" @click="goPage('/pages/logistics/main?id='+item.id+'&company='+item.expressName)">查看物流</div>
                <div class="btn-buy" v-if="item.status!==300">再次购买</div>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data(){
        return{
            status:{0:'待付款',100:'已取消',200:'待发货',300:'已发货',400:'已收货',500:'已完成'},
            list:[],
            listShow:[],
            active:0,
            statusType:0
        }
    },
     watch: {
      active(val) {
          if(this.active === 0){
              this.statusType = 0;
          }else if(this.active === 1){
              
          }
      }
    },
    methods: {
        changeTab(e){
            this.listShow = this.list.filter(item => {
                if(e.mp.detail.index === 0)
                    return item;
                else if(e.mp.detail.index === 1){
                    return item.status === 0;
                }else if(e.mp.detail.index === 2){
                    return item.status === 200;
                }else if(e.mp.detail.index === 3){
                    return item.status === 300;
                }else if(e.mp.detail.index === 4){
                    return item.status === 400;
                }else if(e.mp.detail.index === 5){
                    return item.status === 500;
                }else if(e.mp.detail.index === 6){
                    return item.status === 100;
                }
            })
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
            wx.showLoading({
                title:'加载中'
            })
            let data = {
                token:wx.getStorageSync('token'),
                status:0,
                page:0,
                size:10
            }
            console.log(data)
            wxRequest('mp/shop/api/user/order/query',{data}).then(res => {
                console.log(res)
                if(res.data.code === 0){
                    res.data.data.content.forEach(item => {
                        item.productInfo = JSON.parse(item.productInfo);
                        item.productInfo.forEach(value => {
                            value.img = value.skuPicUrls.split(',')[0]
                            value.skuName = value.skuName.split(',');
                        })
                    })
                    
                    this.list = res.data.data.content;
                    // this.listShow = this.list;
                    this.listShow = this.list.filter(item => {
                        if(this.active === '0'){
                            return item;
                        }
                        else if(this.active === 1){
                            return item.status === 0;
                        }else if(this.active === 2){
                            return item.status === 200;
                        }else if(this.active === 3){
                            return item.status === 300;
                        }else if(this.active === 4){
                            return item.status === 400;
                        }else if(this.active === 5){
                            return item.status === 500;
                        }else if(this.active === 6){
                            return item.status === 100;
                        }
                    })

                    console.log(this.listShow)
                }
                wx.hideLoading();

            })
        }
    },
    
    onLoad(query){
        this.active = query.index;
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
    .order-content-right{
        width:100px;
        text-align: right;
    }
    .product-img{
        width: 100px;
        margin-right: 10px;
    }
    .product-info{
        width: calc(100% - 110px);
    }
    .product-name{
        color: #333;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
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