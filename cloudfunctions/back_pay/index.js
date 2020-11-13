const cloud = require('wx-server-sdk')
const { sub_mch_id } = require('key.json')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
	const result = (await db.collection('pay').doc(event.userInfo.openId).get()).data;
	const res = await cloud.cloudPay.queryOrder({
		sub_mch_id,
		out_trade_no:result.uuid
	})
	if(res.resultCode=='SUCCESS'){
		await db.collection('pay_order').doc(result.uuid).update({
			data: {
				type:res.tradeState
			}
		})
	}
	console.log(res)
	return 'success';
}