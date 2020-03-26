<template>
  <div>
      <header1 @openMenu='getOpen'></header1>
      <div  :class="{'overNoS':menuOpen}">
        <div>
          <swiper class='swiper' autoplay="true" @change="changeSwiper" circular='true' >
            <block v-for="(item,key) in recommend.picUrls" :key="key">
              <swiper-item >
                <image :src="item"  class="slide-image" mode="widthFix" />
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
  </div>
</template>

<script>
import header1 from '@/components/header';
import {wxRequest} from '@/components/common'
export default {
  data() {
    return {
      recommend:null,
      menuOpen:false,
      imgUrls:['https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png','https://level8cases.oss-cn-hangzhou.aliyuncs.com/845ff2c7-97a1-468c-9dcc-3a4f9773ff55.png']
    }
  },
    components:{
        header1
    },
    methods: {
      getOpen(e){
            this.menuOpen = e[0];
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
              this.getArticles()
            })
          }else{
            
          }

      },
    },
    onLoad(query){
      this.recommend = JSON.parse(decodeURIComponent(query.item));
      console.log(this.recommend)
      // this.recommend.picUrls = this.recommend.picUrls.split(',');
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
  }
  .user-icon{
    width:40px;
    height:40px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 10px;
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