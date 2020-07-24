<template>
  <div>
    <!--  -->
    <div class="coupon-content">
        <div class="coupon" v-for="(item,key) in list" :key='key'>
                <div class="coupon-left"><span style="font-size:12px;margin-top:-12px">￥</span><span style="font-size:32px;font-weight:bold">{{item.discount}}</span></div>
                <div class="coupon-right">
                    <div class="coupon-right-left">
                        <div style="font-size:14px;margin-bottom:4px;font-weight:bold" >{{item.title}}</div>
                        <div class="coupon-rule-item" v-for="(rule,index) in item.ruleNote" :key="index">
                            <div class="coupon-cricle"></div>
                            <div>{{rule}}</div>
                        </div>

                        <div style="color:#bbb;font-size:10px;margin-top:10px;letter-spacing:0.5px;white-space: nowrap; overflow: hidden;text-overflow:ellipsis;">有效期{{item.startTime}}-{{item.endTime}}</div>
                    </div>
                    <div class="coupon-btn"  @click="goDetail(item)">立即领取</div>
                </div>
                <div class="cricle">
                </div>
                <div class="cricle2">
                </div>
            </div>
             <!--  -->

        <div  v-if="list.length===0" style="font-size:26px;margin-top:100px;display:flex;justify-content:center;align-items:center;flex-direction:column">
            <div style="width:150px"><img src="../../../static/images/no_order.png" mode='widthFix'/></div>
        </div>
        <!-- <div class="coupon" v-for="(item,key) in showList" :key='key'>
            <div :class="{'coupon-left over-color':item.over,'coupon-left':!item.over}"><span style="font-size:12px;margin-top:-12px">￥</span><span style="font-size:32px;font-weight:bold">{{item.price}}</span></div>
            <div class="coupon-right">
                <div class="coupon-right-left">
                    <div style="font-size:14px;margin-bottom:4px;font-weight:bold" :class="{'over-color':item.over}">{{item.name}}</div>
                    <div class="coupon-rule-item" v-for="(rule,index) in item.rules" :key="index">
                        <div class="coupon-cricle"></div>
                        <div>{{rule}}</div>
                    </div>

                    <div style="color:#bbb;font-size:10px;margin-top:10px;letter-spacing:0.5px;white-space: nowrap; overflow: hidden;text-overflow:ellipsis;">{{item.time}}</div>
                </div>
                <div class="coupon-btn" v-if="!item.over">立即使用</div>
            </div>
            <div class="cricle">
            </div>
            <div class="cricle2">
            </div>
        </div> -->
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
        
        goDetail(item){
            wx.navigateTo({
                url:'/pages/getCoupon/main?item='+JSON.stringify(item)
            })
        },
        sortRule(a,b) {
            return a.enable- b.enable;
        },

    },

    onShow(){
        let enableNum = 0;
        let noenableNum = 0;
        let data = {
        }
        wxRequest('mp/shop/api/coupon/list',{data}).then(res => {
                console.log(res)
            this.list = res.data.data;

            if(this.list === ''){
                this.list = []
            }else{
                // this.list[0].enable = 1;
            }

            this.list.forEach(item => {
                item.startTime = item.startTime.split(' ')[0].replace(/-/g,'.');
                item.endTime = item.endTime.split(' ')[0].replace(/-/g,'.');
                item.ruleNote = item.ruleNote.split(',');
            })
            console.log(59,this.list)


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

</style>