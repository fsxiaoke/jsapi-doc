## 设备类  


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>device.authenticateUser</td>
      <td>鉴权，支持指纹和纷享密码两种方式</td>
   </tr>
   <tr>
      <td>device.getAP</td>
      <td>获取接入点标识</td>
   </tr>
   <tr>
      <td>device.getNetworkType</td>
      <td>获取当前接入的网络类型：WiFi、2/3/4G</td>
	</tr>
   <tr>
      <td>device.getUUID</td>
      <td>获取设备唯一编码</td>
	</tr>
   <tr>
      <td>device.scan</td>
      <td>扫一扫</td>
	</tr>
   <tr>
      <td>device.vibrate</td>
      <td>手机震动</td>
	</tr>
</table>

#### 对当前用户鉴权
调用该接口会弹出一个鉴权页面，用户需要验证指纹（支持Touch-ID并打开了指纹登录）、或输入当前登录用户的纷享密码才能通过鉴权。       

代码样例  
```javascript
FSOpen.device.authenticateUser({
    appName: '工资助手',
    onSuccess: function(resp){
        alert('认证成功');
    },
    onFail: function(error){
        if (error.errorCode === 40050) {
            alert('取消了认证');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
```

方法名：FSOpen.device.authenticateUser    
JS版本：2.0.0   
客户端支持版本：5.4.0及以上    

参数说明  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| appName   | String      | 是   | 当前应用名字 |


#### 获取热点信息    

代码样例
```javascript
FSOpen.device.getAP({
    onSuccess: function(resp) {
        // ssid: 'FSDevLan'
        // macAddress: '3c:12:aa:09'
        console.assert(resp.ssid !== undefined);
        console.assert(resp.macAddress !== undefined);
    }
});
``` 


方法名：FSOpen.device.getAP   
JS版本：2.0.0   
客户端支持版本：5.4.0及以上   

成功回调返回参数  

| 参数       | 类型        | 说明                |
| -----------| ------------| --------------------|
| ssid       | String      | 热点SSID            |
| macAddress | String      | 热点MAC地址         |


#### 获取网络类型      

代码样例
```javascript
FSOpen.device.getNetworkType({
    onSuccess: function(resp) {
        // network: '3g'
        console.assert(resp.network !== undefined);
    }
});
``` 

方法名：FSOpen.device.getNetworkType    
JS版本：2.0.0    
客户端支持版本：5.4.0及以上    

成功回调返回参数  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| network   | String      | 网络类型，取值可能为：`2g`, `3g`, `4g`, `wifi`, `unknown`, `none`，`none`表示离线。|


#### 获取通用唯一识别码     

代码样例
```javascript
FSOpen.device.getUUID({
    onSuccess: function(resp) {
        // uuid: 'FD71A168-1CAD-4EF1-BECC-52997124207A'
        console.assert(resp.uuid !== undefined);
    }
});
``` 

方法名：FSOpen.device.getUUID    
JS版本：2.0.0    
客户端支持版本：5.4.0及以上    

成功回调返回参数  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| uuid      | String      | 本机唯一识别码          |


#### 调用扫码     

代码样例
```javascript
FSOpen.device.scan({
    onSuccess: function(resp) {
        // text: 'https://www.fxiaoke.com/'
        console.log(resp.text !== undefined);
    }
});
``` 

方法名：FSOpen.device.scan   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上    

成功回调返回参数  

| 参数        | 类型        | 说明                |
| ------------| ------------| --------------------|
| text        | String      | 扫码内容            |


#### 设备震动     

代码样例
```javascript
FSOpen.device.vibrate({
    duration: 3000
});
``` 

方法名：FSOpen.device.vibrate   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上    

参数说明  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| duration  | Number      | 否   | 震动时间，只对Android有效。单位毫秒，默认3秒。 |
