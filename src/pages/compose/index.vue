<template>
  <div>
    <header1 @openMenu='getOpen'   @getGoods='getKeyWord' :hasAgree='true'  :cartNum='cartNum'></header1>
    <div :class="{'overNoS':menuOpen}">
      <div class="compose-title">组合购</div>
      <div style="padding:0 12px;margin-top:10px">
        <div class="compose-item" v-for="(item,key) in composeList" :key="key">
          <div class="compose-item-header">
            <div class="compose-header-left">
              <div class="compose-name">{{item.ruleNote}}</div>
              <div><span class="compose-now-price">￥{{item.price}}</span><span class="compose-old-price">￥{{item.originalPrice}}</span></div>
            </div>
            <div class="compose-header-right" @click="addCart(item)">加入购物车</div>
          </div>
          <div class="compose-content">
            <div class="compose-content-item" v-for="(product,index) in item.skus" :key="index">
              <div class="compose-product-img"><img :src="product.img" mode="widthFix"/></div>
              <div class="compose-product-name">{{product.productInfo.name}}<span v-if="product.size">/{{product.size}}</span></div>
              <div class="compose-product-price" v-if="product.originalPrice!==0"><span>￥</span> {{product.originalPrice}} x 1</div>
              <div class="compose-product-price" v-else><span>￥</span> {{product.price}} x 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import header1 from '@/components/header';
import {wxRequest,getCartNum} from '@/components/common';
import modal1 from '@/components/modal';
export default {
  data() {
    return {
      cartNum:0,
      menuOpen:false,
      composeList:[]
    }
  },
  components:{
      header1
    },
  methods: {
    getOpen(e){
        this.menuOpen = e[0];
    },

    getKeyWord(e){
        getApp().globalData.keyword = e.value;
        wx.switchTab({
            url:'/pages/products/main'
        })
    },
    addCart(group){
      let data = {
        skusGroupSaleId:group.skusGroupSaleId,
        token:wx.getStorageSync('token'),
        quantity:2,
        isIncrement:1
      }
      wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
        console.log(res)
        if(res.data.code===0){
          getCartNum().then(res => {
            this.cartNum = res;
          })//获取购物车数量 
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

  },
  onLoad(query){
    getCartNum().then(res => {
      this.cartNum = res;
    })

    let list = JSON.parse(query.list);
    list.forEach(item => {
      item.skus.forEach(val => {
        val.img = val.skuPicUrls.split(',')[0]
        if(val.skuName.split(',').length>1){
          val.size = val.skuName.split(',')[1].split(':')[1]
        }
      })
    })
    this.composeList = [...list];
 
  }
}
</script>

<style>
.compose-title{
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 40px;
}
.compose-item{
  border: 1px solid rgb(220, 220, 220);
  margin-bottom: 20px;
}
.compose-item-header{
  background: rgb(245, 245, 245);
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(220, 220, 220);
}
.compose-name{
  font-size: 14px;
  margin-bottom: 2px;
  font-weight: bold;
}
.compose-now-price{
  color: rgb(246, 88, 88);
  font-size: 13px; 
  font-weight: bold;
  margin-right: 10px;
}
.compose-old-price{
  color: rgb(158, 158, 158);
  font-size: 12px;
  text-decoration: line-through;
  margin-top: 2px;
}
.compose-header-right{
  background: rgb(255, 214, 54);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 13px;
}
.compose-content{
  display: flex;
  overflow: scroll;
  padding: 16px 0px;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.compose-content-item{
  width: calc(100% / 3);
  padding: 0px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
}
.compose-product-img{
  width: 100%;
}
.compose-product-name{
  font-size: 13px;
  margin: 4px 0;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;

}
.compose-product-price{
  font-size: 12px;
  font-weight: bold;
}
.compose-product-price span{
  font-weight: normal;
}
</style>
