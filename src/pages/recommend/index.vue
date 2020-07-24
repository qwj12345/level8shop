<template>
  <div>
      <header1 @openMenu='getOpen' :cartNum='cartNum' @getGoods='getKeyWord'   @getModal='getCartModal' :hasAgree='hasAgree' @getModal2='getCartModal2' @getType='getType'></header1>
      <div  :class="{'overNoS':menuOpen}">
        <div>
          <!--    -->
          <swiper class='swiper' autoplay="false" @change="changeSwiper" circular='true' :style="imgH[current]">
            <block v-for="(item,key) in recommend.Imgs" :key="key">
              <swiper-item  >

                <image v-if="item.isImg" :src="item.url"  class="slide-image" mode="widthFix" @load="imageLoad(key,$event)" />
                <video v-if="!item.isImg" :src="item.url"  class="slide-video" autoplay controls='false' @load="videoLoad"/>
              </swiper-item>
            </block>
          </swiper>
            <!-- <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png" mode='widthFix'/> -->
        </div>
        <div style="display:flex; margin-top:30px;padding:0 12px;align-item:center">
          <div class="user-icon">
            <img :src="recommend.userAvatarUrl" style="height:40px !important"/>
          </div>
          <div class="user-info" style="width:calc(100% - 50px)">
            <div class="flex-center" style="width:100%">
              <div class="user-name">{{recommend.userName}}</div>
              <div class="good" @click.stop="likeIt(recommend.id,recommend.like)"> 
                <div>{{recommend.likeCount}}</div>
                <div v-if="!recommend.like" class="good-icon"><img src="../../../static/images/good.png" mode='widthFix'/></div>
                <div v-if="recommend.like" class="good-icon"><img src="../../../static/images/like_good.png" mode='widthFix'/></div>
              </div>
            </div>

            <div class="location">
              <div class="location-icon">
                <img src="../../../static/images/location.png" mode='widthFix'/>
              </div>
              <div>{{recommend.locationName}}</div>
            </div>
          </div>
        </div>
        
        <!--  -->
        <div style="margin-top:30px;color:#333;;font-size:18px;padding:0 12px;letter-spacing:1.5px;line-height:26px;">
          {{recommend.title}}
        </div>
        <div style="margin-top:16px;color:#666;;font-size:13px;padding:0 12px;letter-spacing:1.2px;line-height:22px;">
          <div  v-html="recommend.content"></div>
          <!-- {{recommend.content}} -->
        </div>
        <div style="margin:50px 0;padding:0 12px;color:#999;font-size:12px">{{recommend.createTime}}</div>
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
import {wxRequest,getCartNum} from '@/components/common'
import modal1 from '@/components/modal';

export default {
    data(){
        return{
          current:0,
          imgH:[],
          showModal2:false,
          showModal:false,
          hasAgree:false,
          recommend:null,
          cartNum:0,
          menuOpen:false,
          imgUrls:['https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png']
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
          console.log('用户按了拒绝按钮');
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
      imageLoad(key,e){
      
        let h = 100 / (e.target.width/e.target.height) + 'vw'
        this.imgH[key] = 'height:'+h; 
      },
      videoLoad(e){
        console.log('v',e)
      },
      changeSwiper(e){
  
        this.current = e.target.current;

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
              this.recommend.like = true;
             
            })
          }else{
            
          }

      },
    },
     onShareAppMessage(res) {
        //转发时携带 shareTicket才能在回调中获取到shareTickets 
        wx.showShareMenu({
            withShareTicket: true
        }) 
    },
    onLoad(query){
      // 判断用户是否登录，如果是就根据hasAgree字段判断显示用户头像和昵称，并且隐藏modal
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
          this.showModal2 = false;
        }
        if(getApp().globalData.phone === 1){
          this.showModal = false;        
        }
      this.recommend = JSON.parse(decodeURIComponent(query.item));
      console.log(this.recommend)
      this.recommend.Imgs = [];
      this.recommend.picUrls.forEach(item => {
       let urlSplits = item.split('.');
       if(urlSplits[urlSplits.length-1] === 'mp4'){
          this.recommend.Imgs.push({isImg:false,url:item});
       }else{
         this.recommend.Imgs.push({isImg:true,url:item});
       }
      })
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
  .swiper{
    height: 150vw;
    transition: all .3s linear;
  }
  .user-icon{
    width:40px;
    height:40px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 10px;
  }
  .slide-video{
    width: 100vw;
  }
  .user-name{
    margin-bottom: 4px;
  }
  .location{
    display: flex;
    align-items: center;
    color: #999;
    font-size: 10px;
  }
  .location-icon{
    width: 9px;
    margin-right: 4px;
  }
  .good{
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
  }
  .good-icon{
    width: 12px;
    margin-left: 4px;
    margin-top: -4px;
  }
</style>