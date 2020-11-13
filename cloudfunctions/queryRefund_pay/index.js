const cloud = require('wx-server-sdk')
const { sub_mch_id } = require('key.json')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
	const result = (await db.collection('pay').doc(event.userInfo.openId).get()).data;
	const res = await cloud.cloudPay.queryRefund({
		sub_mch_id,
		out_refund_no: `TK-${result.uuid}`
	})
	if (res.resultCode == "SUCCESS") {
		await db.collection('pay_order').doc(result.uuid).update({
			data:{
				refundtype: 'SUCCESS'
			}
		})
		await db.collection('pay').where({
			_id: event.userInfo.openId
		}).update({
			data: {
				uuid: null
			}
		})
		return {
			code: 0,
			pay: res
		}
	} else {
		return {
			code: 1,
			pay: res.returnMsg
		}
	}
}