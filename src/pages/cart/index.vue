<template>
  <div>
      <div class="cart-header flex-center">
          <van-radio-group @change="checkAll" :value='all'><van-radio icon-class='icon' checked-color='#000' name="1" >全选</van-radio></van-radio-group>
          
          <span @click="editProduct">{{editText}}</span>
      </div>
      <!--  -->
      <div class="cart-content">
        <van-checkbox-group :value="check" @change="changeRadio">
            <van-checkbox custom-class="address-item border-bottom"  checked-color='#000' v-for="(item,key) in lists" :key="key" :name="item.skuId">
                <div class="product-item">
                    <div class="product-img">
                        <img :src='item.imgUrl' mode='widthFix' />
                    </div>
                    <div class="product-detail"  v-if="!isEdit">
                        <div class="name-color">
                        <span style="width:90%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{item.sku.productInfo.name}}</span>
                        <span style="margin-top:2px;color:#999;font-size:12px;" v-for="(value,id) in item.skuName" :key="id">{{value}}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px">
                            <div><span style="font-size:10px;">￥</span> {{item.sku.price}}</div>
                            <span>x {{item.quantity}}</span>
                            </div>
                    </div>     
                    <div class="item-edit" v-if="isEdit">
                        <div class="edit-input">
                            <div class="edit-num">
                                <div @click.stop="reduce(item)" style="border-right:1px solid #ededed">-</div>
                                <input :value="item.quantity"/>
                                <div @click.stop="add(item)" style="border-left:1px solid #ededed">+</div>
                            </div>
                            <!-- <div class="edit-type" @click.stop="showPickerM($event,item)">
                                <input :value="item.type" disabled/>
                                <div style="width:16px;transform:rotate(90deg);padding:0 4px;border-ledt:1px solid #ededed;position:absolute;right:0">
                                    <img src="../../../static/images/face-right.png" mode='widthFix'/>
                                </div>
                            </div> -->
                            
                        </div>
                        <div class="edit-btn" @click.stop="removeP(item)">删除</div>
                    </div>
                </div>

            </van-checkbox>
        </van-checkbox-group>
      </div>
      <!--  -->
      <van-picker show-toolbar v-if="showPicker" class="pciker" :columns="types" @confirm="chooseType" @cancel='cancelType' />
      <!--  -->
      <div style="height:60px"></div>
      <div class="fix-bottom">
              <van-radio-group @change="checkAll" :value='all'><van-radio icon-class='icon' checked-color='#000' name="1" >全选</van-radio></van-radio-group>
              <div class="fix-bottom-right">
                  <div class="fix-price">
                      <div style="font-szie:13px;">合计:￥{{allPrice}}</div>
                      <div style="font-size:10px;">不含邮费</div>
                  </div>
                  <div class="fix-btn" :class="{'backEd':check.length===0}" @click="goBanlance">去结算<span v-if="check.length>0">({{check.length}})</span></div>
              </div>
      </div>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            isEdit:false,
            editText:'编辑',
            showPicker:false,
            all:'',
            num:1,
            check:[],
            type:'黑色',
            types:['黑色','白色'],
            lists:[],
            pickerItem:[],
            allPrice:0,
            editIds:[]
        }
    },
    methods: {
        editProduct(){
            this.isEdit === false ? this.isEdit = true : this.isEdit = false;
            this.isEdit === false ? this.editText = '编辑' : this.editText = '完成';
            if(!this.isEdit){
                this.editIds.forEach(item => {
                    let data = {
                        skuId:item.id,
                        token:wx.getStorageSync('token'),
                        quantity:item.num,
                        isIncrement:false
                    }
                    
                    wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
                        console.log(888,res)
                        if(res.statusCode === 200){
                            wx.showToast({
                                title: '修改成功',
                                icon: 'success',
                                duration: 2000
                            })
                            this.allPrice = 0;
                            this.lists.forEach(item => {
                                this.allPrice += item.sku.price * item.quantity;
                            })
                        }else{
                            wx.showToast({
                                title: '修改失败',
                                icon:'none',
                                duration: 2000
                            })
                        }
                    })
                })

            }
        },
        add(item){
            item.quantity++;
            this.editIds.push({id:item.skuId,num:item.quantity});
        },
        reduce(item){
            if(item.quantity>1){
                item.quantity--;
                this.editIds.push({id:item.skuId,num:item.quantity});

            }
        },
        checkAll(e){    
            this.all === '1' ? this.all = '' : this.all = '1';

            if(this.all === '1'){
                this.lists.forEach((item,key) => {
                    this.check.push(item.skuId.toString())
                })
                // this.check = ['1','2'];
            }else{
                this.check = [];
            }
            console.log(this.check)
        },
        changeRadio(e){
            this.check = e.mp.detail;
            if(this.check.length !== this.lists.length){
                this.all = '';
            }else{
                this.all = '1';
            }
            
        },
        showPickerM(e,item){
            this.showPicker === false ? this.showPicker = true : this.showPicker = false;
            this.pickerItem = item;
        },
        chooseType(e){

            this.pickerItem.type = e.mp.detail.value;
            this.showPicker = false;
        },
        cancelType(){
            this.showPicker = false;
        },
        removeP(item){
            let data = {
                skuId:item.skuId,
                token:wx.getStorageSync('token'),
                quantity:0,
                isIncrement:false
            }
            
            wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
                if(res.statusCode === 200){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.getList();
                }else{
                    wx.showToast({
                        title: '删除失败',
                        duration: 2000
                    })
                }
            })
        },
        goBanlance(){
            let product = [];
            if(this.check.length !== 0){
                let skuJson = [];
                this.lists.forEach(item => {
                    console.log(item)
                    if(this.check.indexOf(item.skuId.toString()) !== -1){
                        product.push({img:item.imgUrl,name:item.sku.productInfo.name,price:item.sku.price,param:item.sku.skuName.split(','),number:item.quantity})
                        skuJson.push({'skuId':item.skuId,'quantity':item.quantity})
                    }
                })
                console.log(skuJson)
                wx.navigateTo({
                    url:'/pages/getOrder/main?sku='+JSON.stringify(skuJson)+'&products='+JSON.stringify(product)
                })
            }
        },
        getList(){
            let data = {
                token:wx.getStorageSync('token')
            }
            this.allPrice = 0;
            wxRequest('/mp/shop/api/shopcart/query',{data}).then(res => {
                console.log(888,res)
                res.data.data.forEach(item => {
                    item.imgUrl = item.sku.skuPicUrls.split(',')[0];
                    item.skuName = item.sku.skuName.split(',');
                    this.allPrice += item.sku.price * item.quantity;
                })
                this.lists = res.data.data;
            })
        }
    },
    mounted() {
        this.getList();
    },
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .cart-header{
      padding: 10px 12px;
      background: #fff;
      font-size: 14px;
  }
  .cart-content{
      background: #fff;
      
      margin-top: 10px;
  }
    .product-item{
      display: flex;
      align-items: center;
      padding: 0px 12px 0 0;
      width: calc(100vw - 50px);
      height: 120px;

  }
  .product-img{
      width: 110px;
      height: 110px;
      overflow: hidden;
  }
  .product-detail{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 110px;
      padding: 10px;
      font-size: 14px;
      box-sizing: border-box;
      color: #333;
      width: calc(100% - 110px);
  }
  .name-color{
      display: flex;
      flex-direction: column;
      letter-spacing: 1px;
      width: 100%;
  }
  .border-bottom{
      border-bottom: 1px solid #ededed;
  }
  .address-item{
      padding: 0 12px;
      position: relative;
  }
  .item-edit{
      display: flex;
      height: 100%;
      width: calc(100% - 200px);
    margin-left: 7px;
  }
  .edit-btn{
      width: 80px;
      height: 100%;
      line-height: 110px;
      background: #333;
      color: #fff;
      font-size: 14px;
      text-align: center;
      position: absolute;
      right: 0;
  }
  .edit-input{
      display: flex;
      flex-direction: column;
      justify-content: center;
  }
  .edit-num{
      border: 1px solid #ededed;
      display: flex;
      box-sizing: border-box;
      margin-bottom: 10px;
  }
  .edit-num div{
      width: 40px;
      text-align: center;
  }
  .edit-num input{
      text-align: center;
      font-size: 12px;
      color: #666;
  }
  .edit-type{
      display: flex;
      border: 1px solid #ededed;
      align-items: center;
      position: relative;
  }
  .edit-type{
        text-align: center;
      font-size: 12px;
      color: #666;
  }
  .van-checkbox__icon-wrap{
      display: flex;
      align-items: center;
  }
  .pciker{
      position: fixed;
      bottom: 0px;
      left: 0;
      right: 0;
      z-index: 2;
  }
  .fix-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    padding: 0 0 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
}
.fix-btn{
    padding: 0px 20px;
    height: 50px;
    line-height: 50px;
    background: #FFD637;
    margin-left: 10px;
}
.fix-bottom-right{
    display: flex;
    align-items: center;
}
.backEd{
    background: #ddd;
    color: #fff;
}
</style>