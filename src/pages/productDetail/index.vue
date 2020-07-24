<template>
  <div>
      <header1 @openMenu='getOpen' @getModal='getCartModal'  @getGoods='getKeyWord' :hasAgree='hasAgree' @getModal2='getCartModal2'  :cartNum='cartNum'></header1>
      <div :class="{'overNoS':menuOpen}">
        <!-- 轮播图 -->
        <div style="position:relative">
            <swiper class='swiper' circular='true' :current='swiperId' @change="changeSwiper">
            <block v-for="(item,key) in swiperImgs" :key="key">
                <swiper-item>
                <image :src="item"  class="slide-image" mode="widthFix" />
                <div class="no-sale" v-if="inventory===0">
                    <div class="no-sale-modal"></div>
                    <div style="width:40%"><img src="../../../static/images/no_sale.png" mode='widthFix'/></div>
                </div>
                </swiper-item>
            </block>
            </swiper>

            <!-- 切换的箭头 -->
            <div class="next-icon" @click="changeImg(1)">
                <img src="../../../static/images/detail-next.png"/>
            </div>
            <div class="pre-icon" @click="changeImg(0)">
                <img src="../../../static/images/detail-next.png" />
            </div>

        </div>
        <!-- 限时抢购 -->
        <div class="detail-purchase" v-if="purchase">
            <div class="detail-purchase-left">
                <div class="purchase-left-top">限时购</div>
                <div class="purchase-left-bottom">￥ <div class="purchase-price"> {{purchasePrice}}</div>
                    <div style="text-decoration: line-through;margin-left:10px">￥{{originalPrice}}</div>
                </div>
            </div>
            <div class="detail-purchase-right">
                <div class="purchase-right-top" v-if="isGoPurchaseTime">距离结束</div>
                <div class="purchase-right-top" v-if="!isGoPurchaseTime">距离开始</div>
                <div class="purchase-right-bottom">
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['day']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>天</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['hour']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>:</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['minite']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>:</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['second']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
            
        
                </div>
            </div>
        </div>
        <!-- 预售 -->
        <div class="detail-presale" v-if="isPresale">
            <div class="detail-purchase-left" style="color:#000">
                <div class="purchase-left-top">新品预售</div>
                <div class="purchase-left-bottom">￥ <div class="purchase-price"> {{purchasePrice}}</div>
                    <div style="text-decoration: line-through;margin-left:10px;color:#666">￥{{originalPrice}}</div>
                </div>
            </div>
            <div class="detail-purchase-right">
                <div class="purchase-right-top" style="color:#000;font-size:12px;font-weight:400">距预售结束</div>
                <div class="purchase-right-bottom">
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['day']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>天</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['hour']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>:</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['minite']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
                    <span>:</span>
                    <div class="detail-time-block">
                        <div class="detail-time-block-area" v-for="(item,key) in purchaseTime['second']" :key="key">
                        {{item}}
                        <div class="detail-time-area-modal"></div>
                        </div>
                    </div>
            
        
                </div>
            </div>
        </div>
        <!-- 产品信息 -->
        <div class="product-detail">
            <div class="product-detail-header">
                <div style="width:240px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{productDetail.name}}</div>
                <div class="org-price" v-if="originalPrice!==0 && originalPrice!==showPrice && !purchase&&!isPresale">￥{{originalPrice}}</div>
                <div v-if="!purchase&&!isPresale" class="price"><span>￥</span> {{showPrice}}</div>
            </div>
            <div class="color">
                <div class="color-top flex-center">
                    <div class="color-top-left" v-if="colorList.length">已选择颜色：{{colorName.name}}</div>
                    <button class="color-top-right" open-type='share'>
                        <span>分享可得10出发币</span>
                        <div class="share">
                            <img src="../../../static/images/share.png" mode='widthFix'/>
                        </div>
                    </button>
                </div>
                <div class="color-list">
                    <div class="color-item" v-for="(item,key) in colorList" :key="key"  @click="changeColor(key)">
                        
                        <img style="width:28px;height:28px;border-radius:50%" :src="item.valuePicUrl"/>
                        <div class="sel-border" v-show="item.isSelect" style="border:1px solid #999"></div>
                    </div>
                </div>
            </div>
            <div class="color">
                <div class="color-top flex-center" v-if="sizeList.length&&sizeName">
                    <div class="color-top-left">已选择尺寸：{{sizeName.name}}</div>
                </div>
                <div class="size-list">
                    <div class="size-item" :class="{'sel-size-item':item.isSelect}" v-for="(item,key) in sizeList" :key="key"  @click="changeSize(key)">
                        {{item.name}} <span v-if="item.name === '20寸'">【登机箱 适合1-5天短途出差】</span><span v-if="item.name === '24寸'">【需托运 适合7-15天长途旅行】</span><span v-if="item.name === '28寸'">【需托运 大容量适合出国旅行】</span>
                    </div>
                </div>
            </div>
            <!-- 评分 -->
            <div class="flex-center">
                <div class="rate">
                    <van-rate :value="productDetail.scoreStar" readonly='true'/>
                    <span>{{productDetail.score}} ({{rates.length}})</span>
                </div>
                <div class="sale-num">
                    销量 {{productDetail.salesCount}} 笔
                </div>
            </div>
        </div>
        <!--  -->
        <div class="get-integral">
            <div class="integral-icon">出发币</div>
            <div>购买可获得 {{showIntergral}} 出发币</div>
        </div>
        <!-- 买赠 -->
        <div class="parameter-info" v-if="presentList.length>0">
            <div class="parameter flex-center" @click="showPresentM"> 
                <div class="present">
                    <div style="padding:1px 6px;border:1px solid red;border-radius:4px;color:red;margin-right:10px;font-size:12px">满赠</div>
                    <div>可获得<span style="color:red;font-size:13px">{{maxValue.number}}</span>件赠品</div>
                </div>
                <div style="display:flex;align-items:center;color:#999"><span style="font-size:11px;margin-right:6px;margin-bottom:2px">查看详情</span><div style="width:7px"><img src="../../../static/images/face-right-sm.png" mode="widthFix"/></div></div>
            </div>
        </div>
        <!-- 产品参数 -->
        <div class="parameter-info">
            <div class="parameter flex-center" @click="openParameter"> 
                <div>产品参数</div>
                <img v-if="!openParam" style="width:20px;height:20px" src="../../../static/images/add.png"/>
                <img v-if="openParam" style="width:22px;height:22px" src="../../../static/images/del-icon.png"/>
            </div>
            <div v-if="openParam" class="info-content">
                <div class="info-item" v-for="(item,key) in productDetail.param" :key="key">
                    <div>{{item.name}}</div>
                    <div>{{item.value}}</div>
                </div>
            </div>
        </div>
        
        <!-- 组合购 -->
        <div class="hot-sale" v-if="composeList.length!==0">
            <div class="hot-sale-title">组合购</div>
            <!--  -->
            <div style="margin-top:20px;background:rgb(247, 248, 248);padding:10px 12px 10px 6px;display:flex;align-items:center;justify-content: space-between" @click="goPage('/pages/compose/main',3)">
                <div class="compose-left">
                    <div class="compose-img"><img :src="composeList[0].img" mode="widthFix"/></div>
                    <div>
                        <div style="font-size:15px;margin-bottom:2px;letter-spacing:1px">{{composeList[0].ruleNote}}</div>
                        <div style="font-size:12px;">最多可省 <span style="color:rgb(236, 85, 65)">￥{{composeList[0].spreadPrice}}</span></div>
                    </div>
                </div>
                <div class="compose-right">
                    <img src="../../../static/images/z-face-right.png" mode="widthFix"/>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="hot-sale" style="padding-bottom:0">
            <div class="hot-sale-title">热销推荐</div>
                <!-- 轮播图 -->
                <div style="position:relative;margin-top:40px;">
                    <swiper class='swiper' circular='true' :current='swiperId2' @change="changeHotSwiper">
                        <block v-for="(item,key) in hotImgUrls" :key="key">
                            <swiper-item class="hot-product-list">
                                <div class="hot-product"  v-for="(url,index) in item" :key="index" @click="goPage('/pages/productDetail/main?id='+url.productInfo.id,2)">
                                    <div><img :src="url.imgUrl"  mode='widthFix'/></div>
                                    <span v-if="url.productInfo">{{url.productInfo.name}}</span>
                                    <div class="color-price">
                                        {{url.color}} / <span v-if="url.price !== 0">￥ {{url.price}}</span> <span v-if="url.price === 0">￥ {{url.originalPrice}}</span>
                                    </div>
                                </div>
                            </swiper-item>
                        </block>
                    </swiper>
                    <!-- 切换的箭头 -->
                    <div class="next-icon" @click="changeHotImg(1)">
                        <img src="../../../static/images/detail-next.png"/>
                    </div>
                    <div class="pre-icon" @click="changeHotImg(0)">
                        <img src="../../../static/images/detail-next.png"/>
                    </div>
                </div>
        </div>
        
        <div class="detail-imgs">
            <img v-for="(item,key) in productDetail.mobilePagePicUrls" :key="key" :src="item" mode='widthFix'/>
        </div>
        <!-- 评论列表 -->
        <div class="comments">
            <div class="comments-title">商品评价 （{{rateNum}}）</div>
            <div class="comment-item" v-for="(item,key) in rates" :key="key">
                <div class="comment-top">
                    <div class="avatar">
                        <img :src="item.userAvatarUrl" style="height:100%"/>
                    </div>
                    <div class="commenter">
                        {{item.userName}}
                    </div>
                    <van-rate :value="item.score" color='#000000'  custom-class='icon-class' :size="size" gutter='6px' readonly='true'/>
                </div>
                <div class="comment-center">
                    {{item.content}}
                </div>
                <div class="custom-bottom">
                    <div class="custom-time">{{item.createTime}}</div>
                    <div>{{item.skuName}}</div>
                </div>
            </div>
            <div style="font-size:26px;text-align:center;margin-top:30px" v-show="rateNum===0">
                暂无评论 
            </div>

            <div v-if="rateNum>5 && !openRate" @click="readRate" class="read-more">查看全部评价</div>
        </div>
        <!-- 回到顶部 -->
        <div class="go-top-icon" v-show="scrollTop>10" @click="goTop"><img src="../../../static/images/go-top.png" mode='widthFix'/></div>
        <!-- 底部固定 -->
        <div class="footer">
            <div class="footer-item home" @click="goPage('/pages/index/main',1)">
                <div class="home-icon">
                    <img src="../../../static/images/home.png" mode='widthFix'/>
                </div>
                <span>首页</span>
            </div> 
            <div class="footer-item buy" :class="{'no-sale-btn':inventory===0}" v-if="isGoPurchaseTime===false" @click="remindMe">提醒我</div>
            <div class="footer-item buy" :class="{'no-sale-btn':inventory===0}" v-else @click="goBalance('/pages/getOrder/main')">立即购买</div>
            <div class="footer-item cart" :class="{'no-sale-btn':inventory===0||isGoPurchaseTime===false}"  @click="addCart">加入购物车</div>
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
        <!-- 客服 -->
    <button open-type="contact" session-from="weapp" class="fix-chat" style="z-index:10;">
         
    </button>
    <div class="fix-chat" style="box-shadow: #bbb 0px 0px 10px;z-index:1;background:#fff;height:50px;width:50px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center">
      <img src="../../../static/images/server_chat.png" mode="widthFix" style="width:70%" />
    </div>
    <!-- 赠品  -->
    <van-popup :show="showPresent" position="bottom" close-on-click-overlay="true" @close="showPresentM">
        <div class="present-model">
            <div class="present-header">
                <div style="width:20px"></div>
                <div>赠品详情</div>
                <div style="width:20px" @click="showPresentM"><img src="../../../static/images/close.png" mode="widthFix"/></div>
            </div>
            <div v-for="(item,key) in presentList" :key="key">
                <div class="present-info">
                    <div style="border:1px solid red;border-radius:4px;color:red;margin-right:10px;font-size:13px;height:18px;line-height:18px;width:46px;text-align:center">满赠</div>
                    <div>{{item.ruleNote}}</div>
                </div>
                <div style="margin-top:12px;font-size:12px">满赠 可获得{{item.number}}件商品</div>
                <div class="present-product">
                    <div v-for="(val,index) in item.zpList" :key="index">
                        <div class="present-product-img">
                            <img :src="val.img" mode="widthFix"/>
                            <!-- <div class="nosale-model">已赠完</div> -->
                        </div>
                        <div style="padding:6px 0 4px;">{{val.name}}</div>
                        <div>x{{val.quantity}}</div>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import header1 from '@/components/header';
import {wxRequest,getCartNum} from '@/components/common'
import modal1 from '@/components/modal';
var mta= require('@/utils/mta_analysis.js');

export default {
    data(){
        return{
            maxValue:null,
            presentList:[],
            showPresent:false,
            isPresale:false,
            purchasePrice:0,
            purchase:false,
            showModal2:false,
            showModal:false,
            hasAgree:false,
            openParam:false,
            productDetail:{},
            menuOpen:false,
            size:'10px',
            swiperId:0,
            swiperId2:0,
            imgUrls:['https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png'],
            hotImgUrls:[['https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png'],
                ['https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/4f1f795e-4e81-4c58-926f-e26103543aec.png']
            ],
            colorList:[],
            sizeList:[],
            colorName:null,
            sizeName:null,
            rates:[],
            skus:[],
            showPrice:0,
            originalPrice:0,
            selSku:{},
            swiperImgs:[],
            cartNum:0,
            showIntergral:0,
            rateNum:0,
            openRate:false,
            scrollTop:0,
            inventory:1,
            overTime:null,
            overTime2:null,
            purchaseTime:{day:[0,0],hour:[0,0],minite:[0,0],second:[0,0]},
            skuId:0,
            composeList:[],
            serverTime:0,
            flashSaleId:0,
            isGoPurchaseTime:true
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
        showPresentM(){
            this.showPresent === false ?this.showPresent=true:this.showPresent=false;
        },
        hideModal(){
            this.showModal2 = false;
        },
        getKeyWord(e){
            getApp().globalData.keyword = e.value;
            wx.switchTab({
                url:'/pages/products/main'
            })
        },
        goTop(){
            wx.pageScrollTo({
                scrollTop: 0
            })
        },
        openParameter(){
            this.openParam === false ? this.openParam = true :this.openParam = false;
        },
        remindMe(){
            if(this.hasAgree === true){   //先判断有没有授权
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                    // this.getSelSku();
                    let data = {
                        token:wx.getStorageSync("token"),
                        flashSaleId:this.flashSaleId,
                        productSkuId:this.skuId
                    }
                    wxRequest('/miniProgram/api/notification/setMPFlashSaleNotice',{data}).then(res => {
                        console.log(res)
                        if(res.data.code === 0){
                            wx.showToast({
                                title:res.data.msg
                            })
                        }else{
                            wx.showToast({
                                title:res.data.msg,
                                icon:"none"
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
        goPage(url,type){
           if(type===1){
               wx.switchTab({
                   url
               })
           }else if(type===3){
            if(this.hasAgree === true){   //先判断有没有授权
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                    wx.navigateTo({
                        url:url+'?list='+JSON.stringify(this.composeList)
                    })
               }else{
                   this.showModal = true;
               }
            }else{
                this.showModal2 = true;
            }
           }else{
               wx.navigateTo({
                   url
               })
           }
        },
        readRate(){
            wxRequest('/mp/shop/api/product/evaluateList',{data:{productId:this.productDetail.id,page:0,size:10000}}).then(res => {
                res.data.data.content.forEach(item => {
                    item.createTime = item.createTime.split(' ')[0];
                    item.score = Math.round(item.score/100*5);
                })
                this.openRate = true;
                this.rates = res.data.data.content;
                
            })

        },
        getSelSku(){
            this.skus.forEach(item => {
                let sizeFlag = false;
                let colorFlag = false;
                item.skuCode.split(',').forEach(value => {
                if(this.colorName !== null){
                    if(value.split(':')[0] === this.colorName.keyId.toString()){
                        if(value.split(':')[1] === this.colorName.id.toString()){
                            colorFlag = true;
                        }
                    }
                }else{
                    colorFlag = true;
                }
                    if(this.sizeName !== null&&item.skuCode.split(',').length>1){
                        if(value.split(':')[0] === this.sizeName.keyId.toString()){
                            if(value.split(':')[1] === this.sizeName.id.toString()){
                                sizeFlag = true;
                            }
                        }}else{
                        sizeFlag = true;
                    }
                    
                })
                //
                if(sizeFlag && colorFlag){
                    this.selSku = item;
                    console.log(this.selSku)
                    this.swiperImgs = this.selSku.skuPicUrls.split(',')
                    this.showIntergral = this.selSku.integralNum;
                    this.inventory = this.selSku.inventory;
                    this.skuId = this.selSku.id;
                    this.getCompose();
                    this.getPresent();
                    this.purchase = this.selSku.mpShopFlashSale===undefined?false:true;
                    this.isPresale = this.selSku.isPresale === 0 ? false:true;
                    clearInterval(this.overTime)
                    if(this.purchase){
                        this.purchasePrice = this.selSku.mpShopFlashSale.price;
                        this.flashSaleId = this.selSku.mpShopFlashSale.id;
                        this.purchaseM(this.selSku.mpShopFlashSale.endTime,this.selSku.mpShopFlashSale.startTime)
                    }else if(this.isPresale){
                        this.purchaseM(this.selSku.presaleTime);
                        this.purchasePrice = this.selSku.price;
                    }
                    return;
                }
            })
        },
        goBalance(url){
            if(this.hasAgree === true){   //先判断有没有授权
                if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
                    if(this.inventory!==0){
                        this.getSelSku();
                      
                        let product = null;
                        let price = this.purchase?this.selSku.mpShopFlashSale.price : this.selSku.price;
                        price = this.selSku.price;
                        if(this.colorName !== null && this.sizeName !== null){
                            product = [{skuId:this.selSku.id,img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,integralNum:this.selSku.integralNum,price:price,param:['颜色：'+this.colorName.name,'尺寸：'+this.sizeName.name],number:1}]
                        }else if(this.colorName !== null && this.sizeName === null){
                            product = [{skuId:this.selSku.id,img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,integralNum:this.selSku.integralNum,price:price,param:['颜色：'+this.colorName.name],number:1}]
                        }else if(this.colorName === null && this.sizeName !== null){
                            product = [{skuId:this.selSku.id,img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,integralNum:this.selSku.integralNum,price:price,param:['尺寸：'+this.sizeName.name],number:1}]
                        }else{
                            product = [{skuId:this.selSku.id,img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,integralNum:this.selSku.integralNum,price:price,param:[],number:1}]
                        }
                        let skuId = this.selSku.id;
                        // console.log(JSON.stringify([{'skuId':skuId,'quantity':'1'}]))
                        wx.navigateTo({
                            url:url+'?sku='+JSON.stringify([{'skuId':skuId,'quantity':'1'}])+'&products='+JSON.stringify(product)
                        })
                    }else{
                        wx.showToast({
                            title:'商品卖完啦~',
                            icon:'none'
                        })
                    }
                    }else{
                    this.showModal = true;
                }
            }else{
                this.showModal2 = true;
            }
        },
        // 箭头切换事件
        changeImg(type){
            if(type === 0){
                this.swiperId = this.swiperId > 0 ? this.swiperId-1 : this.swiperImgs.length-1;
            }else{
                this.swiperId = this.swiperId < (this.swiperImgs.length-1) ? this.swiperId+1 : 0;
            }
        },
        changeHotImg(type){
            if(type === 0){
                this.swiperId2 = this.swiperId2 > 0 ? this.swiperId2-1 : this.hotImgUrls.length-1;
            }else{
                this.swiperId2 = this.swiperId2 < (this.hotImgUrls.length-1) ? this.swiperId2+1 : 0;
            }
        },
        // 选择颜色
        changeColor(type){
            this.colorList.forEach((item,index) => {
                item.isSelect = false;
                if(index===type){
                    item.isSelect = true;
                    this.colorName = item;
                }
            })
            this.getSelSku();
            this.showPrice = this.selSku.price;
            this.originalPrice = this.selSku.originalPrice;

        },
        changeSize(type){
            this.sizeList.forEach((item,index) => {
                item.isSelect = false;
                if(index===type){
                    item.isSelect = true;
                    this.sizeName = item;
                }
            })
         
            this.getSelSku();
            this.showPrice = this.selSku.price;
            this.originalPrice = this.selSku.originalPrice;
        },
        getOpen(e){
            this.menuOpen = e[0];
        },
        addCart(){
            if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            if(this.inventory!==0&&this.isGoPurchaseTime){
                this.getSelSku();
                let skuId = this.selSku.id;
                let data = {
                    skuId:skuId,
                    token:wx.getStorageSync('token'),
                    quantity:2,
                    isIncrement:1
                }

                wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
                    // 获取购物车中商品数量 
                    getCartNum().then(res => {
                        this.cartNum = res;
                    })
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 2000
                    })
                })
            }else{
                if(this.isGoPurchaseTime===false){
                    wx.showToast({
                        title:'预售还未开始~',
                        icon:'none'
                    })
                }else{
                    wx.showToast({
                        title:'商品卖完啦~',
                        icon:'none'
                    })
                }

            }
            }else{
            this.showModal = true;
          }
          }else{
          this.showModal2 = true;
        }
      
        },
        // 限时抢购和预售方法
        purchaseM(endTime1,startTime1){
            let now = 0;
            let day = 0;
            let hour = 0;
            let minite = 0;
            let second = 0;
            
            let endTime = new Date(endTime1.replace(/-/g, "/"));
            let startTime = 0;
            if(startTime1!==undefined){
                startTime = new Date(startTime1.replace(/-/g, "/"));
            }
            let remain = 0;
            this.overTime = setInterval(()=>{
                // now = new Date();
                if(startTime!==0){
                    if(this.serverTime<startTime){
                        this.isGoPurchaseTime = false;
                        remain = startTime.getTime() - this.serverTime;

                    }else{
                        this.isGoPurchaseTime = true;
                        remain = endTime.getTime() - this.serverTime;
                    }
                }else{
                    remain = endTime.getTime() - this.serverTime;
                }
                // console.log(this.serverTime)
            
                day = Math.floor(remain/(1000*60*60*24))
                hour = Math.floor(remain % (1000*60*60*24) / (60*60000));
                minite = Math.floor((remain % (1000*60*60)) / 60000);
                second = Math.floor(remain % (1000*60) / 1000);
                
                if(hour <= 0 && minite <= 0 && day<=0 && second <=0){
                    clearInterval(this.overTime);
                    this.isPresale = false;
                    this.purchase = false;
                }
                
                day<10 ? day = '0'+day : day=day+'';
                hour<10 ? hour = '0'+hour : hour=hour+'';
                minite<10 ? minite = '0'+minite : minite=minite+'';
                second<10 ? second = '0'+second : second=second+'';
                this.purchaseTime = {day:day.split(''),hour:hour.split(''),minite:minite.split(''),second:second.split('')}
            },1000)
        },
        //获取组合购
        getCompose(){
            let data = {
                productSkuId:this.skuId
            }
            this.composeList = [];
            wxRequest('mp/shop/api/groupSale/findListByProductSkuId',{data:data}).then(res => {
              
                this.composeList = res.data.data;
                if(this.composeList.length>0)
                    this.composeList[0].spreadPrice = this.composeList[0].spreadPrice.toFixed(2)
            })
        },
        // 获取赠品
        getPresent(){
            let data = {
                productSkuId:this.skuId
            }
          
            wxRequest('mp/shop/api/giveawaySale/findListByProductSkuId',{data:data}).then(res => {
              this.presentList = res.data.data;
              this.presentList.forEach(item => {
                  item.number = 0;
                  item.zpList.forEach(val => {
                      val.img = val.sku.skuPicUrls.split(',')[0];
                      val.name = val.sku.productInfo.name;
                      item.number += val.quantity;
                  })
              })
            //   计算赠品所有组合中数量最多的那个
              this.maxValue = res.data.data.reduce((prev, cur) => {
                return prev.number > cur.number ? prev : cur
             })
        
            })
        }
    },
    

    onHide(){
        clearInterval(this.overTime)
        clearInterval(this.overTime2)
    },
    onUnload(){
        clearInterval(this.overTime)
        clearInterval(this.overTime2)
    },
    onPageScroll(e){ 
        this.scrollTop = e.scrollTop;
    },
    onShareAppMessage() {
        this.getSelSku()
        let data = {
            token:wx.getStorageSync('token'),
            skuId:this.selSku.id
        }
        wxRequest('mp/shop/api/product/share',{data:data}).then(res => {
            if(res.data.code === -1){
                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })
            }
        })
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
        wxRequest('/mp/shop/api/mainPage',{data:{}}).then(res => {
            let banners = res.data.data.home_banner;
            wxRequest('/mp/shop/api/product/queryBySkuIds',{data:{ids:banners.hot_sales.valueStr}}).then(res2 => {
                let hotImgUrls = res2.data.data;
                hotImgUrls.forEach(item => {
                    item.imgUrl = item.skuPicUrls.split(',')[0];
                    let skus = item.skuName.split(',');
                    skus.forEach(value => {
                        if(value.indexOf('颜色')!==-1){
                            item.color = value.split(':')[1]
                        }
                    })
                })
                this.hotImgUrls = [];
                this.hotImgUrls.push(hotImgUrls.slice(0,3))
                this.hotImgUrls.push(hotImgUrls.slice(3))
      

            })
        })
        let that =this;
        this.presentList = [];
        this.showPresent = false;
        this.colorList = [];
        this.showPrice = 0;
        this.originalPrice = 0;
        this.purchase = false;
        this.isPresale = false;
        this.sizeList = [];
        this.colorName = null;
        this.sizeName = null;
        this.isGoPurchaseTime = true;
        let data = {
            id:query.id,

          }
          // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
          this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
          this.showModal = false;        
        }
        wxRequest('/mp/shop/api/product/detail',{data}).then(res => {
            console.log(22,res)
            if(res.data.serverTime!==undefined){
                this.serverTime = new Date(res.data.serverTime.replace(/-/g, "/")).getTime();
                clearInterval(this.overTime2)
                this.overTime2 = setInterval(()=>{
                    this.serverTime = this.serverTime+1000;
                },1000)
            }
            
            let skuColorCodes = [];
            let skuSizeCodes = [];
            let colorId = 0;
            let sizeId = 0;
            this.skus = res.data.data.skus;
            this.skus.forEach(item => {
                if(item.price === 0){
                    item.price = item.originalPrice;
                }
            })
            res.data.data.mobilePagePicUrls = res.data.data.mobilePagePicUrls.split(',');
            res.data.data.picUrls = res.data.data.picUrls.split(',');
            // 获取后台设置的颜色和尺寸的id是什么
            res.data.data.skuAttribute.forEach((item) => {
                if(item.name === '颜色'){
                    colorId = item.id;
                }
                if(item.name === '尺寸'){
                    sizeId = item.id;
                }
            })
            // 获取此产品拥有的颜色编码和尺寸编码
            res.data.data.skus.forEach((item,key) => {
                item.skuCode.split(',').forEach(value => {
                    if(value.split(':')[0] == colorId){
                        skuColorCodes.push(value.split(':')[1])
                    }
                    if(value.split(':')[0] == sizeId){
                        skuSizeCodes.push(value.split(':')[1])
                    }
                })
            })
            // 根据此产品拥有的颜色和尺寸编码来匹配后台中对应编码的名称
            res.data.data.skuAttribute.forEach((item) => {
                if(item.name === '颜色'){
                    item.values.forEach(value => {
                        if(skuColorCodes.indexOf(value.id.toString()) !== -1){
                            this.colorList.push({name:value.value,valuePicUrl:value.valuePicUrl,id:value.id,keyId:value.keyId,isSelect:false})
                        }
                    })
                }
                if(item.name === '尺寸'){
                    item.values.forEach(value => {
                        if(skuSizeCodes.indexOf(value.id.toString()) !== -1){
                            this.sizeList.push({id:value.id,keyId:value.keyId,name:value.value,isSelect:false})
                        }
                    })
                }
            })
            
            let index = 0;
            // 如果进来的时候有传sku判断是第几个sku
            if(query.sku!==undefined){
                res.data.data.skus.forEach((item,key) => {
                    if(item.id.toString()===query.sku){
                        index = key;
                        return;
                    }
                })
            }
            this.showPrice = res.data.data.skus[index].price;
            this.purchase = res.data.data.skus[index].mpShopFlashSale === undefined ? false:true;
            this.isPresale = res.data.data.skus[index].isPresale === 0 ? false:true;
            this.inventory = res.data.data.skus[index].inventory;
            this.showIntergral = res.data.data.skus[index].integralNum;
            this.originalPrice = res.data.data.skus[index].originalPrice;
            this.swiperImgs = res.data.data.skus[index].skuPicUrls.split(',');
            this.skuId = res.data.data.skus[index].id;
            // 组合购
            this.getCompose();
            // 获取赠品
            this.getPresent();
            // 如果存在限时抢购
            if(this.purchase){
                this.purchaseM(res.data.data.skus[index].mpShopFlashSale.endTime,res.data.data.skus[index].mpShopFlashSale.startTime);
                this.flashSaleId = res.data.data.skus[index].mpShopFlashSale.id;
                this.purchasePrice = res.data.data.skus[index].mpShopFlashSale.price;
            }else if(this.isPresale){//预售
                this.purchaseM(res.data.data.skus[index].presaleTime);
                this.purchasePrice = res.data.data.skus[index].price;
            }

            if(this.sizeList.length !== 0){
                this.sizeList.forEach((item,key) => {
                    if(res.data.data.skus[index].skuName.indexOf(item.name)!==-1){
                        item.isSelect = true;
                        this.sizeName = item;
                    }
                })
            }

            if(this.colorList.length !== 0){
                this.colorList.forEach(item => {
                    if(res.data.data.skus[index].skuCode.indexOf(item.id) !== -1){
                        item.isSelect = true;
                        this.colorName = item;
                    }
                })
            }
        
            this.productDetail = JSON.parse(JSON.stringify(res.data.data));
           
            this.productDetail.scoreStar = Math.round(this.productDetail.score/100*5);
            this.productDetail.score = (this.productDetail.score/100*5).toFixed(1);
            // 获取购物车中商品数量

            if(wx.getStorageSync('token')!=='')
                getCartNum().then(res => {
                    this.cartNum = res;
                })
        })
        wxRequest('/mp/shop/api/product/evaluateList',{data:{productId:query.id,page:0,size:5}}).then(res => {
            res.data.data.content.forEach(item => {
                item.createTime = item.createTime.split(' ')[0];
                item.score = Math.round(item.score/100*5);
            })
            this.rates = res.data.data.content;
            this.rateNum = res.data.data.totalElements;
        })

    }

}
</script>

<style>
    @import url('../../components/common.css');
    page{
        background: rgb(247, 248, 248);
        padding-bottom: 50px;
    }

    .present{
        font-size: 13px;
        display: flex;
        align-items: center;
    }
    .present-model{
        padding: 16px 12px;
    }
    .present-header{
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        color: #000;
        align-items: center;
        letter-spacing: 1px;
    }
    .present-info{
        display: flex;
        color: #999;
        font-size: 12px;
        padding: 12px 20px 0 0;

    }
    .present-product{
        display: flex;
        align-items: center;
    }
    .present-product>div{
        width: calc(100% / 3);
        padding: 20px 6px;

    }
     .present-product>div>div{
         text-align: center;
         font-size: 11px;
         color: #666;
     }
     .present-product-img{
         position: relative;
     }
     .nosale-model{
         position: absolute;
         background: rgba(000, 000, 000, 0.5);
         color: #fff;
         font-size: 11px;
         bottom: 0;
         left: 0;
         right: 0;
         padding: 3px;
         letter-spacing: 1px;
     }
    .fix-chat{
        position: fixed;
        bottom: 100px;
        right: 10px;
        width: 50px;
        height: 50px;
        background: none;
    }
    .detail-purchase{
        box-sizing: border-box;
        background:linear-gradient(to right,#ee6e47,#ec5541);
        height: 56px;
        width: 100vw;
        padding: 8px 12px 6px;
        display: flex;
        justify-content: space-between;
    }
    .detail-presale{
        box-sizing: border-box;
        background:linear-gradient(to right,#eace9f,#d5b47e);
        height: 56px;
        width: 100vw;
        padding: 8px 12px 6px;
        display: flex;
        justify-content: space-between;
    }
    .detail-purchase-left{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fbe5e1;
    }
    .purchase-left-top{
        font-size: 14px;
        letter-spacing: 1px;
        
    }
    .purchase-left-bottom{
        font-size: 13px;
        display: flex;
        align-items:baseline;
    }
    .purchase-left-bottom .purchase-price{
        /* font-weight: bold; */
        font-size: 18px;
        letter-spacing: 1px;
    }
    .detail-purchase-right{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
    }
    .purchase-right-top{
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        letter-spacing: 0.5px;
    }
    .purchase-right-bottom{
        display: flex;
        align-items: center;
    }
    .purchase-right-bottom span{
        font-weight: bold;
        font-size: 16px;
        margin: 0 4px;
        line-height: 20px;
        color: #fff;
        padding-bottom: 4px;
    }
    .detail-time-block{
        display: flex;
        width: 31px;
        justify-content: space-between;
        font-weight: bold;
        font-size: 14px;
    }
   
    .detail-time-block-area{
        background: #fff;
        height: 20px;
        width: 15px;
        border-radius: 2px;
        line-height: 20px;
        text-align: center;
        color: rgb(236, 85, 65);
        overflow: hidden;
        position: relative;
    }
     .detail-presale .detail-time-block-area{
        color: #000 !important;
    }
    .detail-time-area-modal{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 50%;
        background:linear-gradient(to bottom,rgba(255, 255, 255, 0.1),rgba(250, 213, 208, 0.3),rgba(231, 66, 44, 0.3));
    }
    .detail-presale .detail-time-area-modal{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 50%;
        background:linear-gradient(to bottom,rgba(255, 255, 255, 0.1),rgba(245, 208, 145, 0.3));
    }
    .compose-left{
        display: flex;
        align-items: center;
    }
    .compose-img{
        width: 90px;
        margin-right: 16px;
    }
    .compose-right{
        width: 12px;
    }
    .overNoS{
        height: 0;
        overflow: hidden;
    }
    .swiper{
        height: 100vw;
        width: 100vw;
        overflow: visible;
        box-sizing: border-box;
    }
    .no-sale-btn{
        background: #999 !important;
        color: #fff !important;
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
    .next-icon{
        position: absolute;
        right: 12px;
        width: 20px;
        height: 40px;
        top: 50%;
        transform: translate(0,-50%);

    }
    .pre-icon{
        position: absolute;
        left: 12px;
        height: 40px;
        width: 20px;
        top: 50%;
        transform:translate(0,-50%) rotate(180deg) ;
    }
    .product-detail{
        padding: 0 12px 50px;
    }
    .product-detail-header{
        padding: 12px 0;
        display: flex;
        align-items:flex-end;
        justify-content: space-between;
        color: #333;
        letter-spacing: 1px;
        border-bottom: 1px solid #999;
    }
    .price{
        font-weight: bold;
        letter-spacing: normal;
        color: #555;
        font-size: 18px;
    }
    .org-price{
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
    }
    .price span{
        font-size: 15px;
    }
    .color-top{
        margin-top: 20px;
    }
    .color-top-left{
        font-size: 13px;
        color: #333;
    }
    .color-top-right{
        color: #666;
        font-size: 10px;
        display: flex;
        align-items: center;
        letter-spacing: 0.8px;
        margin-right: 0;
        padding-right: 0;
    }
    .share{
        width: 14px;
        margin-left: 10px
    }
    .color-list{
        display: flex;
        padding: 18px 4px;
    }
    .color-item{
    
        border-radius: 50%;
        margin-right: 16px;
        position: relative;
        box-sizing: border-box;
        /* z-index: 10 !important; */
    }
    .size-list{
        display: flex;
        flex-direction: column;
        padding: 18px 4px 10px;
    }
    .size-item{
        border-radius: 4px;
        margin-right: 16px;
        position: relative;
        box-sizing: border-box;
        align-self: baseline;
        padding: 6px;
        color: #666;
        border: 1px solid #666;
        margin-bottom: 10px;
        font-size: 15px;
        
    }
    .sel-size-item{
        color: #fff;
        background: #FFd637;
        border: none;
        box-sizing: border-box;
    }
    .sel-border{
        position: absolute;
        border-radius: 50%;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
    }
    .rate{
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #999;
    }
    .rate span{
        margin-left: 10px;
    }
    .van-rate__item {
        padding:0 !important;

    }

    .sale-num{
        font-size: 12px;
        color: #666;
    }
    .get-integral{
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        padding: 0px 12px;
        background: #fff;
        height: 50px;
        line-height: 50px
    }
    .integral-icon{
        background: #FFd637;
        padding: 0px 5px;
        height: 21px;
        line-height: 21px;
        border-radius: 4px;
        color: #fff;
        margin-right: 16px;
    }
    .parameter{
        padding: 0px 20px 0px 12px;
        font-size: 16px;
        color: #333;
        background: #fff;
        margin-top: 12px;
        height: 50px;
        /* line-height: 50px */
    }
    .parameter span{
        font-size: 24px;
    }
    .footer{
        border-top: 1px solid #ededed;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex; 
    }
    .footer-item{
        height: 50px;
        width: calc(100vw / 3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 14px;
        background: #fff;
    }
    .home span{
        margin-top: 4px;
    }
    .home-icon{
        width: 20px;
        margin-right: 10px;
    }
    .go-top-icon{
        position: fixed;
        right: 10px;
        bottom: 60px;
        width: 34px;
    }
    .info-content{
        background: #fff;
        padding: 10px 12px;
        border-top: 1px solid#ededed;
        font-size: 14px;
        color: #999;
    }
    .info-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 24px;
    }
    .buy{
        background: rgb(247, 248, 248);
    }
    .cart{
        background: #FFd637
    }
    .hot-sale{
        padding: 20px 12px;
        background: #fff;
        margin-top: 12px;
    }
    .hot-sale-title{
        font-size: 20px;
        font-weight: bold;
        color: #333;
        letter-spacing: 2px;
    }
    .hot-sale .swiper{
        height: 50vw;
        width: calc(100% - 25px);
        margin: 0 auto;
    }
    .hot-sale .hot-product-list{
        display: flex;
        justify-content: space-between;
    }
    .hot-product{
        width: 32%;
        text-align: center;
        font-size: 14px;
        color: #333;
    }
    .hot-product .color-price{
        font-size: 12px;
    }
    .hot-product .color-price span{
        font-weight: bold;
    }
    .hot-sale .pre-icon{
        width: 10px;
        height: 20px;
        left: 0;
        top: 30%;
    }
    .hot-sale .next-icon{
        width: 10px;
        height: 20px;
        right: 0;
        top: 30%;
    }
    .comments{
        padding: 30px 12px;
        background: #fff;
        margin-top: 12px;
    }
    .comments-title{
        font-size: 18px;
        color: #333;
        padding: 10px 0;
        border-bottom: 1px dashed #999;
    }
    .comment-item{
        padding: 20px 0;
    }
    .comment-top{
        display: flex;
        align-items: center;
    }
    .avatar{
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
    }
    .commenter{
        color: #5d5d5d;
        font-size: 16px;
        margin-right: 20px;
    }
    .icon-class .van-rate__icon{
        font-size: 18px;
    }
    .comment-center{
        font-size: 14px;
        color: #818181;
        padding: 15px 0px 20px 46px;
        letter-spacing: 1.5px;
        line-height: 22px;
    }
    .custom-bottom{
        display: flex;
        font-size: 12px;
        color: #999;
        justify-content: flex-end;
    }
    .custom-time{
        margin-right: 20px;
    }
    .read-more{
        width: 40vw;
        font-size: 16px;
        letter-spacing: 1.5px;
        text-align: center;
        line-height: 40px;
        height: 40px;
        border: 1px solid #b2b2b2;
        color: #666;
        margin: 50px auto 20px;
    }
</style>