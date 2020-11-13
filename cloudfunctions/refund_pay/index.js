const cloud = require('wx-server-sdk')
const { sub_mch_id } = require('key.json')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
	const result = (await db.collection('pay').doc(event.userInfo.openId).get()).data;
	const res = await cloud.cloudPay.refund({
		sub_mch_id,
		out_trade_no:result.uuid,
		out_refund_no:`TK-${result.uuid}`,
		total_fee:1,
		refund_fee:1
	})
	if(res.resultCode == "SUCCESS"){
		let temp = {
			refund:res
		}
		const resq = await cloud.cloudPay.queryOrder({
			sub_mch_id,
			out_trade_no:result.uuid
		})
		if(resq.resultCode=='SUCCESS'){
			temp.type = resq.tradeState
		}
		await db.collection('pay_order').doc(result.uuid).update({
			data: temp
		})
		return {
			code:0
		}
	}
	else{
		return {
			code:1,
			pay:res.returnMsg
		}
	}
}