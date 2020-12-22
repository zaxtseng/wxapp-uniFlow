//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '联通流量领取',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: '',
    phone: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onCodeInput: function(e){
    console.log(e)
    this.setData({
      code: e.detail.value
    })
  },
  onPhoneInput: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  onCode: function(e){
    let that = this
    wx.request({
      url: 'https://m.10010.com/god/AirCheckMessage/sendCaptcha',
      data: {
        type: 21,
        phoneVal: that.data.phone
      },
      header: {'content-type':'application/x-www-form-urlencoded; charset=UTF-8'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        console.log(res)
        if(res.data.RespCode === "0000"){
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          })
          
        }
      },
      fail: (res)=>{
        console.log(res)
      },
      complete: (res)=>{
        console.log(res)
        if(res.data.RespCode === "10001"){
          wx.showToast({
            title: '一天最多发三次',
            icon: 'error',
            duration: 2000
          })
        }
      }
    });
  },
  onFlow: function(e){
    let that = this
    console.log(e)
    wx.request({
      url: 'https://m.10010.com/god/qingPiCard/flowExchange',
      data: {
        number: that.data.phone,
        type: 21,
        captcha: that.data.code
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        if(res.RespCode === "0000"){
          wx.showToast({
            title: '流量已领取,请1分钟后再试',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: (res)=>{
        console.log(res)
      },
      complete: ()=>{}
    });
  }

})
