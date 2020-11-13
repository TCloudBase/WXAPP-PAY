const cloud = require('wx-server-sdk')
const { sub_mch_id } = require('key.json')
cloud.init()
const db = cloud.database();

const uuid = function () {
	let $chars = '';
	let maxPos = $chars.length;
	let pwd = '';
	for (i = 0; i < 32; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
exports.main = async (event, context) => {
	console.log(event);
	const result = (await db.collection('pay').doc(event.userInfo.openId).get()).data;
	if(result.uuid!=null){
		let order = (await db.collection('pay_order').doc(result.uuid).get()).data;
		return {
			code: 0,
			uuid:result.uuid,
			pay: order.payment
		}
	}
	const uid = uuid();
	console.log(uid);
	const res = await cloud.cloudPay.unifiedOrder({
		body: "测试微信支付功能",
		outTradeNo: uid,
		spbillCreateIp: JSON.parse(context.environment).WX_CLIENTIP,
		subMchId: sub_mch_id,
		totalFee: 1,
		envId: "work-01",
		functionName: "back_pay",
		tradeType: 'JSAPI'
	})
	if (res.resultCode != 'SUCCESS') {
		return {
			code: 1,
			returnMsg: res.returnMsg
		}
	}
	await db.collection('pay').where({
		_id: event.userInfo.openId
	}).update({
		data: {
			uuid: uid
		}
	})
	await db.collection('pay_order').add({
		data: {
			_id: uid,
			cdue: new Date(),
			payment:res.payment,
			type:'NOTPAY'
		}
	})
	return {
		code: 0,
		uuid:uid,
		pay: res.payment
	}
}