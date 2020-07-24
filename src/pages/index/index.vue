<template>
  <div>
    <header1  @openMenu='getOpen' @getModal='getCartModal' :hasAgree='hasAgree' @getModal2='getCartModal2' :cartNum='cartNum' @getGoods='getKeyWord' @getType='getType'></header1>
    <div :class="{'overNoS':menuOpen}">
      <!-- banner -->
      <div>
        <img v-if="banners.banner" :src="banners.banner.valuesPicUrls" mode="widthFix"/>
      </div>
      <div class="flex-center prow mt20">
        <div class="banner-hot" @click="goPage('/pages/products/main',5,banners.banner2.valueStr)">
          <img v-if="banners.banner2"  :src="banners.banner2.valuesPicUrls" mode="widthFix"/>
        </div>
        <div class="banner-footer-right" >
          <div class="banner-right-item" @click="goPage('/pages/products/main',5,banners.banner3.valueStr)">
            <img v-if="banners.banner3"  :src="banners.banner3.valuesPicUrls" mode="widthFix"/>
          </div>
          <div class="banner-right-item" @click="goPage('/pages/products/main',5,banners.banner4.valueStr)">
            <img v-if="banners.banner4"  :src="banners.banner4.valuesPicUrls" mode="widthFix" />
          </div>
        </div>
      </div>
      <div v-if="videoUrl!==''&&videoUrl2!==''" style="letter-spacing:1px;color:#333;font-size:18px;text-align:center;margin-top:40px">罗永浩直播推荐</div>
      <!-- video -->
      <div v-if="videoUrl!==''&&videoUrl2!==''" class="video-block">
        <video id="video1" :src="videoUrl" :show-center-play-btn="true" :show-play-btn="false" :show-fullscreen-btn="false" @fullscreenchange="outFull" >
          <div style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:10 !important;" v-if="centerBtn1" @click="goFullScreen">
            <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/poster_1-dcfd948a-d5b0-4910-ac83-92eed8395b1a.png" mode="widthFix" />
          </div>
        </video>
        <video id="video2" :src="videoUrl2"  :show-play-btn="false" :show-fullscreen-btn="false" @fullscreenchange="outFull2" >
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:10 !important;" v-if="centerBtn2" @click="goFullScreen2">
            <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/poster_2-e9fb5b91-d9ed-41ae-b0cf-11485922f7dd.png" mode="widthFix" />
          </div>
        </video>
      </div>
     <!-- 产品列表 -->
      <div v-if="videoProduct.length!==0"  class="products mt20" style="margin: 0 12px"> 
        <div class="product-item" v-for="(index,key2) in videoProduct" :key="key2" @click="goPage('/pages/productDetail/main?id='+index.productInfo.id+'&sku='+index.id,1)">
          <div class="product-img" style="position:relative">
            <img :src="index.imgUrl" mode='widthFix' />
            <div class="no-sale" v-if="index.inventory===0">
                <div class="no-sale-modal"></div>
                <div style="width:40%"><img src="../../../static/images/no_sale.png" mode='widthFix'/></div>
            </div>
          </div>
          <div class="product-name mt10">{{index.productInfo.name}}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-right:6px">
            <div class="product-price">
              <div><span>￥</span><span class="price" v-if="index.price!==0">{{index.price}}</span><span class="price" v-if="index.price===0&&index.isPresale===0">{{index.originalPrice}}</span></div>
              <div class="del-price" v-if="index.originalPrice!==0&&(index.price!==0||index.isPresale!==0)"><span>￥</span><span>{{index.originalPrice}}</span></div>
            </div>
            <div class="cart-icon"  v-if="index.inventory!==0" @click.stop="addCart(index.id)">
              <img src="../../../static/images/cart_black.png" mode='widthFix'/>
            </div>
          </div>
        </div>
      </div>
      <!-- 限时抢购 v-for="(item,key) in purchases" :key="key" v-if="purchaseProducts.length>0" -->
      <div class="prow mt50"  v-for="(item,key) in purchases" :key="key">
        <div class="item-header flex-center">
          <span class="item-tilte">限时抢购</span>
          <div class="purchase"> 
            <div class="purchase-time">
              <div class="time-block" v-if="item">
                <div  class="time-block-area" v-for="(val,index) in item['day']" :key="index"> 
                  {{val}}
                  <div class="time-area-modal"></div>
                </div>
              </div>
              <span style="font-size:18px">天</span>
              <div class="time-block"  v-if="item">
                <div class="time-block-area" v-for="(val,index) in item['hour']" :key="index"> 
                  {{val}}
                  <div class="time-area-modal"></div>
                </div>
              </div>
              <span>:</span>
              <div class="time-block"  v-if="item">
                <div class="time-block-area" v-for="(val,index) in item['minite']" :key="index"> 
                  {{val}}
                  <div class="time-area-modal"></div>
                </div>
              </div>
              <span>:</span>
              <div class="time-block"  v-if="item">
                <div class="time-block-area" v-for="(val,index) in item['second']" :key="index"> 
                  {{val}}
                  <div class="time-area-modal"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品列表  v-if="item"-->
        <div class="products mt20" v-if="item">
          <div class="product-item" v-for="(index,key2) in item.products" :key="key2" @click="goPage('/pages/productDetail/main?id='+index.productInfo.id+'&sku='+index.id,1)">
            <div class="product-img" style="position:relative">
              <img :src="index.imgUrl" mode='widthFix' />
              <div class="no-sale" v-if="index.inventory===0">
                    <div class="no-sale-modal"></div>
                    <div style="width:40%"><img src="../../../static/images/no_sale.png" mode='widthFix'/></div>
                </div>
            </div>
            <div class="product-name mt10">{{index.productInfo.name}}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-right:6px">
              <div class="product-price">
                <div><span>￥</span><span class="price" v-if="index.price!==0">{{index.price}}</span><span class="price" v-if="index.price===0">{{index.originalPrice}}</span></div>
                <div class="del-price" v-if="index.originalPrice!==0&&index.price!==0"><span>￥</span><span>{{index.originalPrice}}</span></div>
              </div>
              <div class="cart-icon"  v-if="index.inventory!==0" @click.stop="addCart(index.id)">
                <img src="../../../static/images/cart_black.png" mode='widthFix'/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- PC 旅行箱 -->
      <div class="prow mt50" v-for="(item,key) in productList" :key="key">
        <div class="item-header flex-center">
          <span class="item-tilte">{{item.title}}</span>
          <div class="more-btn"  @click="goPage('/pages/products/main',5,item.link)">
            <img src="../../../static/images/more.png" mode="widthFix" />
          </div>
        </div>
        <div class="item-banner mt20"  @click="goPage('/pages/products/main',5,item.link)">
          <img :src="item.banner" mode='widthFix'/>
        </div>
        <!-- 产品列表 -->
        <div class="products mt20">
          <div class="product-item" v-for="(index,key2) in item.products" :key="key2" @click="goPage('/pages/productDetail/main?id='+index.productInfo.id+'&sku='+index.id,1)">
            <div class="product-img" style="position:relative">
              <img :src="index.imgUrl" mode='widthFix' />
              <div class="no-sale" v-if="index.inventory===0">
                    <div class="no-sale-modal"></div>
                    <div style="width:40%"><img src="../../../static/images/no_sale.png" mode='widthFix'/></div>
                </div>
            </div>
            <div class="product-name mt10">{{index.productInfo.name}}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-right:6px">
              <div class="product-price">
                <div><span>￥</span><span class="price" v-if="index.price!==0">{{index.price}}</span><span class="price" v-if="index.price===0">{{index.originalPrice}}</span></div>
                <div class="del-price" v-if="index.originalPrice!==0&&(index.price!==0||index.isPresale!==0)"><span>￥</span><span>{{index.originalPrice}}</span></div>
              </div>
              <div class="cart-icon"  v-if="index.inventory!==0" @click.stop="addCart(index.id)">
                <img src="../../../static/images/cart_black.png" mode='widthFix'/>
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

    <!-- 在线客服  -->
    <button open-type="contact" session-from="weapp" class="fix-chat" style="z-index:10;"> 
    </button>

    <div class="fix-chat" style="box-shadow: #bbb 0px 0px 10px;z-index:1;background:#fff;height:50px;width:50px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center">
      <img src="../../../static/images/server_chat.png" mode="widthFix" style="width:70%" />
    </div>
  </div>
</template>

<script>
import modal from '@/components/modal'
import header1 from '@/components/header'
import {wxRequest,getCartNum} from '@/components/common'
// import {mta} from '@/utils/mta_analysis.js'
var mta= require('@/utils/mta_analysis.js')


export default {
  data(){
    return{
      centerBtn1:true,
      centerBtn2:true,
      videoUrl:'',
      videoUrl2:'',
      purchases:[],
      hasAgree:false,
      banners:[],
      menuOpen:false,
      showModal3:true,
      showModal2:false,
      showModal:false,
      hotH:0,
      swiperId:0,
      imgUrls:['https://level8cases.oss-cn-hangzhou.aliyuncs.com/cab4becd-1cb7-4004-9509-6c80ad3cc4d5.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/29d93644-8fa0-4351-b927-7bc209df46c4.png'],
      productList:[],
      articles:[],
      cartNum:0,
      overTime:[],
      purchaseProducts:[],
      videoContext:null,
      videoContext2:null,
      videoProduct:[]
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
    getCartModal(e){
      this.showModal =e;
    },
    getCartModal2(e){
        this.showModal2 =e;
    },
    addCart(id){
      if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            let data = {
                skuId:id,
                token:wx.getStorageSync('token'),
                quantity:2,
                isIncrement:1
              }
              wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {

                if(res.statusCode === 200){
                  getCartNum().then(res => {
                    this.cartNum = res;
                  })
                  wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: '添加失败',
                    icon:'none',
                    duration: 2000
                  })
                }
              })
          }else{
            this.showModal = true;
          }
          }else{
          this.showModal2 = true;
        }
      
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
    outFull(e){
      if(!e.mp.detail.fullScreen){
        this.centerBtn1 = true;
        this.centerBtn2 = true;
        this.videoContext.pause();
        this.videoContext.stop();
        
      }else{
        this.centerBtn1 = false;
      }
      console.log(1,this.centerBtn2)
    },
    outFull2(e){
      console.log(2,e)
      if(!e.mp.detail.fullScreen){
        this.centerBtn2 = true;
        this.centerBtn1 = true;
        this.videoContext2.pause();
        this.videoContext2.stop();
      }else{
        this.centerBtn2 = false;
      }
    },
    goFullScreen(){
      if(this.centerBtn1){

        this.videoContext = wx.createVideoContext('video1',this);

      this.videoContext.play();
        this.centerBtn1 = false;
        this.videoContext.requestFullScreen({
          success: res => {
            console.log('play success')
          },
          fail: res => {
            console.log('play fail')
          },
          complete: res => {
            console.log('play fail');
          },
        })
      }
   
    },
    goFullScreen2(){
      if(this.centerBtn2){
        this.videoContext2 = wx.createVideoContext('video2',this);

        this.videoContext2.play();
        this.centerBtn2 = false;

        this.videoContext2.requestFullScreen({
          success: res => {
            console.log('play success');
          },
          fail: res => {
            console.log('play fail');
          },
          complete: res => {
            console.log('play fail');
          },
        })
      }

    },
    goRecommond(item){
      item = encodeURIComponent(JSON.stringify(item));
      wx.navigateTo({
        url:'/pages/recommend/main?item='+item
      })
    },
    goPage(url,type,link){
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

          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })

          this.getArticles()
        })
      }
    },
      getArticles(){
          let data = {
            ids:'',
            page:0,
            size:10,
            token:wx.getStorageSync('token')
          }
          
          wxRequest('/mp/shop/api/article/query',{data}).then(res => { 
              this.articles = res.data.data.content.filter(item => {
              item.picUrls = item.picUrls.split(',');
              return item.isShow === 0;
            })
          })
        },
        getPurchaseM(){
          this.purchaseProducts = [];
          // 限时抢购
          wxRequest('/mp/shop/api/flashSale/list',{data:{}}).then(res => {
            res.data.data.forEach((item,index) => {
              if(item.productSkuIds.join(',')!=='');
              wxRequest('/mp/shop/api/product/queryBySkuIds',{data:{ids:item.productSkuIds.join(',')}}).then(res2 => {
                res2.data.data.forEach((val,index) => {
                  val.imgUrl = val.skuPicUrls.split(',')[0];
                })
                let products = [...res2.data.data];
                // let products = this.purchaseProducts.concat(res2.data.data);
                // this.purchaseProducts = JSON.parse(JSON.stringify(products))

              let now = new Date(res.data.serverTime.replace(/-/g, "/"));
              let day = 0;
              let hour = 0;
              let minite = 0;
              let second = 0; 
              let nowTime = now.getTime();
              
              item.endTime = new Date(item.endTime.replace(/-/g, "/"));
              item.startTime = new Date(item.startTime.replace(/-/g, "/"));
              this.overTime[index] = setInterval(()=>{            //多个活动就有多个定时器，所以要用数组
                    nowTime = nowTime+1000;
                    let remain = 0;
                    if(item.startTime.getTime() > nowTime){ 
                      remain = item.startTime.getTime() - nowTime;
                    }else{
                      remain = item.endTime.getTime() - nowTime;
                    }
                  
                    day = Math.floor(remain/(1000*60*60*24));
                    hour = Math.floor(remain % (1000*60*60*24) / (60*60000));
                    minite = Math.floor((remain % (1000*60*60)) / 60000);
                    second = Math.floor(remain % (1000*60) / 1000);
                  
                    if(hour === 0 && minite === 0 && day===0 && second ===0){
                        clearInterval(this.overTime[index]);
                    }
                    day<10 ? day = '0'+day : day=day+'';
                    hour<10 ? hour = '0'+hour : hour=hour+'';
                    minite<10 ? minite = '0'+minite : minite=minite+'';
                    second<10 ? second = '0'+second : second=second+'';
                    let time = {day:day.split(''),hour:hour.split(''),minite:minite.split(''),second:second.split(''),products:products}
                    this.$set(this.purchases,index,time)

                    // console.log('purhcase',this.purchases)
                },1000)

              })
 
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

  onHide(){//页面隐藏时清除定时器 保持性能
    this.overTime.forEach(item => {
      clearInterval(item)
    })
  },
  onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets
        wx.showShareMenu({
            withShareTicket: true
        }) 
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
 
        setTimeout(() => {
          this.getArticles();
          // 获取购物车中商品数量
          if(wx.getStorageSync('token')!==''){
            getCartNum().then(res => {
              this.cartNum = res;
            })
          }
        }, 1000);
      this.getPurchaseM();

  },
  onLoad(){ 
      let that = this;
      this.productList = [];
      mta.Page.init({
          "appID":"500717591",
          "autoReport": true,
          "statParam": true,
          "ignoreParams": [],
          "autoReport": true, //开启自动上报
          "statParam": true, //每个页面均加入参数上报
      });
      wxRequest('/mp/shop/api/mainPage',{data:{}}).then(res => {
        that.banners = res.data.data.home_banner;
        if(that.banners.video_name!==undefined){
          that.videoUrl = that.banners.video_name.valuesPicUrls.split(',')[0];
          that.videoUrl2 = that.banners.video_name.valuesPicUrls.split(',')[1];
          let videoSkus = that.banners.video.valueStr;
          let videoSkusImg = that.banners.video.valuesPicUrls.split(',');
          // 获取视频模块的产品
            wxRequest('/mp/shop/api/product/queryBySkuIds',{data:{ids:videoSkus}}).then(res2 => { 
              res2.data.data.forEach((item,key) => {
                item.imgUrl = videoSkusImg[key];
              })
              that.videoProduct = res2.data.data;
            })
        }

        // 循环获取sku
        for(let i=1;i<=parseInt(that.banners.number.valueStr);i++){
          let obj = {};
          let products = [];
          obj.title = that.banners['sku_name_'+i].valueStr;
          obj.banner = that.banners['sku_name_'+i].valuesPicUrls;
          obj.link = that.banners['sku_link_'+i].valueStr;
          let skus = that.banners['sku_'+i].valueStr;
          let skuImgs=that.banners['sku_'+i].valuesPicUrls.split(',');
         
          wxRequest('/mp/shop/api/product/queryBySkuIds',{data:{ids:skus}}).then(res2 => {  
            products = res2.data.data;
            obj.products = products;
            obj.products.forEach((item,key) => {
              item.imgUrl = skuImgs[key];
            })
          })
            this.productList.push(obj);
        }
      })
    // 因为如果只在APP.vue中请求一次的话会出现异步的问题，就是这个onLoad比APP.vue中的onLoad先执行完
    wx.getUserInfo({
      success: function(res) {
          getApp().globalData.login = 1;
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
.video-block{
  display: flex;
  justify-content: space-between;
  padding: 20px 12px;
}
.video-block video{
  width: 48%;
  height: calc((100vw - 24px) * 0.48 *1.2);
  position: relative;
}
.fix-chat{
  position: fixed;
  bottom: 20px;
  right: 15px;
  width: 50px;
  height: 50px;
  background: none;
}
.purchase{
  color: #333;
  display: flex;
  font-size: 12px;
  align-items: center;
}
.purchase-time{
  display: flex;
  align-items: center;
}
.purchase-time span{
  font-weight: bold;
  font-size: 18px;
  margin: 0 5px;
  line-height: 28px;
}
.time-block{
  display: flex;
  width: 37px;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  
}
.time-block-area{
  background: #000;
  height: 28px;
  width: 18px;
  border-radius: 4px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  position: relative;
}
.time-area-modal{
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  bottom: 0;
  background: rgba(000, 000, 000, 0.3);
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
.no-sale{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.no-sale-modal{
    background: rgba(000, 000, 000, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  height: calc((100vw - 24px) * 0.53 * 0.7527);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.banner-right-item{
  position: relative;
  /* height: 49%; */
}

.item-tilte{
  font-size: 22px;
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
  width: 72px;
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
  width: 72px;
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
  padding: 2px;
  border-radius: 50%;
  background: #000;
}
</style>
