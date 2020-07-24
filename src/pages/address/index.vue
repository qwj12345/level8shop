<template>
  <div>
        <van-radio-group :value="ids" @change="changeRadio">
            <van-radio custom-class="address-item" icon-class='icon' checked-color='#000' v-for="(item,key) in addresses" :key="key" :name="item.id" @click="backPage(item)">
                <div class="flex-center address-item-content">
                    <div style="width:calc(100% - 60px);border-right:1px solid #333;padding-right:16px;box-sizing:border-box">
                        <div class='address-user'>
                            <span style="margin-right:20px">{{item.userName}}</span>
                            <span>{{item.userPhone}}</span>
                        </div>
                        <div class="address-detail">
                            <div class="address-icon" v-if="item.isDefault===1">默认</div>
                            <div style=" white-space: nowrap; overflow: hidden;text-overflow:ellipsis;width:calc(100% - 50px)">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</div>
                        </div>
                    </div>
                    <div class="address-item-control">
                        <div @click.stop="goEdit(item)">编辑</div>
                        <div @click.stop="delAddress(item.id)">删除</div>
                    </div>
                </div>
            </van-radio>

        </van-radio-group>
          <!--  -->
          <div style="font-size:26px;text-align:center;margin-top:50px" v-show="addresses.length===0">
                收货地址为空
            </div>
        <!--  -->
        <div class="address-btns">
            <div class="address-btn add-btn" @click="addItem">+ 新建收货地址</div>
            <div class="address-btn report-btn" @click="chooseAddress">一键导入微信地址</div>
        </div>

  </div>
</template>

<script>
import {wxRequest} from '@/components/common'
export default {
    data() {
        return {
            ids:'',
            addresses:[],
            type:0
        }
    },
    methods: {
        backPage(item){
            if(this.type === 1){
                var pages = getCurrentPages();   //当前页面
                var prevPage = pages[pages.length - 2];   //上一页面
                prevPage.address = item,
                console.log(prevPage)
                
                wx.navigateBack({
                    //返回
                    delta: 1
                })
            }

        },
        changeRadio(e){
            this.ids = e.mp.detail;
            console.log(e.mp.detail)
        },
        goEdit(item){
               wx.navigateTo({
                    url:'/pages/newAddress/main?address='+JSON.stringify(item)
                }) 

        },
        addItem(){
            wx.navigateTo({
                    url:'/pages/newAddress/main'
                }) 
        },
        delAddress(id){
            let that = this;
             wx.showModal({
                title: '删除',
                content: '是否确认删除？',
                success(res){
                    if(res.cancel){
                        
                    }else if(res.confirm){
                        that.addresses.splice(id,1)
                        let data = {
                            token:wx.getStorageSync('token'),
                            locationId:id
                        }

                        wxRequest('/mp/shop/api/user/location/del',{data}).then(res => {
                            console.log(res)
                            if(res.data.code === 0){
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.getList();
                            }else{
                                wx.showToast({
                                    title: '删除失败',
                                    icon:'none',
                                    duration: 2000
                                })
                            }

                        })
                    }
                }
            })

        },
        chooseAddress(){
            
            wx.chooseAddress({
                success (res) {
                    console.log(res.countyName)

                    let data = {
                        token:wx.getStorageSync('token'),
                        districtName:res.countyName,
                        address:res.detailInfo,
                        userPhone:res.telNumber,
                        userName:res.userName,
                        isDefault:0
                    }
                    console.log(data)
                    wxRequest('/mp/shop/api/user/location/add',{data}).then(res => {
                        console.log(963,res)
                        if(res.data.code === 0){
                            wx.showToast({
                                title: '添加成功',
                                duration: 2000
                            })
                            // this.getList();
                        }else{
                            wx.showToast({
                                title: '添加失败',
                                icon:'none',
                                duration: 2000
                            })
                        }
                    })
                }
            })
        },
        getList(){
            let data = {
                token:wx.getStorageSync('token')
            }

            wxRequest('/mp/shop/api/user/location/query',{data}).then(res => {
                console.log(888,res.data.data.length)
                if(res.data.data.length !== 0){
                    let index = 0;//获取默认地址是第几个好把默认地址放在第一个
                    this.addresses = res.data.data;
                    this.addresses.forEach((item,key) => {
                        if(item.isDefault === 1){
                            this.ids = item.id.toString();
                            console.log('id',this.ids)
                            index = key;
                            return;
                        }
                    })
                    let address = this.addresses.splice(index,1);
                    this.addresses.splice(0,0,address[0])
                }else{
                    this.addresses=[];
                }
                console.log(999,this.addresses)
                // this.addresses.unshift(address[0])

            })
        }
    },
    onShow() {
        this.getList()
    },
    onLoad(query){
        this.type = 0;
        if(query.type==='1'){
            this.type = 1;
        }
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .address-item{
      background: #fff;
      padding: 20px 12px;
      margin-top: 10px;
  }
  .address-user{
      font-size: 14px;
  }
  .address-detail{
      margin-top: 4px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #333;
  }
  .address-icon{
      background: #FFD637;
      padding: 0px 6px;
      margin-right: 10px;
  }
  .address-item-content{
      width: calc(100vw - 60px);
  }
  .address-item-control{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 14px;
      color: #333;
      height: 50px;
  }
  .address-btns{
      margin-top: 100px;
  }
  .address-btn{
      width: 80%;
      margin: 10px auto;
      border-radius: 26px;
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333;
  }
  .add-btn{
      background: #FFD637;
  }
  .report-btn{
      border: 1px solid #333;
      box-sizing: border-box;
  }
</style>