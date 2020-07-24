<template>
  <div>
    <header1 @openMenu='getOpen'  @getModal='getCartModal' :hasAgree='hasAgree' @getModal2='getCartModal2' :cartNum='cartNum' :isProducts="isFilter" @getSortId='getSort' @getGoods='getKeyWord' @getType='getType'></header1>
    <div :class="{'overNoS product-list':menuOpen,'product-list':!menuOpen}">

        <div class="product-item" v-for="(item,key) in products" :key="key" @click="goPage(item)">
          <div class="product-img">
            <img :src="item.mainPicUrl" mode='widthFix'/>
          </div>
          <div style="height:45px;display:flex;flex-direction:column;justify-content:space-between;padding-top:10px;">
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
import header1 from '@/components/header';
import {wxRequest,getCartNum} from '@/components/common';
import modal1 from '@/components/modal'
var mta= require('@/utils/mta_analysis.js')
export default {
    data(){
        return{
          showModal2:false,
          showModal:false,
          sort:2,
          keyword:'',
          categoryId:0,
          products:[],
          menuOpen:false,
          isFilter:true,
          cartNum:0,
          page:0,
          lastPage:false,
          hasAgree:false
        }
    },
    
    components:{
      header1,
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
        getCartModal(e){
          this.showModal =e;
        },
        getCartModal2(e){
            this.showModal2 =e;
        },
        hideModal(){
        this.showModal2 = false;
      },
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
              size:10,
              sortType:this.sort,
              keyword:this.keyword
            }
            console.log(data)
            wxRequest('/mp/shop/api//product/query',{data}).then(res => {
              console.log('product',res)
              that.products = that.products.concat(res.data.data.content);
              this.lastPage = res.data.data.last;
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
      this.getProducts();
    },
    
    onLoad(){
       mta.Page.init({
          "appID":"500717591",
          "autoReport": true,
          "statParam": true,
          "ignoreParams": [],
          "autoReport": true, //开启自动上报
          "statParam": true, //每个页面均加入参数上报
      });
      // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
          this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
          this.showModal = false;        
        }
        if(getApp().globalData.keyword===undefined && getApp().globalData.type===undefined ){
          this.products = [];
          this.page=0;
          this.lastPage = false;
          this.getProducts();
        }

    },

    onShow(){
      
      if(getApp().globalData.keyword!==undefined){
        this.keyword = getApp().globalData.keyword;
      }
      if(getApp().globalData.type!==undefined){
        console.log(getApp().globalData.type)
        this.categoryId = getApp().globalData.type;
      }

      if(getApp().globalData.keyword!==undefined || getApp().globalData.type!==undefined ){
        this.products = [];
        this.page=0;
        this.lastPage = false;
        this.getProducts();
      }
        getApp().globalData.type = undefined;
        getApp().globalData.keyword = undefined;

      setTimeout(() => {
          // 获取购物车中商品数量
   
          if(wx.getStorageSync('token')!==''){
            getCartNum().then(res => {
              this.cartNum = res;
            })
          }
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
    height: calc((100vw - 24px) * 0.485 + 70px);
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
    text-align: center;
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