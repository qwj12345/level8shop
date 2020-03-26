<template>
  <div>
      <div class="logistics-top">
          <div>快递公司: {{company}}</div>
          <div>快递单号: {{num}}</div>
      </div>
      <div class="logistics-info">
          <div class="info-item" v-for="(item,key) in infos" :key="key">
              <div class="info-content">
                  <div :class="{'info-content-text color999':key!==0,'info-content-text':key===0}">{{item.context}}</div>
                  <div class="info-content-time">{{item.time}}</div>
              </div>
              <div v-if="key===0" class="active-icon">
                  <div class="active-icon-cricle"></div>
              </div>
              <div v-if="key!==0" class="no-active-icon"></div>
              <div v-if="(infos.length-1)!==key" class="info-line"></div>
          </div>

      </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            company:'',
            num:'',
            infos:[{context:'暂无物流信息',time:''},],
            // companys:{"yunda":"韵达快递","shunfeng":"顺丰快递","shentong":"申通快递","ems":"EMS快递","yuantong":"圆通速递","zhongtong":"中通快递"}
        }
    },
    onLoad(query){
        console.log(query.id)
        this.company = query.company;
        this.num = '暂无';
        let data = {
            token:wx.getStorageSync('token'),
            orderId:query.id
        }
        wxRequest('mp/shop/api/user/order/queryExpressTraceByOrderId',{data}).then(res => {
            console.log(res)
            this.infos = res.data.data.data
            this.num = res.data.data.nu;
        })
    }
}
</script>

<style>
    @import url('../../components/common.css');
    page{
        background: rgb(247, 248, 248);
    }
    .logistics-top{
        background: #fff;
        border-radius: 6px;
        width: calc(100vw - 24px);
        margin: 10px auto;
        box-sizing: border-box;
        padding: 16px 10px;
        font-size: 14px;
        color: #666;
        line-height: 25px;
    }
    .logistics-info{
        background: #fff;
        border-radius: 6px;
        width: calc(100vw - 24px);
        margin: 10px auto;
        box-sizing: border-box;
        padding: 16px 0px;
        font-size: 14px;
    }
    .info-item{
        position: relative;
        padding: 10px 28px;
    }
    .active-icon{
        position: absolute;
        left: 10px;
        top: 14px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff0bc;
        z-index: 10;
        /* border: 1px solid rgb(207, 174, 111); */
    }
    .active-icon-cricle{
        position: absolute;
        background: #FFD636;
        left: 2px;
        right: 2px;
        top: 2px;
        bottom: 2px;
        z-index: 11;
        border-radius: 50%;
    }
    .no-active-icon{
        position: absolute;
        left: 13px;
        top: 15px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #999;
        z-index: 10;
    }
    .info-line{
        position: absolute;
        top: 14px;
        left: 15px;
        width: 2px;
        background: #ccc;
        height: calc(100% + 2px);
    }
    .info-content-text{
        color: #666;
        font-size: 14px;
        letter-spacing: 1px;

    }
    .info-content-time{
        margin-top: 6px;
        color: #999;
        font-size: 13px;
        letter-spacing: 0.8px
    }
    .color999{
        color: #999 !important;
    }
</style>