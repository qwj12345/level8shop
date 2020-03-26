<template>
  <div>
    <header1  @openMenu='getOpen' :cartNum='cartNum'></header1>
    <div :class="{'overNoS discover-list':menuOpen,'discover-list':!menuOpen}">
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
    </div>
  </div>
</template>

<script>
import header1 from '@/components/header';
import {wxRequest} from '@/components/common'
export default {
    data(){
        return{
          menuOpen:false,
          articles:[],
          cartNum:0
        }
    },
    methods: {
      goDetail(item){
          item = encodeURIComponent(JSON.stringify(item))
          wx.navigateTo({
            url:'/pages/recommend/main?item='+item
          })
        
      },
      getOpen(e){
        this.menuOpen = e[0];
      },
        getArticles(){
          let that = this;
      
          let data = {
            ids:'',
            page:0,
            size:10,
            token:wx.getStorageSync('token')
          }
          wxRequest('/mp/shop/api/article/query',{data}).then(res => {
            console.log(res)
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
            this.articles = res.data.data.content;
            this.articles.forEach(item => {
             item.picUrls = item.picUrls.split(',');
            })
          })
        },
    likeIt(id,like){
      let data = {
        id,
        token:wx.getStorageSync('token')
      }
      console.log(data)
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
    },
    components:{
      header1
    },
    onShow(){
      this.getArticles();
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
    width: 48.5%;
    background: #fff;
    color: #333;
    margin-top: 20px;
    position: relative;
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