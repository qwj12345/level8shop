<template>
  <div>
    <van-tabs   v-show="list.length!==0" swipeable color='#FFD636' ab-active-class='my-tab' @change="changeTab">
        <van-tab :title="allNum" title-style='color:#ffd636'></van-tab>
        <van-tab :title="enableNum"></van-tab>
        <van-tab :title="noenableNum"></van-tab>
    </van-tabs>
    <!--  -->
    <div class="coupon-content">
        <div class="coupon" v-for="(item,key) in showList" :key='key'>
                <div :class="{'coupon-left over-color':item.enable!==0,'coupon-left':item.enable===0}" v-if="item.couponInfo"><span style="font-size:12px;margin-top:-12px">￥</span><span style="font-size:32px;font-weight:bold">{{item.couponInfo.discount}}</span></div>
                <div class="coupon-right" v-if="item.couponInfo">
                    <div class="coupon-right-left">
                        <div style="font-size:14px;margin-bottom:4px;font-weight:bold" :class="{'over-color':item.enable!==0}">{{item.couponInfo.title}}</div>
                        <div class="coupon-rule-item" v-for="(rule,index) in item.couponInfo.ruleNote" :key="index">
                            <div class="coupon-cricle"></div>
                            <div>{{rule}}</div>
                        </div>

                        <div style="color:#bbb;font-size:10px;margin-top:10px;letter-spacing:0.5px;white-space: nowrap; overflow: hidden;text-overflow:ellipsis;">有效期{{item.couponInfo.startTime}}-{{item.couponInfo.endTime}}</div>
                    </div>
                    <div class="coupon-btn" v-if="item.enable===0" @click="goProduct">立即使用</div>
                </div>
                <div class="cricle">
                </div>
                <div class="cricle2">
                </div>
            </div>
             <!-- -->

        <div  v-if="showList.length===0" style="font-size:26px;margin-top:100px;display:flex;justify-content:center;align-items:center;flex-direction:column">
            <div style="width:150px"><img src="../../../static/images/no_order.png" mode='widthFix'/></div>
        </div>
    </div>
    <div class="fixed-bottom" @click="goPage">
        领取优惠券
    </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            list:[],
            showList:[],
            allNum:'',
            enableNum:'',
            noenableNum:''
        }
    },
    methods: {
        
        changeTab(e){
            if(e.mp.detail.index===0){
                this.showList = this.list;
            }else if(e.mp.detail.index===1){
                this.showList = this.list.filter((item) => item.enable===0);
            }else{
                this.showList = this.list.filter((item) => item.enable!==0);
            }
        },
        goProduct(){
            wx.switchTab({
                url:'/pages/products/main'
            })
        },
        sortRule(a,b) {
            return a.enable- b.enable;
        },
        goPage(){
            wx.navigateTo({
                url:'/pages/couponList/main'
            })
        }

    },

    onShow(){
        let enableNum = 0;
        let noenableNum = 0;
        let data = {
            token:wx.getStorageSync('token')
        }
        wxRequest('mp/shop/api/user/coupon/list',{data}).then(res => {
            console.log(59,res)

            this.list = res.data.data;

            if(this.list === ''){
                this.list = []
            }else{
                // this.list[0].enable = 1;
            }
            let date = new Date().getTime();//1587812391302  
            this.list.forEach(item => {
                item.couponInfo.startTime = item.couponInfo.startTime.split(' ')[0].replace(/-/g,'.');
                item.couponInfo.endTime = item.couponInfo.endTime.split(' ')[0].replace(/-/g,'.');
                item.couponInfo.ruleNote = item.couponInfo.ruleNote.split(',');
                if(date<new Date(item.expireTime).getTime()) {
                    console.log(new Date(item.expireTime).getTime())
                    enableNum++;
                    item.enable = 0;
                }else{
                    console.log(date)
                    noenableNum++;  
                    item.enable = 1;
                }
                // if(item.enable === 0)
                //   enableNum++;
                // else
                //   noenableNum++;  
            })
            this.list.sort(this.sortRule);
            this.enableNum = `可用券（${enableNum}）`
            this.noenableNum = `无效券（${noenableNum}）`
            this.allNum = `全部（${this.list.length}）`
            this.showList = this.list;
        })
    },
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .van-tab--active{
      color: #ffd636 !important;
  }
  .coupon-content{
      padding: 0 12px;
  }
  .coupon{
      margin-top: 10px;
      display: flex;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
  }
  .coupon-left{
      height: 110px;
      width: 32%;
      border-top-right-radius: -20px;
      background: #fff;
      color: #ffd636;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px dashed #ededed;
      box-sizing: border-box;
  }
  .cricle{
      position: absolute;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      left: calc(32% - 9px);
      top: -9px;
      z-index: 10;
      background: rgb(247, 248, 248);
  }
    .cricle2{
      position: absolute;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      left: calc(32% - 9px);
      bottom: -9px;
      z-index: 10;
      background: rgb(247, 248, 248);
  }
  .coupon-right{
      background: #fff;
      height: 110px;
      display: flex;
      align-items: center;
      width: 68%;
      padding: 0 10px 0 16px;
      box-sizing: border-box;

  }
  .coupon-rule-item{
      color: #999;
      font-size: 12px;
      display: flex;
      align-items: center;
      white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
  }
  .coupon-cricle{
      width: 4px;
      height: 4px;
      background: #999;
      border-radius: 50%;
      margin-right: 2px;
  }
  
  .coupon-right-left{
      width: calc(100% - 55px);
      overflow: hidden;
  }
  .coupon-btn{
      width: 55px;
      font-size: 12px;
      background: #ffd636;
      padding: 3px 4px;
      border-radius: 12px;
      text-align: center;
      color: #333;
  }
  .over-color{
      color: #999;
  }
  .fixed-bottom{
      width: 80%;
      margin: 10px auto;
      margin-top: 80px;
      border-radius: 26px;
      font-size: 18px;
      height: 40px;
        line-height: 40px;
        text-align: center;
        color: #333;
        background: #ffd636;
  }
</style>