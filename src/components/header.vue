<template>
    <!--  -->
    <div class="header flex-center">
      <div class="header-left" @click="openMenu"><img src="../../static/images/header_left.png" mode="widthFix"/></div>
      <div class="product-header flex-center" v-show="isProducts">
        <div style="font-size:14px;color:#333;display:flex;align-items:center" @click="openFilterM">
          {{filter}}
          <div style="width:10px;margin-left:6px"><img src="../../static/images/face-bottom.png" mode='widthFix'/></div>  
        </div>
        <div style="width:22px" @click="showSearch"><img src="../../static/images/search_black.png" mode='widthFix'/></div>
      </div>
      <div class="header-search" v-show="!isProducts">
        <div class="search"><img src="../../static/images/search.png" mode="widthFix"/></div>
        <input placeholder-class="phcolor" placeholder="高颜值登机箱" confirm-type='search' @confirm='searchProduct'/>
      </div>
      <div class="header-right" @click="goCart">
        <img src="../../static/images/header_cart.png" mode="widthFix"/>
        <div v-if="cartNum!==0">{{cartNum}}</div>
      </div>
      <!--  -->
      <div class="filter-modal" :class="{'filter-height':openFilter&&isProducts}">
        <div  class="filter-item flex-center" v-for="(item,key) in filters" :key="key" @click="selFiter(key)" :class="{'colorSel':item.sel}">{{item.name}}
          <img v-show="item.sel" style="width:18px" src="../../static/images/right_filter.png" mode='widthFix'/></div>
      </div>
      <!--  -->
      <div :class="{'height100':open}" class="header-modal">
        <div class="model-item" :key="key" @click="getType(0)">
          <div class="item-row" >
            <div>所有</div>
            <div style="width:16px" ><img src="../../static/images/face-right.png" mode='widthFix'/></div>
          </div>
        </div>
        <div class="model-item" v-for="(item,key) in items" :key="key" @click="openItem(item)">
          <div class="item-row" >
            <div>{{item.name}}</div>
            <div style="width:16px" v-show="item.open"><img src="../../static/images/del.png" mode='widthFix'/></div>
            <div style="width:16px" v-show="!item.open"><img src="../../static/images/face-right.png" mode='widthFix'/></div>
          </div>
          <div class="open" v-show="item.open">
            <div class="open-item" v-for="(value,key2) in item.childs" :key="key2" @click="getType(value)">
              <div class="open-item-circle"></div>
              {{value.name}}
            </div>

          </div>
        </div>
      </div>


    </div>
</template>

<script>
import {wxRequest} from '@/components/common'

export default {
    data(){
        return{
          showModal2:false,
          showModal:false,
          filter:'最新上新',
          openFilter:false,
          open:false,
          items:[],
          filters:[{name:'销量优先',sel:false},{name:'最新上新',sel:true},{name:'价格从低到高',sel:false},{name:'价格从高到低',sel:false}]
        }
    },
    props: ['isProducts','cartNum','hasAgree'],
    methods: {
      openItem(item){
        item.open === false ? item.open = true : item.open = false;
      },
      openMenu(){
        this.openFilter = false;
        this.open === false ? this.open = true : this.open = false;
  
        this.$emit('openMenu', [this.open,this.isProducts]);

      },
      openFilterM(){
        this.open = false;
        this.openFilter === false ? this.openFilter = true : this.openFilter = false;
        
      },
      selFiter(key){
        this.filters.forEach((item,index) => {
          item.sel = false;
          if(index === key){
            item.sel = true;
            this.filter = item.name;
          }
        })
        this.openFilter = false;
        this.$emit('getSortId', key);
      },
      getType(e){
        this.open = false;
        if(e===0){
          this.$emit('getType', 0);
        }else{
          this.$emit('getType', e.id);
        }
      },
      showSearch(){
        this.isProducts = false;
      },
      goCart(){
        if(this.hasAgree === true){   //先判断有没有授权
          if(getApp().globalData.phone === 1){ //再判断有没有绑定手机
            wx.navigateTo({
              url:'/pages/cart/main'
            })
          }else{
              this.showModal = true;
              this.$emit('getModal', true);
            }
            }else{
               this.$emit('getModal2', true);
          }
      },
      searchProduct(e){
        this.$emit('getGoods', e.mp.detail);
      }
    },
    mounted() {
      let that = this;
      if(getApp().globalData.login === 1){
          this.hasAgree = true;
        }
         // 因为如果只在APP.vue中请求一次的话会出现异步的问题，就是这个onLoad比APP.vue中的onLoad先执行完
        wx.getUserInfo({
          success: function(res) {
              getApp().globalData.login = 1
              that.hasAgree = true;
          },
          fail(err){
              that.hasAgree = false;
          }
        })
  
      wxRequest('/mp/shop/api/product/category',{data:{}}).then(res => {

        res.data.data.forEach(item => {
          item.open = false;
        })
        that.items = res.data.data;
      })
      
    },
}
</script>

<style>
@import url('./common.css');
.header{
  padding: 8px 20px;
  background: #fff;
  border-top: 1px solid #eee;
  height: 51px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}
.product-header{
  width: calc(100vw - 140px)
}
.header-left{
  width: 22px;
}

.header-right{
  width: 24px !important;
  position: relative;
}
.header-right>div{
  position: absolute;
  top: -2px;
  right: -4px;
  background: #f33c3c;
  width: 12px;
  height: 12px;
  font-size: 8px;
  color: #fff;
  text-align: center;
  line-height: 12px;
  border-radius: 50%;
}
.header-search{
  width: calc(100% - 70px);
  display: flex;
  align-items: center;
  background: rgb(245, 246, 248);
  height: 34px;
  border-radius: 26px;
  padding: 8px 16px;
  box-sizing: border-box;
}
.search{
  width: 16px;
  margin-top: 4px;
  margin-right: 10px;
}
.phcolor{
 color: #c5c6c8;
 font-size: 14px;
}
.header-modal{
  
  position: fixed;
  top: 51px;
  left: 0;
  width: 0;
  z-index: 20;
  box-sizing: border-box;
  /* transition: all 0.5s linear; */
  overflow: hidden;
}
.height100{
  width: 100vw;
  padding: 20px;
  height: calc(100% - 51px);
  background: rgb(247, 248, 248); 
  overflow-y: scroll;

}
.model-item{
  border-bottom: 1px solid #ededed;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 1px;
  color: #333;

}
.item-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.open{
  padding: 20px 0;
}
.open-item{
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  padding: 5px 0;
}
.open-item-circle{
  width: 4px;
  height: 4px;
  background: #999;
  border-radius: 50%;
  margin-right: 6px;
  
}
.noScroll{
  overflow: hidden;
}
.filter-modal{
  position: fixed;
  top: 51px;
  left: 0;
  background: #fff;
  width: 100vw;
  height: 0;
  transition: all .3s linear;
  padding: 0 10px;
  box-sizing: border-box;
  
  overflow: hidden;
  z-index: 6;
}
.filter-item{
  border-bottom: 1px solid #ededed;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 1px;
  color: #666;
}
.filter-height{
  border-top: 1px solid #ddd;
  height: 161px;
}
.colorSel{
  color: #FFD636;
}
</style>