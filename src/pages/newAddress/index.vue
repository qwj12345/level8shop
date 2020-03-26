<template>
  <div>
      <div class="input-item">
          <span>收件人 :</span>
          <input v-model="name"/>
      </div>
    <div class="input-item">
          <span>联系电话 :</span>
          <input v-model="tel" type="number"/>
      </div>
        <div class="input-item flex-center" @click="chooseArea">
            <div class="flex-center">
                <span>所在地区 :</span>
                <input v-model="area" disabled/>
            </div>

          <div class="face-right"> 
              <img src="../../../static/images/face-right.png" mode='widthFix'/>
          </div>
      </div>
      <div class="input-item" style="align-items:flex-start">
          <span>详细地址 :</span>
          <textarea v-model="address" placeholder="请填写不少于5个字"></textarea>
      </div>
      <div class="flex-center set-default">
          <div class="set-default-left">
              <div class="set-default-left-top">设置默认地址</div>
              <div class="set-default-left-bottom">提醒: 每次下单会默认推荐使用该地址</div>
          </div>
          <van-switch :checked="isSelect" @change="onChange" size='20px' active-color='#666666'/>
      </div>
              <!--  -->
        <div class="address-btns">
            <div class="address-btn add-btn" @click="addAddress">保存并使用</div>
            <div class="address-btn report-btn">一键导入微信地址</div>
        </div>
              <!--  -->
      <van-popup :show="showArea" position="bottom" close-on-click-overlay="true" @close="closeArea" >
        <van-area :area-list="areaList" @confirm="confirmArea" @cancel="closeArea" />
      </van-popup>
  </div>
</template>

<script>
import {wxRequest} from '@/components/common';
import areas from '../../../static/area.js';
export default {
    data() {
        return {
            showArea:false,
            isSelect:true,
            name:'',
            tel:'',
            address:'',
            areaList:areas,
            area:'',
            areaId:'',
            editType:0,
            id:0
        }
    },
    methods: {
        chooseArea(){
            console.log(123)
            this.showArea = true;
        },
        closeArea(){
            this.showArea = false;
        },
        confirmArea(e){
            console.log(e)
            this.areaId = e.mp.detail.values[2].code;
            this.area = e.mp.detail.values[0].name + ' ' + e.mp.detail.values[1].name + ' ' + e.mp.detail.values[2].name;
            this.showArea = false;

        },
        onChange(e){
            console.log(e)

            this.isSelect = e.mp.detail;
        },
        addAddress(){
            if(!(/^1[3456789]\d{9}$/.test(this.tel))){
                wx.showToast({
                    title: '手机号不正确',
                    icon:'none',
                    duration: 2000
                })
            }else{
                let isDefault = 0;
                if(this.isSelect){
                    isDefault = 1;
                }
                if(this.editType === 0){//新增地址时
                    let data = {
                        token:wx.getStorageSync('token'),
                        districtId:this.areaId,
                        address:this.address,
                        userPhone:this.tel,
                        userName:this.name,
                        isDefault
                    }
                    console.log(data)
                    wxRequest('/mp/shop/api/user/location/add',{data}).then(res => {
                        console.log(res)
                        if(res.data.code === 0){
                            wx.showToast({
                                title: '添加成功',
                                duration: 2000
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            },1000)

                        }else{
                            wx.showToast({
                                title: '添加失败',
                                icon:'none',
                                duration: 2000
                            })
                        }
                    })
                }else{//编辑地址时
                    let data = {
                        locationId:this.id,
                        token:wx.getStorageSync('token'),
                        newDistrictId:this.areaId,
                        address:this.address,
                        userPhone:this.tel,
                        userName:this.name,
                        isDefault
                    }
                    console.log(data)
                    wxRequest('/mp/shop/api/user/location/update',{data}).then(res => {
                        console.log(res)
                        if(res.data.code === 0){
                            wx.showToast({
                                title: '修改成功',
                                duration: 2000
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            },1000)

                        }else{
                            wx.showToast({
                                title: '修改失败',
                                icon:'none',
                                duration: 2000
                            })
                        }
                    })
                }

            }

        }
    },
    onLoad(query){
        console.log(111,query.address)
        if(query.address !== undefined){
            this.editType = 1;
            let address = JSON.parse(query.address);
            this.name = address.userName;
            this.tel = address.userPhone;
            this.areaId = address.districtId;
            this.area = address.provinceName+' '+address.cityName + ' ' + address.districtName;
            this.address = address.address;
            this.id = address.id;
            if(address.isDefault === 1)
                this.isSelect = true;
            else
                this.isSelect = false;
        }else{
            this.editType = 0;
        }
    }
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }
  .input-item{
      display: flex;
      background: #fff;
      padding: 14px 12px;
      margin-top: 10px;
      font-size: 14px;
      color: #333;
      align-items: center;
  }
  .input-item span{
      width: 80px;
      color: #333;
  }
  .input-item input{
      width: calc(100% - 80px);
  }
  .input-item textarea{
      width: calc(100% - 80px);
      height: 100px;
      padding: 2px;
  }
  .face-right{
      width: 20px;
  }
  .set-default{
      color: #333;
      background: #fff;
      margin-top: 10px;
      font-size: 14px;
      padding: 14px 12px;
  }
  .set-default-left-bottom{
      font-size: 12px;
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