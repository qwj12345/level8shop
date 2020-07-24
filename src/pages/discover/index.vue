<template>
  <div>
    <header1  @openMenu='getOpen' :cartNum='cartNum' @getGoods='getKeyWord'   @getModal='getCartModal' :hasAgree='hasAgree' @getModal2='getCartModal2' @getType='getType'></header1>
    <!-- <div :class="{'overNoS discover-list':menuOpen,'discover-list':!menuOpen}">
        <div class="discover-item" v-for="(item,key) in articles" :key="key" @click="goDetail(item)">
          <div class="discover-img">
            <img :src="item.picUrls[0]" mode='widthFix'/>
          </div>
          <div class="discover-content">
            <div class="content-title">{{item.title}}</div>
            <div class="content-bottom">
              <div>{{item.userName}}的分享</div>
              <div class="like" @click.stop="likeIt(item.id,item.like)">
                <span>{{item.likeCount}}</span>
                <div class="like-img">
                  <img v-if="!item.like" src="../../../static/images/good.png" mode="widthFix"/>
                  <img v-if="item.like" src="../../../static/images/like_good.png" mode="widthFix"/>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div> -->
    <div style="position:relative">
      <div class="discover-item"  v-for="(item,key) in articles" :key="key" @click="goDetail(item)" :style="item.style">
          <div class="discover-img">
            <img :src="item.picUrls[0]" mode='widthFix'/>
          </div>
          <div class="discover-content">
            <div style="font-size: 14px; color: #333;">{{item.title}}</div>
            <div class="content-bottom">
              <div>{{item.userName}}的分享</div>
              <div class="like" @click.stop="likeIt(item)">
                <span>{{item.likeCount}}</span>
                <div class="like-img">
                  <img v-if="!item.like" src="../../../static/images/good.png" mode="widthFix"/>
                  <img v-if="item.like" src="../../../static/images/like_good.png" mode="widthFix"/>
                </div>
              </div>
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
import modal1 from '@/components/modal';
var mta= require('@/utils/mta_analysis.js')
export default {
    data(){
        return{
          articlesRight:[],
          articlesLeft:[],
          leftH:0,
          rightH:0,
          showModal2:false,
          showModal:false,
          hasAgree:false,
          menuOpen:false,
          articles:[],
          cartNum:0,
          lastPage:false,
          page:0,
          loadLeft:100,
          loadTop:200
        }
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
      goDetail(item){
          item = encodeURIComponent(JSON.stringify(item))
          wx.navigateTo({
            url:'/pages/recommend/main?item='+item
          })
        
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
      getOpen(e){
        this.menuOpen = e[0];
      },
        getArticles(){
          if(!this.lastPage){
            let that = this;
        
            let data = {
              ids:'',
              page:this.page,
              size:10,
              token:wx.getStorageSync('token')
            }
            wxRequest('/mp/shop/api/article/query',{data}).then(res => {
              console.log(res)
              // 获取购物车中商品数量
              if(wx.getStorageSync('token')!==''){
                getCartNum().then(res => {
                  this.cartNum = res;
                })
              }
              res.data.data.content.forEach(item => {
                item.picUrls = item.picUrls.split(',');
                item.style = `left:${this.loadLeft}px;top:${this.loadTop}px`
              })
              this.lastPage = res.data.data.last;
              this.articles = this.articles.concat(res.data.data.content);
              // 瀑布流
              setTimeout(()=>{
                let minValue = 0;
                let minIndex = 0;
                let colCount = 2;
                let colHeightArray = [0,0]
                const query = wx.createSelectorQuery();
                query.selectAll('.discover-item').boundingClientRect()
                query.exec((res2) =>{
                 
                  res2[0].forEach((item,key) => {
                    minValue = colHeightArray[0]
                    minIndex = 0
                    for(var i=0;i<colCount;i++) {
                      if(colHeightArray[i]<minValue) {  //
                          minValue = colHeightArray[i];
                          minIndex = i;
                      }
                    }

                    // item.left = 100; 
                    // this.$nextTick(()=>{
                      this.articles[key].style = "left:"+(minIndex*item.width)+"px;top:"+(minValue+20)+"px";
                      // this.loadLeft = minIndex*item.width;
                      // this.loadTop = minValue+20;
                    // })
                    // this.articles[key].top =  ;
                    colHeightArray[minIndex]+=item.height+20;
                  })
                })
              },500)
            })
          }else{
            wx.showToast({
              title:'已经到底啦~',
              icon:'none'
            })
          }

        },
    likeIt(item){
      let data = {
        id:item.id,
        token:wx.getStorageSync('token')
      }
      
      if(!item.like){
        wxRequest('/mp/shop/api/article/like',{data}).then(res => {
          console.log(res)
          if(res.data.code===0){
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 2000
            })
            item.like = true;
          }else{
            wx.showToast({
              title: '点赞失败',
              icon: 'none',
              duration: 2000
            })
          }

          // this.getArticles()
        })
      }else{
        
      }

    },
    },
    onReachBottom(){
      this.page++;
      this.getArticles();
    },
    components:{
      header1,
      modal1
    },
    onLoad(){
      this.articles = [];
      this.page = 0;
      this.lastPage = false;
      mta.Page.init({
          "appID":"500717591",
          "autoReport": true,
          "statParam": true,
          "ignoreParams": [],
          "autoReport": true, //开启自动上报
          "statParam": true, //每个页面均加入参数上报
      });
      this.getArticles();

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
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }

  .discover-list{
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .discover-item{
    position:absolute;
    width: 50vw;
    color: #333;
    transition: all .2s linear;
    padding: 0 6px;
    box-sizing: border-box;
    /* position: relative; */
  }
  .discover-content{
    padding: 10px;
    background: #fff;
  }
  .content-title{
    font-size: 14px;
    color: #333;
    height: 40px;
  }
  .content-bottom{
    font-size: 12px;
    color:#999;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
  .like{
    display: flex;
    align-items: center;
  }
  .like-img{
    width: 14px;
    margin-left: 10px;
    margin-bottom: 3px;
  }
</style>