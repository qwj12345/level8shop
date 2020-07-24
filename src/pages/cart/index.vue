<template>
  <div>
      <div class="cart-header flex-center">
          <van-radio-group @change="checkAll" :value='all'><van-radio icon-class='icon' checked-color='#000' name="1" >全选</van-radio></van-radio-group>
          
          <span @click="editProduct">{{editText}}</span>
      </div>
      <!--  -->
      <div class="cart-content">
        <van-checkbox-group :value="check" @change="changeRadio">
            
            <!-- 组合 -->
            <div style="margin-bottom:10px;background:#fff" v-for="(item,key) in composeList" :key="key">
                <van-checkbox custom-class="address-item-group"  checked-color='#000'  :name="item.skusGroupSaleId">
                    <div style="display: flex;justify-content: space-between;width: calc(100vw - 65px);">
                        <div class="group-header-left">
                            <div style="font-size:14px;color:#000;margin-right:14px">{{item.shopGroupSale.ruleNote}}</div>
                            <div v-if="!isEdit" style="font-size:13px;color:#000;margin-right:8px">￥ {{item.shopGroupSale.price}}</div>
                            <div v-if="!isEdit" style="font-size:12px;text-decoration: line-through;margin-top:1px;color:#ababab">￥ {{item.shopGroupSale.originalPrice}}</div>
                            <div v-if="isEdit" class="edit-num" style="width:100px;margin-bottom:0">
                                <div @click.stop="reduce(item,2)" style="border-right:1px solid #ededed">-</div>
                                <input @click.stop="" @input='changeInput($event,item)' type="number" v-model="item.quantity"/>
                                <div @click.stop="add(item,2)" style="border-left:1px solid #ededed">+</div>
                            </div>
         
                        </div>
                        <div v-if="!isEdit" class="group-header-right">
                            x {{item.quantity}}
                        </div>
                        <div v-if="isEdit" class="group-edit-btn" @click.stop="removeP(item.skusGroupSaleId)">删除</div>
                    </div>

                </van-checkbox>
                    
                <div class="group-product-item" v-for="(val,index) in item.shopGroupSale.skus" :key="index" @click.stop="goPage(val.productId)">
                    <div class="product-img">
                        <img :src='val.imgUrl' mode='widthFix' />
                    </div>
                    <div class="product-detail" >
                        <div class="name-color">
                        <span style="width:90%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{val.productInfo.name}}</span>
                        <div style="display:flex;margin-top:2px;color:#999;font-size:12px;"><div v-for="(value,id) in val.sizeColor" :key="id">{{value}}<text decode='nbsp' v-if="id!==val.sizeColor.length-1">;&nbsp;</text></div></div>
                        <span style="margin-top:2px;color:#999;font-size:12px;" v-for="(value,id) in val.otherSku" :key="id">{{value}}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px">
                            <div><span style="font-size:10px;">￥</span> {{val.price}}</div>
                            <span>x 1</span>
                        </div>
                    </div>     
                </div>
            </div>
            <!-- 赠品 -->
            <div style="margin-bottom:10px;background:#fff" v-for="(presentlist,key) in presentProducts" :key="key">
                <van-checkbox custom-class="address-item border-bottom"  checked-color='#000' v-for="(item,index) in presentlist.arr" :key="index" :name="item.id">
                    <div class="product-item" @click.stop="goPage(item.sku.productId)">

                        <div class="product-img">
                            <img :src='item.imgUrl' mode='widthFix' />
                        </div>
                        <div class="product-detail"  v-if="!isEdit">
                            <div class="name-color">
                            <span style="width:90%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap" v-if="item.sku">{{item.sku.productInfo.name}}</span>
                            <div style="display:flex;margin-top:2px;color:#999;font-size:12px;"><div v-for="(value,id) in item.sizeColor" :key="id">{{value}}<text decode='nbsp' v-if="id!==item.sizeColor.length-1">;&nbsp;</text></div></div>
                            <span style="margin-top:2px;color:#999;font-size:12px;" v-for="(value,id) in item.otherSku" :key="id">{{value}}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px">
                                <div  v-if="item.sku"><span style="font-size:10px;">￥</span> {{item.sku.price}}</div>
                                <span>x {{item.quantity}}</span>
                            </div>
                        </div>     
                        <div class="item-edit" v-if="isEdit">
                            <div class="edit-input">
                                <div class="edit-num">
                                    <div @click.stop="reduce(item,3)" style="border-right:1px solid #ededed">-</div>
                                    <input @click.stop="" @input='changeInput($event,item)' type="number" v-model="item.quantity"/>
                                    <div @click.stop="add(item,3)" style="border-left:1px solid #ededed">+</div>
                                </div>
                            </div>
                            <div class="edit-btn" @click.stop="removeP(item.id,1)">删除</div>
                        </div>
                    </div>
                </van-checkbox>
                <div class="present-block flex-center" @click="showPresentM(presentlist)"> 
                    <div class="cart-present">
                        <div style="padding:1px 6px;border:1px solid red;border-radius:4px;color:red;margin-right:10px;font-size:12px">满赠</div>
                        <div style="font-size:12px">可获得<span style="color:red;font-size:12px">{{presentlist.number}}</span>件赠品</div>
                    </div>
                    <div style="display:flex;align-items:center;color:#999"><span style="font-size:11px;margin-right:6px;margin-bottom:2px">查看详情</span><div style="width:7px"><img src="../../../static/images/face-right-sm.png" mode="widthFix"/></div></div>
                </div>
            </div>
            <!--  -->
            <van-checkbox custom-class="address-item border-bottom"  checked-color='#000' v-for="(item,key) in lists" :key="key" :name="item.skuId" :disabled="item.noGoPurchase">
                <div class="product-item" @click.stop="goPage(item.productId)">
                    <div class="product-img">
                        <img :src='item.imgUrl' mode='widthFix' />
                    </div>
                    <div class="product-detail"  v-if="!isEdit">
                        <div class="name-color">
                        <span style="width:90%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{item.sku.productInfo.name}}</span>
                        <div style="display:flex;margin-top:2px;color:#999;font-size:12px;"><div v-for="(value,id) in item.sizeColor" :key="id">{{value}}<text decode='nbsp' v-if="id!==item.sizeColor.length-1">;&nbsp;</text></div></div>
                        <span style="margin-top:2px;color:#999;font-size:12px;" v-for="(value,id) in item.otherSku" :key="id">{{value}}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px">
                            <div><span style="font-size:10px;">￥</span> {{item.sku.price}}</div>
                            <span>x {{item.quantity}}</span>
                            </div>
                    </div>     
                    <div class="item-edit" v-if="isEdit">
                        <div class="edit-input">
                            <div class="edit-num">
                                <div @click.stop="reduce(item,1)" style="border-right:1px solid #ededed">-</div>
                                <input @click.stop="" @input='changeInput($event,item)' type="number" v-model="item.quantity"/>
                                <div @click.stop="add(item,1)" style="border-left:1px solid #ededed">+</div>
                            </div>
                            <!-- <div class="edit-type" @click.stop="showPickerM($event,item)">
                                <input :value="item.type" disabled/>
                                <div style="width:16px;transform:rotate(90deg);padding:0 4px;border-ledt:1px solid #ededed;position:absolute;right:0">
                                    <img src="../../../static/images/face-right.png" mode='widthFix'/>
                                </div>
                            </div> -->
                        </div>
                        <div class="edit-btn" @click.stop="removeP(item.skuId,1)">删除</div>
                    </div>
                </div>
            </van-checkbox>
            
        </van-checkbox-group>
      </div>

      <!-- -->
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
      <!-- 赠品  -->
    <van-popup :show="showPresent" position="bottom" close-on-click-overlay="true" @close="showPresentM">
        <div class="present-model">
            <div class="present-header">
                <div style="width:20px"></div>
                <div >赠品详情</div>
                <div style="width:20px" @click="showPresentM"><img src="../../../static/images/close.png" mode="widthFix"/></div>
            </div>
            
                <div class="present-info">
                    <div style="border:1px solid red;border-radius:4px;color:red;margin-right:10px;font-size:13px;height:18px;line-height:18px;width:46px;text-align:center">满赠</div>
                    <div style="line-height:20px">{{presents.title}}</div>
                </div>
                <div style="margin-top:12px;font-size:12px" v-if="presents.zp" >满赠 可获得{{presents.number}}件商品</div>
                <div class="present-product">
                    <div v-for="(val,index) in presents.zp" :key="index">
                        <div class="present-product-img">
                            <img :src="val.img" mode="widthFix"/>
                            <!-- <div class="nosale-model">已赠完</div> -->
                        </div>
                        <div style="padding:6px 0 4px;">{{val.name}}</div>
                        <div>x{{val.quantity}}</div>
                    </div>
                </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common';
var mta= require('@/utils/mta_analysis.js');
export default {
    data() {
        return {
            showPresent:false,
            isEdit:false,
            editText:'编辑',
            showPicker:false,
            all:'',
            num:1,
            check:[],
            type:'黑色',
            types:['黑色','白色'],
            lists:[],
            presentProducts:[],
            pickerItem:[],
            allPrice:0,
            editIds:[],
            composeList:[],
            skus:'',
            presents:[],
            serverTime:0,
            overTime2:null
        }
    },
    methods: {
        changeInput(e,item){
            let value = e.mp.detail.value;
            if(value<1){
                item.quantity = 1;
            }
        },
        //
        editProduct(){
            this.isEdit === false ? this.isEdit = true : this.isEdit = false;
            this.isEdit === false ? this.editText = '编辑' : this.editText = '完成';
            if(!this.isEdit){
                this.editIds.forEach(item => {
                    let data = {}; 
                    if(item.type===1||item.type===3){
                        data = {
                            skuId:item.id,
                            token:wx.getStorageSync('token'),
                            quantity:item.num,
                            isIncrement:false
                        }
                    }else{
                        data = {
                            skusGroupSaleId:item.id,
                            token:wx.getStorageSync('token'),
                            quantity:item.num,
                            isIncrement:false
                        }
                    }

                    wxRequest('/mp/shop/api/shopcart/update',{data}).then(res => {
                        if(res.data.code === 0){
                            wx.showToast({
                                title: '修改成功',
                                icon: 'success',
                                duration: 2000
                            })
                            // this.computePrice()
                            this.getList();
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
        showPresentM(item){
            if(this.showPresent === false ){
                this.presents = item;
            }
            this.showPresent === false ?this.showPresent=true:this.showPresent=false;

        },
        goPage(id){
            wx.navigateTo({
              url:'/pages/productDetail/main?id='+id
            })
        },
        add(item,type){
            console.log(item)
            item.quantity++;
            if(type===1)//普通单品
                this.editIds.push({id:item.skuId,num:item.quantity,type});
            else if(type===3)//赠品没有skuId
                this.editIds.push({id:item.id,num:item.quantity,type});
            else//组合购
                this.editIds.push({id:item.skusGroupSaleId,num:item.quantity,type});
          
        },
        reduce(item,type){
            if(item.quantity>1){
                item.quantity--;
                if(type===1)
                    this.editIds.push({id:item.skuId,num:item.quantity,type});
                else if(type===3)
                    this.editIds.push({id:item.id,num:item.quantity,type});
                else
                    this.editIds.push({id:item.skusGroupSaleId,num:item.quantity,type});
            }
        },
        checkAll(e){    
            this.all === '1' ? this.all = '' : this.all = '1';
            this.allPrice = 0;
            if(this.all === '1'){
                this.lists.forEach((item,key) => {
                    if(!item.noGoPurchase){
                        this.check.push(item.skuId.toString());
                        this.allPrice += item.sku.price * item.quantity;
                    }
                    
                })
                this.composeList.forEach((item,key) => {
                    this.check.push(item.skusGroupSaleId.toString());

                    this.allPrice += item.shopGroupSale.price * item.quantity;
                })
                this.presentProducts.forEach((item,key) => {
                    item.arr.forEach(val => {
                        this.check.push(val.id.toString());
                        this.allPrice += val.sku.price * val.quantity;
                    })

                })
                this.allPrice = this.allPrice.toFixed(2)
                // this.check = ['1','2'];
            }else{
                this.check = [];
            }
         
        },
        changeRadio(e){
            this.check = e.mp.detail;
            this.computePrice();
        },
        
        computePrice(){//计算价格
            this.allPrice = 0;
            this.lists.forEach(item => {
                if(this.check.indexOf(item.skuId.toString()) !== -1)
                    this.allPrice += item.sku.price * item.quantity;
                
            })
            this.composeList.forEach(item => {
                if(this.check.indexOf(item.skusGroupSaleId.toString()) !== -1)
                    this.allPrice += item.shopGroupSale.price * item.quantity;
            })
            let presentLength = 0;//计算右赠品的商品的数量，为了判断是否有全选
            this.presentProducts.forEach(item => { 
                presentLength +=item.arr.length;
                item.arr.forEach(val => {
                    if(this.check.indexOf(val.id.toString()) !== -1)
                        this.allPrice += val.sku.price * val.quantity;
                })
                // if(this.check.indexOf(item.skusGroupSaleId.toString()) !== -1)
                //     this.allPrice += item.shopGroupSale.price * item.quantity;
            })
            this.allPrice = this.allPrice.toFixed(2)
            if(this.check.length !== (this.lists.length+this.composeList.length+presentLength)){
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
        removeP(id,type){
            let data = {};
            if(type===1){
                data = {
                    skuId:id,
                    token:wx.getStorageSync('token'),
                    quantity:0,
                    isIncrement:false
                }
            }else{
                data = {
                    skusGroupSaleId:id,
                    token:wx.getStorageSync('token'),
                    quantity:0,
                    isIncrement:false
                }
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
                let groupJSON  = [];
                this.lists.forEach(item => {
                    if(this.check.indexOf(item.skuId.toString()) !== -1){
                        product.push({skuId:item.id,img:item.imgUrl,name:item.sku.productInfo.name,integralNum:item.sku.integralNum,price:item.sku.price,param:item.sku.skuName.split(','),number:item.quantity})
                        skuJson.push({'skuId':item.skuId,'quantity':item.quantity,'isCart':true})
                    }
                })

                this.presentProducts.forEach(item => {
                    item.arr.forEach(val => {
                        if(this.check.indexOf(val.id.toString()) !== -1){
                            product.push({skuId:val.id,img:val.imgUrl,name:val.sku.productInfo.name,integralNum:val.sku.integralNum,price:val.sku.price,param:val.sku.skuName.split(','),number:val.quantity})
                            skuJson.push({'skuId':val.id,'quantity':val.quantity,'isCart':true})
                        }
                    })
                })
                 this.composeList.forEach(item => {
                    if(this.check.indexOf(item.skusGroupSaleId.toString()) !== -1){
                        item.shopGroupSale.skus.forEach(val => {
                            product.push({skuId:val.id,img:val.imgUrl,name:val.productInfo.name,integralNum:val.integralNum,price:val.price,param:val.skuName,number:1})
                        })
                        groupJSON.push({'skusGroupSaleId':item.skusGroupSaleId,'quantity':item.quantity,'isCart':true})
                    }
                })
                
                wx.navigateTo({
                    url:'/pages/getOrder/main?sku='+JSON.stringify(skuJson)+'&groupJSON='+JSON.stringify(groupJSON)+'&products='+JSON.stringify(product)
                })
            }
        },
        getList(){
            let data = {
                token:wx.getStorageSync('token')
            }
            wxRequest('/mp/shop/api/shopcart/query',{data}).then(res => {
                let serverTime = 0;
                if(res.data.serverTime!==undefined)
                    serverTime = new Date(res.data.serverTime.replace(/-/g, "/")).getTime();
                // this.overTime2 = setInterval(()=>{
                //     this.serverTime = this.serverTime+1000;
                // },1000)
               this.skus = '';
               let skusQuantity = '';
               let productSkus = [];
                res.data.data.forEach(item => {
                    if(item.sku !== undefined){
                        if(item.sku.discountType==="XSQG"){
                             if(serverTime < new Date(item.sku.mpShopFlashSale.startTime.replace(/-/g, "/")).getTime()){//还没到开始时间
                                 item.noGoPurchase = true;
                             }
                        }
                        productSkus.push({id:item.sku.id,quantity:item.quantity})
                        this.skus += item.sku.id+',';//通过这个查询是否有赠品
                        skusQuantity += item.quantity+',';//赠品sku数量 
                        item.imgUrl = item.sku.skuPicUrls.split(',')[0];
                        item.skuName = item.sku.skuName.split(',');
                        item.sizeColor = [];
                        item.otherSku = [];

                        item.skuName.forEach(value => {
                            if(value.split(':')[0] === '尺寸' || value.split(':')[0] === '颜色'){
                                item.sizeColor.push(value);
                            }else{
                                item.otherSku.push(value)
                            }
                        })

                        if(item.sku.price === 0){
                            item.sku.price = item.sku.originalPrice;
                        }
                        
                    }
                }) 

                this.composeList = res.data.data.filter(item=>{
                    return item.shopGroupSale !== undefined;
                });
                
                this.composeList.forEach(val => {
                    val.shopGroupSale.skus.forEach(item => {
                        if(item.productInfo !== undefined){
                            item.imgUrl = item.skuPicUrls.split(',')[0];
                            item.skuName = item.skuName.split(',');
                            item.sizeColor = [];
                            item.otherSku = [];
                            item.skuName.forEach(value => {
                                if(value.split(':')[0] === '尺寸' || value.split(':')[0] === '颜色'){
                                    item.sizeColor.push(value);
                                }else{
                                    item.otherSku.push(value);
                                }
                            })
                            if(item.price === 0){
                                item.price = item.originalPrice;
                            }
                        }
                    })
                })
                // 查询赠品 
                if(this.skus!==''){ 
                    wxRequest('/mp/shop/api/giveawaySale/findGiveawaySaleByProductSkuIds',{data:{productSkuIds:this.skus,quantitys:skusQuantity}}).then(res2 => {
                        // 防止商品删除了但是购物车中还有商品,并且不含赠品  
                        this.lists = res.data.data.filter(item=>{ 
                            return item.sku !== undefined && res2.data.data.inGiveawayProductSkuIds.indexOf(item.sku.id)===-1;
                        });
           
                        // 防止商品删除了但是购物车中还有商品,并且含赠品 
                        this.presentProducts = [];
                        res2.data.data.giveawayList.forEach(item => {
                            let obj = {};
                            obj.arr = [];
                            obj.number = 0;
                            obj.title = item.ruleNote;
                            item.zpList.forEach(val => {
                                val.img = val.sku.skuPicUrls.split(',')[0];
                                val.name = val.sku.productInfo.name;
                                obj.number += val.quantity;
                            })
                            item.zpList.number = obj.number;
                            obj.zp = item.zpList;
                            item.tjList.forEach(sku => {
                                sku.imgUrl = sku.sku.skuPicUrls.split(',')[0];
                                sku.skuName = sku.sku.skuName.split(',');
                                sku.id = sku.sku.id; 
                                // 赠品所需sku数量
                                productSkus.forEach(filterSku => {
                                    if(filterSku.id === sku.sku.id){
                                        sku.quantity = filterSku.quantity;
                                    }
                                })
                                sku.sizeColor = [];
                                sku.otherSku = [];
                                sku.skuName.forEach(value => {
                                    if(value.split(':')[0] === '尺寸' || value.split(':')[0] === '颜色'){
                                        sku.sizeColor.push(value);
                                    }else{
                                        sku.otherSku.push(value);
                                    }
                                })
                                if(sku.sku.price === 0){
                                    sku.sku.price = sku.sku.originalPrice;
                                }
                                
                                obj.arr.push(sku)
                            })
                            this.presentProducts.push(obj);
                            
                        })

                    })
                }
            })
        }
    },
    onHide(){
        // clearInterval(this.overTime2)
    },
    onLoad() {
        mta.Page.init({
          "appID":"500717591",
          "autoReport": true,
          "statParam": true,
          "ignoreParams": [],
          "autoReport": true, //开启自动上报
          "statParam": true, //每个页面均加入参数上报
      });
      this.isEdit = false;
      this.editText = '编辑';
      this.allPrice = 0;
      this.all = '';
      this.check = [];
      this.getList();
    },
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
    .cart-present{
        display: flex;
        align-items: center;
    }
    .present-block{
        padding: 10px 12px;
    }
  .cart-header{
      padding: 10px 12px;
      background: #fff;
      font-size: 14px;
      
  }
      .present-model{
        padding: 16px 12px;
    }
    .present-header{
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        color: #000;
        align-items: center;
        letter-spacing: 1px;
    }
    .present-info{
        display: flex;
        color: #999;
        font-size: 12px;
        padding: 12px 20px 0 0;

    }
    .present-product{
        display: flex;
        align-items: center;
    }
    .present-product>div{
        width: calc(100% / 3);
        padding: 20px 6px;

    }
     .present-product>div>div{
         text-align: center;
         font-size: 11px;
         color: #666;
     }
     .present-product-img{
         position: relative;
     }
  .cart-content{
      background: rgb(247, 248, 248);
      
      margin-top: 10px;
  }
  .group-header-left{
      display: flex;
      align-items: center;
  }
    .group-product-item{
      display: flex;
      align-items: center;
      width: calc(100vw - 24px);
      margin: 0 auto;
      padding: 0px 0px 0 28px;
      height: 120px;
      background: #fff;
      box-sizing: border-box;
      border-top:1px solid #ededed;
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
      background: #fff;
  }
.address-item-group{
      padding: 10px 14px;
      position: relative;
      background: #fff;
  }
  .group-products{
      padding: 10px 12px;
      border-top: 1px solid #ededed;
  }
  .group-header-right{
      font-size: 13px;
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
    .group-edit-btn{
      width: 60px;
      height: 100%;
      background: #333;
      color: #fff;
      font-size: 14px;
      text-align: center;
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
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
  .group-input{
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
  .van-checkbox__icon-wrap{
      display: flex !important;
      align-items: center !important;
  }
</style>