# 云开发·微信支付演示DEMO

## 项目介绍
此示例使用云开发微信支付实现了从付款到退款的整个闭环基础操作流程，后续随着分账等新增能力推出，也会在此示例中进行展示

## 部署步骤
- 将项目下载，使用小程序开发者工具导入，填写非个人的appid
- 部署的小程序需要保证已经绑定微信支付，如果未绑定则前往[此处](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/wechatpay/wechatpay.html)参考绑定
- 打开cloudfunctions文件夹，在所有云函数中key.json里填入微信支付的商户号
- 依次全部上传部署云函数，云端安装依赖即可
- 创建数据库pay、pay_order，默认权限配置即可

## 作者信息
- zirali