<template>
  <div>
      <div class="sel-address-header">
          <input v-model="inputValue" placeholder="请输入优惠码"  placeholder-class="phcolor" @input="changeInput"/>
          <div :class="{'exchange-btn':!isInput,'exchange-btn input-exchange':isInput}">兑换</div>
      </div>
      <div style="padding:0 12px;">

        <van-radio-group :value="id" @change="changeRadio" >
            <div class="coupon" v-for="(item,key) in list" :key='key'>
                <div class="coupon-left"  v-if="item.couponInfo"><span style="font-size:12px;margin-top:-12px">￥</span><span style="font-size:32px;font-weight:bold">{{item.couponInfo.discount}}</span></div>
                <div class="coupon-right" v-if="item.couponInfo">
                    <div class="coupon-right-left">
                        <div style="font-size:14px;margin-bottom:4px;font-weight:bold">{{item.couponInfo.title}}</div>
                        <div class="coupon-rule-item" v-for="(rule,index) in item.couponInfo.ruleNote" :key="index">
                            <div class="coupon-cricle"></div>
                            <div>{{rule}}</div>
                        </div>

                        <div style="color:#bbb;font-size:10px;margin-top:10px;letter-spacing:0.5px;white-space: nowrap; overflow: hidden;text-overflow:ellipsis;">有效期{{item.couponInfo.startTime}}-{{item.couponInfo.endTime}}</div>
                    </div>
                    <van-radio style="margin-left:10px" :name="key" checked-color='#FFd637'/>
                </div>
                <div class="cricle">
                </div>
                <div class="cricle2">
                </div>
            </div>
          </van-radio-group>
      </div>
     <div class="coupon-btn" @click="backPage(1)">
          立即使用
      </div>
      <div class="coupon-btn2" @click="backPage(0)">
          不使用优惠券
      </div>

  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            id:'0',
            list:[],
            inputValue:'',
            isInput:false,
            productPrice:0
        }
    },
    methods: {
        changeRadio(e){
            this.id = e.mp.detail;
            console.log(this.id)
        },
        changeInput(){
            if(this.inputValue !== ''){
                this.isInput = true;
            }else{
                this.isInput = false;
            }
        },
        backPage(type){
            var pages = getCurrentPages();   //当前页面
            var prevPage = pages[pages.length - 2];   //上一页面
            if(type === 0){
                wx.navigateBack({
                    //返回
                    delta: 1
                })
            }else{
                if(this.productPrice >= this.list[this.id].couponInfo.orderTotalFeeValue){
                    prevPage.coupon = this.list[this.id],
                    wx.navigateBack({
                        //返回
                        delta: 1
                    })
                }else{
                    wx.showToast({
                        title:'金额未达到',
                        icon:'none',
                        duration:2000
                    })
                }

            }
        }
    },
    onShow(){
        let data = {
            token:wx.getStorageSync('token')
        }
        wxRequest('mp/shop/api/user/coupon/list',{data}).then(res => {
            console.log(res)
            this.list = res.data.data;
            this.list.forEach(item => {
                item.couponInfo.startTime = item.couponInfo.startTime.split(' ')[0].replace(/-/g,'.');
                item.couponInfo.endTime = item.couponInfo.endTime.split(' ')[0].replace(/-/g,'.');
                item.couponInfo.ruleNote = item.couponInfo.ruleNote.split(',');
            })
        })
    },
    onLoad(query){
        console.log(query.price)
        this.productPrice = query.price;
        
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .sel-address-header{
      background: #fff;
      padding: 6px 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  input{
      border: 1px solid #ededed;
      width: calc(100% - 95px);
      padding: 4px;
      border-radius: 4px;
  }
  .exchange-btn{
      border-radius: 4px;
      background: #bbb;
      color: #fff;
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
  }
  .input-exchange{
      background: #ffd636;
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
      width: 80%;
      overflow: hidden;
  }
  .coupon-btn{
      width: 80%;
      margin: 100px auto 20px;
      border-radius: 26px;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #333;
        background: #ffd636;
  }
  .coupon-btn2{
    width: 80%;
    margin: 0px auto 100px;
    border-radius: 26px;
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333;
    border: 1px solid #333;
  }
</style>