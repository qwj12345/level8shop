<template>
  <div>
    <header1  @openMenu='getOpen'  :cartNum='cartNum' @getGoods='getKeyWord' @getType='getType'></header1>
    <div :class="{'overNoS':menuOpen}">
      <!-- banner -->
      <div>
        <img v-if="banners.banner" :src="banners.banner.valuesPicUrls" mode="widthFix"/>
      </div>
      <div class="flex-center prow mt20">
        <div class="banner-hot">
          <div class="img-text">
            <!-- <span class="img-text-title">热销推荐</span>
            <span>Recommend</span> -->
          </div>
          <img v-if="banners.banner2"  :src="banners.banner2.valuesPicUrls" mode="widthFix"/>
        </div>
        <div class="banner-footer-right" :style="{height:hotH+'px'}">
          <div class="banner-right-item">

            <img v-if="banners.banner3"  :src="banners.banner3.valuesPicUrls" mode="widthFix"/>
          </div>
          <div class="banner-right-item">
            <!-- <div class="img-text">
              <span class="img-text-title">托运箱</span>
              <span>Recommend</span>
            </div> -->
            <img v-if="banners.banner4"  :src="banners.banner4.valuesPicUrls" mode="widthFix"/>
          </div>
        </div>
      </div>
      <!-- PC 旅行箱 -->
      <div class="prow mt50" v-for="(item,key) in productList" :key="key">
        <div class="item-header flex-center">
          <span class="item-tilte">{{item.title}}</span>
          <div class="more-btn"  @click="goPage('/pages/products/main',5,item.link)">
            <img src="../../../static/images/more.png" mode="widthFix"/>
          </div>
        </div>
        <div class="item-banner mt20">
          <img :src="item.banner" mode='widthFix'/>
        </div>
        <!-- 产品列表 -->
        <div class="products mt20">
          <div class="product-item" v-for="(index,key2) in item.products" :key="key2" @click="goPage('/pages/productDetail/main?id='+index.productInfo.id,1)">
            <div class="product-img">
              <img :src="index.imgUrl" mode='widthFix' />
            </div>
            <div class="product-name mt10">{{index.productInfo.name}}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-right:6px">
              <div class="product-price">
                <div><span>￥</span><span class="price">{{index.price}}</span></div>
                <div class="del-price" v-if="index.originalPrice!==0"><span>￥</span><span>{{index.originalPrice}}</span></div>
              </div>
              <div class="cart-icon" @click.stop="addCart(index.id)">
                <img src="../../../static/images/header_cart.png" mode='widthFix'/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 达人推荐 -->
      <div class="mt50" v-if="articles.length !== 0">
        <div class="item-header flex-center prow">
          <span class="item-tilte">达人推荐</span>
          <div class="more-btn">
            <img src="../../../static/images/more.png" mode="widthFix" @click="goPage('/pages/discover/main',2)"/>
          </div>
        </div>
        <div class="item-swiper mt20">
          <swiper class='swiper'  circular='true' previous-margin='70px' next-margin='70px' :current='swiperId' @change="changeSwiper">
            <block v-for="(item,key) in articles" :key="key">
              <swiper-item @click="goRecommond(item)">
                <image :src="item.picUrls[0]"  class="slide-image" mode="widthFix" />
                <div class="swiper-bottom flex-center">
                  <div>{{item.userName}}分享</div>
                  <div class="like" @click.stop="likeIt(item.id,item.like)">
                    <span class="like-num">{{item.likeCount}}</span>
                    <div class="like-img">
                      <img v-if="!item.like" src="../../../static/images/good.png" mode="widthFix"/>
                      <img v-if="item.like" src="../../../static/images/like_good.png" mode="widthFix"/>
                    </div>
                  </div>
                </div>
              </swiper-item>
            </block>
          </swiper>
          <!-- 左右切换箭头 -->
          <div class="pre-img" @click="preImg">
            <div class="swiper-click-img">
              <img src="../../../static/images/swiper-face.png" mode="widthFix" style="transform:rotate(180deg)"/>
            </div>
          </div>
          <div class="next-img" @click="nextImg">
            <div class="swiper-click-img">
              <img src="../../../static/images/swiper-face.png" mode="widthFix" />
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--  -->
    <modal :showModal="showModal" @modalShow='getModal' @refuseModal='refuseAgree'></modal>
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
import modal from '@/components/modal'
import header1 from '@/components/header'
import {wxRequest} from '@/components/common'
export default {
  data(){
    return{
      banners:[],
      menuOpen:false,
      showModal2:false,
      showModal:false,
      hotH:0,
      swiperId:0,
      imgUrls:['https://level8cases.oss-cn-hangzhou.aliyuncs.com/cab4becd-1cb7-4004-9509-6c80ad3cc4d5.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/29d93644-8fa0-4351-b927-7bc209df46c4.png'],
      productList:[],
      articles:[],
      cartNum:0
    }
  },
  components:{
      header1,
      modal
  },

  methods: {
    getUserInfo(e){
      if (e.mp.detail.rawData){
        let rawData =  JSON.parse(e.mp.detail.rawData)
        console.log(rawData)
        this.showModal = true; 
        this.hasAgree = true;
        getApp().globalData.login = 1; //保存用户登录状态

      } else {  
        this.showModal2 = true;
        console.log('用户按了拒绝按钮')
      }
    },
    // modal组件中的值传过来
    getModal(e){
      this.showModal = e.showModal;

    },
    addCart(id){
      let data = {
        skuId:id,
        token:wx.getStorageSync('token'),
        quantity:2,
        isIncrement:1
      }
      wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
        console.log(888,res)
        if(res.statusCode === 200){
          let data = {
              token:wx.getStorageSync('token')
          }
          wxRequest('/mp/shop/api/shopcart/query',{data}).then(res => {
              this.cartNum = 0;
              res.data.data.forEach(item => {
                this.cartNum+=item.quantity
              })
          })
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '添加失败',
            duration: 2000
          })
        }
      })
    },
    hideModal(){
      this.showModal2 = false;
    },
    // 监听swiper的切换事件 获取current
    changeSwiper(e){
      this.swiperId = e.mp.detail.current;
    },
    // 底部轮播图上一张
    preImg(){
      this.swiperId = this.swiperId > 0 ? this.swiperId-1 : this.articles.length-1;
    },
    
    // 底部轮播图下一张
    nextImg(){
      this.swiperId = this.swiperId < (this.articles.length-1) ? this.swiperId+1 : 0;
    },
    goRecommond(item){
      item = encodeURIComponent(JSON.stringify(item))
      wx.navigateTo({
        url:'/pages/recommend/main?item='+item
      })
    },
    goPage(url,type,link){
      if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            if(type===1){
              wx.navigateTo({
                url:url
              })
            }
            else if(type === 5){
              getApp().globalData.type = link;
              wx.switchTab({
                url
              })
            }else{
              wx.switchTab({
                url
              })
            }
          }else{
            this.showModal = true;
          }
          }else{
          this.showModal2 = true;
        }

    },
    getOpen(e){
      this.menuOpen = e[0];
    },
    getKeyWord(e){
      getApp().globalData.keyword = e.value;
      wx.switchTab({
        url:'/pages/products/main'
      })
    },
    getType(e){
      getApp().globalData.type = e;
      wx.switchTab({
        url:'/pages/products/main'
      })
    },
    likeIt(id,like){
      let data = {
        id,
        token:wx.getStorageSync('token')
      }
      if(!like){
        wxRequest('/mp/shop/api/article/like',{data}).then(res => {
          console.log(res)
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })

          this.getArticles()
        })
      }else{
        
      }

    },
      getArticles(){
          let data = {
            ids:'',
            page:0,
            size:10,
            token:wx.getStorageSync('token')
          }
          console.log(wx.getStorageSync('token'))
          wxRequest('/mp/shop/api/article/query',{data}).then(res => {
            console.log(res)
            this.articles = res.data.data.content
            this.articles.forEach(item => {
              item.picUrls = item.picUrls.split(',')
            })
          })
        },
        compare(property){
            return function(a,b){
                var value1 = Date.parse(a[property]);
                var value2 = Date.parse(b[property]);
                return value1 - value2;
            }
        }
  },
  mounted() {
    // 计算热销推荐模块的高度
    var query = wx.createSelectorQuery();
    //选择id 
    var that = this;
    setTimeout(function(){
      query.select('.banner-hot').boundingClientRect(function (rect) {
        that.hotH = rect.height;
      }).exec();
    },500)
  },
    onShow(){
      // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
          this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
          this.showModal = false;        
        }
      console.log(getApp().globalData.phone)
        setTimeout(() => {
          this.getArticles();
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
  },

  onLoad(){
      let that = this;
      this.productList = [];
      wxRequest('/mp/shop/api/mainPage',{data:{}}).then(res => {
        that.banners = res.data.data.home_banner;
        
        // 循环获取sku
        for(let i=1;i<=parseInt(that.banners.number.valueStr);i++){

          let obj = {};
          let products = [];
          obj.title = that.banners['sku_name_'+i].valueStr;
          obj.banner = that.banners['sku_name_'+i].valuesPicUrls;
          obj.link = that.banners['sku_link_'+i].valueStr;
          let skus = that.banners['sku_'+i].valueStr;
          wxRequest('/mp/shop/api/product/queryBySkuIds',{data:{ids:skus}}).then(res2 => {
            // res2.data.data.sort()
            products = res2.data.data;
            obj.products = products;
            obj.products.forEach(item => {
              item.imgUrl = item.skuPicUrls.split(',')[0];
              // item.onSalesTime = item.productInfo.onSalesTime;
            })

            console.log(555,obj.products)
          })
            this.productList.push(obj)

        }
      })
    // 因为如果只在APP.vue中请求一次的话会出现异步的问题，就是这个onLoad比APP.vue中的onLoad先执行完
    wx.getUserInfo({
      success: function(res) {
          getApp().globalData.login = 1
          that.hasAgree = true;
      },
      fail(err){
          that.hasAgree = false;
      }
    })
  }
  
}



</script>

<style>
@import url('../../components/common.css');
page{
  background: rgb(247, 248, 248);
}
.products{
  display: flex;
  align-items: center;
  overflow: scroll;
}
.product-item{
  width: calc(100% / 3);
  flex-shrink: 0;
  padding: 0 5px;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.banner-hot{
  width: 53%;
  position: relative;
}
.img-text{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(000, 000, 000, 0.1);
  font-size: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.img-text-title{
  font-size: 22px;
  letter-spacing: 3px;
}
.banner-footer-right{
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.banner-right-item{
  position: relative;
  background: rgb(226,226,226);
  height: 49%;
}
.item-tilte{
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
  color: #333;
}
.more-btn{
  width: 80px
}

.product-name{
  font-size: 14px;
  color: rgb(50, 50, 50);
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.product-price{
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 6px;
  color: #333;
}
.price{
  font-size: 12px;
}
.del-price{
  text-decoration:line-through;
  color: #999;
  margin-top: 3px;
  margin-left: 6px;
  font-size: 10px;
}
.item-swiper{
  display: flex;
  justify-content: center;
  position: relative;
}
.swiper{
  height: calc(150vw - 214px);
  width: 100vw;
  overflow: visible;
  box-sizing: border-box;
}
swiper-item{
  padding: 0 2px;
  box-sizing: border-box;
}
.pre-img{
  position: absolute;
  background: rgba(000, 000, 000, 0.3);
  width: 68px;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.next-img{
  position: absolute;
  background: rgba(000, 000, 000, 0.3);
  width: 68px;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swiper-click-img{
  width: 16px;
}
.swiper-bottom{
  position: absolute;
  bottom: 0;
  left: 2px;
  right: 2px;
  background: rgb(000, 000, 000);
  opacity: 0.8;
  color: rgb(118, 118, 118);
  padding: 8px 12px;
  font-size: 12px;
}
.like{
  display: flex;
  align-items: center;
}
.like-img{
  width: 14px;
  margin-left: 5px;
}
.like-num{
  margin-top: 2px;
}
.cart-icon{
  margin-top: 4px;
  width: 14px;
}
</style>
