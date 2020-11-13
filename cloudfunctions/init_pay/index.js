const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
	console.log(cloud.getWXContext());
	const result = (await db.collection('pay').where({
		_id:event.userInfo.openId
	}).get()).data;
	if(result.length != 0){
		if(result[0].uuid !=null){
			let order = (await db.collection('pay_order').doc(result[0].uuid).get()).data;
			return {
				type:order.type
			}
		}
		else{
			return {
				type:null
			}
		}
	}
	else {
		await db.collection('pay').add({
			data:{
				_id:event.userInfo.openId,
				uuid:null
			}
		})
		return {
			type:null
		}
	}
}