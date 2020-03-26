<template>
  <div>
      <header1 @openMenu='getOpen' :cartNum='cartNum'></header1>
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
                <img src="../../../static/images/detail-next.png" mode='widthFix'/>
            </div>
            <div class="pre-icon" @click="changeImg(0)">
                <img src="../../../static/images/detail-next.png" mode='widthFix'/>
            </div>
        </div>
        <!-- 产品信息 -->
        <div class="product-detail">
            <div class="product-detail-header">
                <div style="width:250px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{productDetail.name}}</div>
                <div class="org-price" v-if="originalPrice!==0">￥{{originalPrice}}</div>
                <div class="price"><span>￥</span> {{showPrice}}</div>
            </div>
            <div class="color">
                <div class="color-top flex-center">
                    <div class="color-top-left" v-if="colorList.length">已选择颜色：{{colorName.name}}</div>
                    <div class="color-top-right">
                        <span>分享可得10出发币</span>
                        <div class="share">
                            <img src="../../../static/images/share.png" mode='widthFix'/>
                        </div>
                    </div>
                </div>
                <div class="color-list">
                    <div class="color-item" v-for="(item,key) in colorList" :key="key"  @click="changeColor(key)">
                        
                        <img style="width:28px;height:28px;border-radius:50%" :src="item.valuePicUrl"/>
                        <div class="sel-border" v-show="item.isSelect" style="border:1px solid #999"></div>
                    </div>
                </div>
            </div>
            <div class="color">
                <div class="color-top flex-center" v-if="sizeList.length">
                    <div class="color-top-left">已选择尺寸：{{sizeName.name}}</div>
                </div>
                <div class="size-list">
                    <div class="size-item" :class="{'sel-size-item':item.isSelect}" v-for="(item,key) in sizeList" :key="key"  @click="changeSize(key)">
                        {{item.name}} 【登机箱 适合1-5天短途出差】
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

        <!--  -->
        <div class="hot-sale">
            <div class="hot-sale-title">热销推荐</div>
                <!-- 轮播图 -->
                <div style="position:relative;margin-top:50px;">
                    <swiper class='swiper' circular='true' :current='swiperId2' @change="changeHotSwiper">
                    <block v-for="(item,key) in hotImgUrls" :key="key">
                        <swiper-item class="hot-product-list">
                            <div class="hot-product"  v-for="(url,index) in item" :key="index">
                                <div><img :src="url"  mode='widthFix'/></div>
                                <span>登机箱</span>
                                <div class="color-price">
                                    冰川粉 / <span>￥ 369</span>
                                </div>
                            </div>
                        </swiper-item>
                    </block>
                    </swiper>

                    <!-- 切换的箭头 -->
                    <div class="next-icon" @click="changeHotImg(1)">
                        <img src="../../../static/images/detail-next.png" mode='widthFix'/>
                    </div>
                    <div class="pre-icon" @click="changeHotImg(0)">
                        <img src="../../../static/images/detail-next.png" mode='widthFix'/>
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
            <div class="footer-item buy" :class="{'no-sale-btn':inventory===0}" @click="goBalance('/pages/getOrder/main')">立即购买</div>
            <div class="footer-item cart" :class="{'no-sale-btn':inventory===0}" @click="addCart">加入购物车</div>
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
            inventory:1
        }
    },

    components:{
      header1
    },
    methods: {
        goTop(){
            wx.pageScrollTo({
                scrollTop: 0
            })
        },
        openParameter(){
            this.openParam === false ? this.openParam = true :this.openParam = false;
        },
        goPage(url,type){
           if(type===1){
               wx.switchTab({
                   url
               })
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
                console.log(88,res)
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
                    if(this.sizeName !== null){
                        if(value.split(':')[0] === this.sizeName.keyId.toString()){
                        if(value.split(':')[1] === this.sizeName.id.toString()){
                            sizeFlag = true;
                        }
                    }
                }else{
                    sizeFlag = true;
                }
                    
                })
                
                if(sizeFlag && colorFlag){
                    this.selSku = item;
                    console.log(this.selSku)
                    this.swiperImgs = this.selSku.skuPicUrls.split(',')
                    this.showIntergral = this.selSku.integralNum;
                    this.inventory = this.selSku.inventory;
                    return;
                }
            })
        },
        goBalance(url){
            if(this.inventory!==0){
                this.getSelSku();
                let product = null;
                if(this.colorName !== null && this.sizeName !== null){
                    product = [{img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,price:this.selSku.price,param:['颜色：'+this.colorName.name,'尺寸：'+this.sizeName.name],number:1}]
                }else if(this.colorName !== null && this.sizeName === null){
                    product = [{img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,price:this.selSku.price,param:['颜色：'+this.colorName.name],number:1}]
                }else if(this.colorName === null && this.sizeName !== null){
                    product = [{img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,price:this.selSku.price,param:['尺寸：'+this.sizeName.name],number:1}]
                }else{
                    product = [{img:this.selSku.skuPicUrls.split(',')[0],name:this.productDetail.name,price:this.selSku.price,param:[],number:1}]
                }
                let skuId = this.selSku.id;
                wx.navigateTo({
                    url:url+'?sku='+JSON.stringify([{'skuId':skuId,'quantity':'1'}])+'&products='+JSON.stringify(product)
                })
            }else{
                wx.showToast({
                    title:'商品卖完啦~',
                    icon:'none'
                })
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
            if(this.inventory!==0){
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
                    let datacart = {
                        token:wx.getStorageSync('token')
                    }
                    wxRequest('/mp/shop/api/shopcart/query',{data:datacart}).then(res => {
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
                })
            }else{
                wx.showToast({
                    title:'商品卖完啦~',
                    icon:'none'
                })
            }

      

        }
    },
    onPageScroll(e){
        this.scrollTop = e.scrollTop;
    },
    onLoad(query){
        let that =this;
        this.colorList = [];
        this.showPrice = 0;
        this.originalPrice = 0;
        this.sizeList = [];
        this.colorName = null;
        this.sizeName = null;
        let data = {
            id:query.id,

          }
        wxRequest('/mp/shop/api//product/detail',{data}).then(res => {
            console.log(22,res)
            let skuColorCodes = [];
            let skuSizeCodes = [];
            let colorId = 0;
            let sizeId = 0;
            this.skus = res.data.data.skus;
            this.swiperImgs = res.data.data.skus[0].skuPicUrls.split(',');
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
            
            this.showPrice = res.data.data.skus[0].price;
            this.inventory = res.data.data.skus[0].inventory;
            this.showIntergral = res.data.data.skus[0].integralNum;
            this.originalPrice = res.data.data.skus[0].originalPrice;
            if(this.sizeList.length !== 0){
                this.sizeName = this.sizeList[0];
                this.sizeList[0].isSelect = true;
            }
            if(this.colorList.length !== 0){
                this.colorList.forEach(item => {
                    console.log(res.data.data.skus[0].skuCode.indexOf(item.id) !== -1)
                    if(res.data.data.skus[0].skuCode.indexOf(item.id) !== -1){
                        item.isSelect = true;
                        this.colorName = item;
                    }
                })
            }
            this.productDetail = JSON.parse(JSON.stringify(res.data.data));
            console.log(this.productDetail)
            this.productDetail.scoreStar = Math.round(this.productDetail.score/100*5);
            this.productDetail.score = (this.productDetail.score/100*5).toFixed(1);
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
        })
        wxRequest('/mp/shop/api/product/evaluateList',{data:{productId:query.id,page:0,size:5}}).then(res => {
            res.data.data.content.forEach(item => {
                item.createTime = item.createTime.split(' ')[0];
                item.score = Math.round(item.score/100*5);
            })
            this.rates = res.data.data.content;
            this.rateNum = res.data.data.totalElements;
            console.log(88,res)
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
        background: rgba(000, 000, 000, 0.4);
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
        top: 50%;
        transform: translate(0,-50%);

    }
    .pre-icon{
        position: absolute;
        left: 12px;
        width: 20px;
        top: 50%;
        transform:translate(0,-50%) rotate(180deg) ;
    }
    .product-detail{
        padding: 0 12px 50px;
    }
    .product-detail-header{
        padding: 10px 0;
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
        line-height: 50px
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
        left: 0;
        top: 30%;
    }
    .hot-sale .next-icon{
        width: 10px;
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