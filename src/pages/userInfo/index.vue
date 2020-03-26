<template>
  <div>
    <div class="input-header">
      <div class="input-header-icon"><img src="../../../static/images/user_icon_1.png" mode='widthFix'/></div>
      <div>收件信息</div>
    </div>
    <div style="margin-top:10px">
      <div class="input-item">
        <div class="item-title"><div class="must-icon">*</div>姓名</div>
        <input placeholder="请输入" placeholder-class="phcolor"/>
      </div>
      <div class="input-item">
        <div class="item-title"><div class="must-icon">*</div>性别</div>
          <van-radio-group :value="id" @change="changeRadio" style="display:flex">
            <van-radio custom-class="address-item" icon-class='icon' checked-color='#FFd637' name="1" style="margin-right:50px">
              男
            </van-radio>
            <van-radio custom-class="address-item" icon-class='icon' checked-color='#FFd637' name="2">
              女
            </van-radio>
          </van-radio-group>
      </div>
      <div class="input-item">
        <div class="item-title"><div class="must-icon">*</div>生日</div>
        <input v-model="currentDate" placeholder="请选择日期" disabled @click="showPickerM" placeholder-class="phcolor"/>
      </div>
      <div class="input-item">
        <div class="item-title">手机号</div>
        <input placeholder="请输入" placeholder-class="phcolor" type="number"/>
      </div>
    </div>
    <div class="input-header">
      <div class="input-header-icon2"><img src="../../../static/images/location.png" mode='widthFix'/></div>
      <div>收件地址</div>
    </div>
    <div style="margin-top:10px">
      <div class="input-item">
        <div class="item-title">地址</div>
        <div class="choose-input" @click="showAreaM"><input placeholder="请选择地址" placeholder-class="phcolor" disabled v-model="area"/>
          <div style="width:20px"><img src="../../../static/images/face-right.png" mode='widthFix'/></div>
        </div>
      </div>
      <div class="input-item">
        <div class="item-title">详细地址</div>
        <input placeholder="请输入" placeholder-class="phcolor"/>
      </div>

      <div class="input-item">
        <div class="item-title">邮编</div>
        <input placeholder="请输入"  placeholder-class="phcolor" type="number"/>
      </div>
    </div>
        <!--  -->
    <div class="address-btns">
        <div class="address-btn add-btn">保存</div>
        <div class="address-btn report-btn">一键导入微信地址</div>
    </div>
    <van-datetime-picker v-if="showPicker" style="position:fixed;bottom:0;width:100vw" type="date" @cancel='hidePicker' @confirm='selTime'/>
          <!--  -->
      <van-popup :show="showArea" position="bottom" close-on-click-overlay="true" @close="closeArea" >
        <van-area :area-list="areaList" @confirm="confirmArea" @cancel="closeArea" />
      </van-popup>
  </div>
</template>

<script>
import {timeFormat} from '@/components/common';
import areas from '../../../static/area.js';
export default {
  data() {
    return {
      id:'1',
      showPicker:false,
      showArea:false,
      currentDate:'',
      areaList:areas,
      area:''
    }
  },
  methods: {
        changeRadio(e){
            console.log(e.mp.detail)
            this.id = e.mp.detail;
        },
        showPickerM(){
          this.showPicker = true;
        },
        hidePicker(){
          this.showPicker = false;
        },
        selTime(e){
          this.currentDate = timeFormat(e.mp.detail.toString());
          this.showPicker = false;  
        },
        closeArea(){
          this.showArea = false;
        },
        showAreaM(){
          this.showArea = true;
        },
        confirmArea(e){
          this.area = e.mp.detail.values[0].name + ' ' + e.mp.detail.values[1].name + ' ' + e.mp.detail.values[2].name;
          this.showArea = false;
        }
  },
}
</script>

<style>
  @import url('../../components/common.css');
  page{
    background: rgb(247, 248, 248);
  }

  .input-header{
    display: flex;
    color: #333;
    margin-top: 26px;
    padding: 0 12px;
  }
  .input-header-icon{
    width: 20px;
    margin-right: 10px;
  }
    .input-header-icon2{
    width: 16px;
    margin-right: 10px;
  }
  .input-item{
    background: #fff;
    display: flex;
    padding: 10px 16px;
    margin-top: 6px;
    font-size: 14px;
    color: #333;
    align-items: center;
  }
  .item-title{
    width: 80px;
    position: relative;
  }
  .must-icon{
    position: absolute;
    top: 10%;
    left: -10px;
    color: #FFd637;
  }
  .input-item>input{
    width: calc(100% - 80px);
  }
  .choose-input{
    width: calc(100% - 80px);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .choose-input input{
    width: calc(100% - 30px);
  }
   .address-btns{
      margin-top: 100px;
      margin-bottom: 60px;
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