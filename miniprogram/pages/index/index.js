const app = getApp()
var that = null
const mode = {
	pay: {
		info: '付款0.01元',
		mainbtn: {
			text: '开始付款',
			disabled: false,
			show: true,
			function: 'do_pay'
		},
		lessbtn: {
			text: '我已付款',
			disabled: false,
			show: false
		}
	},
	notpay:{
		info: '你尚未付款',
		mainbtn: {
			text: '继续付款',
			disabled: false,
			show: true,
			function:'do_pay'
		},
		lessbtn: {
			text: '取消付款',
			disabled: false,
			show: true,
			function:'close_pay'
		}
	},
	paying: {
		info: '付款结果确认',
		mainbtn: {
			text: '确认付款',
			disabled: false,
			show: true,
			function: 'query_pay'
		},
		lessbtn: {
			text: '我已付款',
			disabled: false,
			show: false
		}
	},
	payed: {
		info: '付款完毕',
		mainbtn: {
			text: '开始退款',
			disabled: false,
			show: true,
			function: 'refund_pay'
		},
		lessbtn: {
			text: '我已付款',
			disabled: false,
			show: false
		}
	},
	refund:{
		info: '退款流程中',
		mainbtn: {
			text: '查询状态',
			disabled: false,
			show: true,
			function: 'queryrefund_pay'
		},
		lessbtn: {
			text: '我已付款',
			disabled: false,
			show: false
		}
	}
}
Page({
	data: {
		info: '加载信息中',
		mainbtn: {
			show: false
		},
		lessbtn: {
			show: false
		}
	},
	onLoad() {
		that = this;
	},
	onShow() {
		that.init()
	},
	init() {
		app.calls({
			name: 'init_pay',
			success(res) {
				if (res.type == null) {
					that.setData(mode.pay)
				} else if (res.type == 'NOTPAY') {
					that.setData(mode.notpay)
				}
				else if(res.type == 'SUCCESS'){
					that.setData(mode.payed)
				}
				else if(res.type == 'REFUND'){
					that.setData(mode.refund)
				}
			}
		})
	},
	do_pay() {
		wx.showLoading({
			title: '正在加载',
			mask: true
		})
		app.calls({
			name: "do_pay",
			success(res) {
				wx.hideLoading();
				console.log(res)
				if (res.code == 0) {
					that.setData(mode.paying)
					wx.requestPayment({
						...res.pay,
						success(res) {
							console.log('支付成功！')
							that.query_pay()
						},
						fail(err) {
							console.log('支付失败！')
							that.query_pay()
						}
					})
				} else if (res.code == 1) {
					wx.showModal({
						title: '下单失败',
						content: res.returnMsg,
						showCancel: false
					})
				}
			}
		})
	},
	close_pay(){
		wx.showLoading({
			title: '关闭订单',
			mask: true
		})
		app.calls({
			name: "close_pay",
			success(res) {
				wx.hideLoading();
				console.log(res)
				if (res.code == 0) {
					try{
						that.watch.close()
					}catch(e){}
					that.init()
				}
				else{
					wx.showModal({
						title: '关闭失败',
						content: res.returnMsg,
						showCancel: false
					})
				}
			}
		})
	},
	query_pay(){
		wx.showLoading({
			title: '查询中',
			mask: true
		})
		app.calls({
			name: "back_pay",
			success(res) {
				wx.hideLoading();
				that.init()
			}
		})
	},
	refund_pay(){
		wx.showLoading({
			title: '退款中',
			mask: true
		})
		app.calls({
			name: "refund_pay",
			success(res) {
				wx.hideLoading();
				that.init();
			}
		})
	},
	queryrefund_pay(){
		wx.showLoading({
			title: '查询中',
			mask: true
		})
		app.calls({
			name: "queryRefund_pay",
			success(res) {
				wx.hideLoading();
				that.init();
			}
		})
	}
})