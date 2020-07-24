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
    <div style="padding:12px;border-top:1px solid #ededed;display: flex;justify-content: center;background: #fff;" v-if="evaluateImgs.length!==0">
        <div style="width:60px;height:60px;position:relative;padding:0 6px" v-for="(item,key) in evaluateImgs" :key="key">
            <img style="width:100%;height:100%" :src="item"/>
            <div class="close"  @click="removeImg(key)"><img src="../../../static/images/error.png"/></div>
        </div>
    </div>
    <div class="take-photo" @click="uploadImg">
        <div class="photo"><img src="../../../static/images/photo.png" mode='widthFix'></div>
        <div>添加图片 / 视频</div>
    </div>
    <div class="rate-bottom">
        <div class="rate-btn" @click="submit">提交</div>
    </div>
    <!-- 弹窗 -->
    <div class="rate-modal" v-if="showModal">
        <div class="modal-content">
            <div class="icon">
                <img src="../../../static/images/fly_icon.png" mode='widthFix'/>
            </div>
            <div style="font-size:14px;margin-top:20px;color：#333">提交成功，获得10个出发币</div>
        </div>
    </div>
  </div>
</template>

<script>
import global from '@/components/global'
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            ptoductList:[],
            orderId:'',
            evaluateScore:5,
            evaluateContent:'',
            evaluateImgs:[],
            showModal:false
        }
    },
    methods: {
        submit(){
            let data = {
                token:wx.getStorageSync('token'),
                orderId:this.orderId,
                evaluateScore:this.evaluateScore,
                evaluateContent:this.evaluateContent,
                evaluateImgs:this.evaluateImgs.join(',')
            }

            wxRequest('mp/shop/api/user/order/evaluate',{data}).then(res => {
                console.log(res)
                if(res.data.code === 0){
                    wx.showToast({
                        title:'评价成功',
                        duration:2000
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url:'/pages/orders/main?index=0'
                        })
                    },1000)
   
                }else{
                    wx.showToast({
                        title:res.data.msg,
                        icon:'none',
                        duration:2000
                    })
                }
            })
        },
        changeRate(e){
            this.evaluateScore = e.mp.detail / 5 * 100;
        },
        uploadImg(){
            let that = this;

            if(this.evaluateImgs.length < 5){
                wx.chooseImage({
                    count: 5, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        res.tempFilePaths.forEach(item => {
                            wx.uploadFile({
                                url: global.ip1+'file/mall/upload', 
                                filePath: item, 
                                name: 'file',
                                formData:{
                                    'token':wx.getStorageSync('token'),
                                    'platform':'mini'
                                },
                                header: {
                                'Content-Type': 'multipart/form-data' // 默认值
                                },
                                success (res1){
                                    console.log(JSON.parse(res1.data).url)
                                    that.evaluateImgs.push(JSON.parse(res1.data).url);
                                },
                                fail(err){
                                    console.log(err)
                                }
                            })
                        })

                    }
                })
            }else{
                wx.showToast({
                    title:'超过了上传限制',
                    icon:'none'
                })
            }
            
        },
        removeImg(index){
            this.evaluateImgs.splice(index,1)
        }
    },
    onLoad(query){
        this.evaluateScore = 5;
        this.evaluateContent = '';
        this.evaluateImgs = [];
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
  .close{
      position: absolute;
      top: -5px;
      right: -5px;
      width: 14px;
      height: 14px;
  }
  .rate-modal{
      background: rgba(000, 000, 000, 0.3);
      position: fixed;
      top: 0px;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100vh;
      width: 100vw;
  }
  .modal-content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: rgb(255,215,54);
      width: 80%;
      padding: 50px 0;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  }
  .modal-content .icon{
      width: 40%;
      background: #fff;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10%; 
    box-sizing: border-box;

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