<template>
  <div>
    <header1 @openMenu='getOpen' :cartNum='cartNum' :isProducts="isFilter" @getSortId='getSort' @getGoods='getKeyWord' @getType='getType'></header1>
    <div :class="{'overNoS product-list':menuOpen,'product-list':!menuOpen}">

        <div class="product-item" v-for="(item,key) in products" :key="key" @click="goPage(item)">
          <div class="product-img">
            <img :src="item.mainPicUrl" mode='widthFix'/>
          </div>
          <div style="height:70px;display:flex;flex-direction:column;justify-content:space-between;padding-top:10px;padding-bottom:10px">
            <div class="product-name">
              {{item.name}}
            </div>
            <div class="product-price text-center">
              ￥ {{item.price}}
            </div>
          </div>
          <!-- 遮罩层 -->
          <div class="no-sale" v-if="item.saleOff">
            <div class="no-sale-img">
              <img src="../../../static/images/no_sale.png" mode='widthFix'>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import header1 from '@/components/header';
import {wxRequest} from '@/components/common'
export default {
    data(){
        return{
          sort:2,
          keyword:'',
          categoryId:0,
          products:[],
          menuOpen:false,
          isFilter:true,
          cartNum:0,
          page:0,
          lastPage:false
        }
    },
    
    components:{
      header1
    },
    methods: {
        goPage(item){
   
            wx.navigateTo({
              url:'/pages/productDetail/main?id='+item.id
            })
        },
        
        getOpen(e){
          this.menuOpen = e[0];
          this.isFilter = e[1];
        },
        getSort(e){
          this.page = 0;
          this.products = [];
          this.lastPage = false;
          this.sort = e+1;
          this.getProducts();
        },
        getKeyWord(e){
          this.page = 0;
          this.lastPage = false;
          this.categoryId = 0;
          this.products = [];
          this.keyword = e.value;
          this.getProducts();
          this.isFilter = false;
        },
        getProducts(){
          if(!this.lastPage){
            wx.showLoading({
              title:'加载中'
            })
            let that = this;
        
            let data = {
              categoryId:this.categoryId,
              page:this.page,
              size:6,
              sortType:this.sort,
              keyword:this.keyword
            }
            console.log(data)
            wxRequest('/mp/shop/api//product/query',{data}).then(res => {
              that.products = that.products.concat(res.data.data.content);
              console.log(res.data)
              this.lastPage = res.data.data.lastPage;
              wx.hideLoading();
            })
          }else{
            wx.showToast({
              title:'已经到底了',
              icon:'none'
            })
          }
            
        },
        getType(e){
          this.page = 0;
          this.lastPage = false;
          this.products = [];
          this.categoryId = e;
          this.getProducts()
        }
    },
    onReachBottom(){
      this.page++;
      console.log(this.page)
      this.getProducts();
    },
    onShow(){
      if(getApp().globalData.keyword!==undefined){
        this.keyword = getApp().globalData.keyword;
        getApp().globalData.keyword = undefined;
      }
      if(getApp().globalData.type!==undefined){
        console.log(getApp().globalData.type)
        this.categoryId = getApp().globalData.type;
        getApp().globalData.type = undefined;
      }
      this.products = [];
      this.page=0;
      this.lastPage = false;
      this.getProducts();
      setTimeout(() => {
          // 获取购物车中商品数量
          let datacart = {
              token:wx.getStorageSync('token')
          }
          wxRequest('/mp/shop/api/shopcart/query',{data:datacart}).then(res => {
              this.cartNum = 0;
              res.data.data.forEach(item => {
                this.cartNum+=item.quantity
              })
          })
        }, 1000);
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }

  .product-list{
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .product-item{
    width: 48.5%;
    height: calc((100vw - 24px) * 0.485 + 90px);
    background: #fff;
    color: #333;
    padding-bottom: 10px;
    margin-top: 20px;
    position: relative;
    box-sizing: border-box;
  }
  .product-name{
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding: 0px 10px;

  }
  .product-img{
    background: #fff;
  }
  .product-price{
    font-weight: bold;
    font-size: 14px;
  }
  .no-sale{
    position: absolute;
    background: rgba(000, 000, 000, 0.2);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .no-sale-img{
    width: 40%;
    margin-top: -50px;
  }

</style>