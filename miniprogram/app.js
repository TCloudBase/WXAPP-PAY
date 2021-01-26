//app.js
App({
  onLaunch: function () {
      wx.cloud.init({
        traceUser: true,
      })
      this.db = wx.cloud.database()
  },
  calls: function (obj) {
    wx.cloud.callFunction({
      name:obj.name,
      data:obj.data?obj.data:{},
      success(res){
        obj.success(res.result);
      },
      fail(e){
        console.log(e);
        wx.hideLoading()
        wx.showModal({
          title:"网络错误",
          content:"你的操作请求由于网络或系统问题中断，请稍后再试"
        })
      }
    })
  }
})
