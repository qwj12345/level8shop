<template>
  <div>
      <div class="products" v-for="(item,key) in ptoductList" :key="key">
          <div class="product-img">
              <img :src="item.img" mode='widthFix'/>
          </div>
          <div class="product-content">
              <span>{{item.productInfo.name}}</span>
              <span v-for="(sku,index) in item.skuName" :key="index" style="color:#999;margin-top:10px">{{sku}}</span>
          </div>
      </div>
      <!--  -->
      <div class="rate-star">
          <div class="rate-star-title">评分</div>
          <van-rate value="5"  custom-class='icon-class' @change='changeRate'/>
          <div class="rate-star-result">非常满意</div>
      </div>
    <!--  -->
    <textarea v-model="evaluateContent" placeholder="评价超过15个字可获得出发币~"></textarea>
    <!--  -->
    <div class="take-photo">
        <div class="photo"><img src="../../../static/images/photo.png" mode='widthFix'></div>
        <div>添加图片 / 视频</div>
    </div>
    <div class="rate-bottom">
        <div class="rate-btn" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            ptoductList:[],
            orderId:'',
            evaluateScore:5,
            evaluateContent:'',
            evaluateImgs:''
        }
    },
    methods: {
        submit(){
            let data = {
                token:wx.getStorageSync('token'),
                orderId:this.orderId,
                evaluateScore:this.evaluateScore,
                evaluateContent:this.evaluateContent,
                evaluateImgs:this.evaluateImgs
            }

            wxRequest('mp/shop/api/user/order/evaluate',{data}).then(res => {
                console.log(res)
                if(res.data.code === 0){
                    wx.showToast({
                        title:'评价成功',
                        duration:2000
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    },2000)
   
                }
            })
        },
        changeRate(e){
            this.evaluateScore = e.mp.detail / 5 * 100;
        }
    },
    onLoad(query){
        this.evaluateScore = 5;
        this.evaluateContent = '';
        this.evaluateImgs = '';
        console.log(JSON.parse(query.product))
        this.orderId = JSON.parse(query.product).id;
        this.ptoductList = JSON.parse(query.product).productInfo;
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .products{
      display: flex;
      padding: 10px 12px;
      background: #fff;
      margin-top: 10px;
  }
  .product-img{
      width: 100px;
  }
  .product-content{
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 13px;
      color: #333;
      margin-left: 6px;
  }
  .rate-star{
      display: flex;
      background: #fff;
      padding: 20px 12px 16px;
      font-size: 14px;
      color: #333;
      align-items: center;
      border-bottom: 1px solid #ededed;
  }
  .rate-star-title{
      margin-right: 10px;
  }
  .rate-star-result{
      margin-left: 10px;
      color: #999;
      font-size: 13px;
  }
  textarea{
      width: 100vw;
      background: #fff;
      height: 100px;
      padding: 12px;
      font-size: 13px;
      color: #888;
  }
  .photo{
      width: 24px;
      margin-bottom: 10px;
  }
  .take-photo{
      font-size: 13px;
      color: #777;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      background: #fff;
      border-bottom: 1px solid #ededed;
      border-top: 1px solid #ededed;
  }
  .rate-bottom{
      background: #fff;
      padding: 10px 12px;
      display: flex;
      justify-content: flex-end;
  }
  .rate-btn{
      border: 1px solid #555;
      color: #555;
      font-size: 14px;
      padding: 2px 26px;
      border-radius: 4px;
  }
</style>