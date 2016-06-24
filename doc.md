## 基本使用方法

1. 引入jsapi库

    `<script src="http://www.fxiaoke.com/open/jsapi/1.0.0/jsapi.min.js"></script>` 

2. 配置应用参数
```javascript
    FSOpen.config({
        appId: 'FSAID_1313de7',
        timestamp: 1463564391382,
        nonceStr: 'HUsfdsOIIejfoweu2u283',
        signature: '1520C2C8223BC8D46525639743E54659CDD7B163',
        jsApiList: [
            'contact.choose',
            'contact.chooseUser',
            'contact.chooseDepartment'
        ]
    });
``` 
说明：如果第三方应用不涉及JSAPI授权校验相关，可不配置此相关接口。   

3. 通过FSOpen.ready和FSOpen.error来监听初始化成功或者失败
```javascript
    FSOpen.ready(function(bridge){
        console.log('FS LOG:', FSOpen.version);
        // do yourself init;
    });
    FSOpen.error(function(error){
        if (error.errorCode === 30000) {
            alert('5.3以下版本，需要更新');
        } else {
            console.log('FS err: ', error);
        }
    });
``` 

4. 当然，还可以支持使用链式调用
```javascript
    // 如果你不需要调用授权接口，不需要配置config
    FSOpen.config({
        appId: 'FSAID_1313de7',
        timestamp: 1463564391382,
        nonceStr: 'HUsfdsOIIejfoweu2u283',
        signature: '1520C2C8223BC8D46525639743E54659CDD7B163',
        jsApiList: [
            'contact.choose',
            'contact.chooseUser',
            'contact.chooseDepartment'
        ]
    }).ready(function(bridge){
        console.log('FS LOG:', FSOpen.version);
        // do yourself init;
    }).error(function(error){
        if (error.errorCode === 30000) {
            alert('5.3以下版本，需要更新');
        } else {
            console.log('FS err: ', error);
        }
    });
``` 

## 基本配置

### 全局参数配置

功能说明：用作api授权验证  
参数说明：  

| 参数名        | 类型          | 必须  |
| ------------- |:-------------:| -----:|
| appId         | String        |     Y |
| timestamp     | Long          |     Y |
| nonceStr      | String        |     Y |
| signature     | String        |     Y |
| jsApiList     | List<String>  |     Y |

### 日志接口配置
功能说明：为了方便外部调试，将内部调试内容输出  
回调参数说明：

| 参数名        | 类型          | 必须  |
| ------------- |:-------------:| -----:|
| message       | String        |     Y |
| logData       | Object        |     N |

### 错误接口配置
功能说明：为了方便外部调试，将内部错误内容输出  
回调参数说明：

| 参数名        | 类型          | 必须  |
| ------------- |:-------------:| -----:|
| message       | String        |     Y |
| errorData     | Object        |     N |

## 接口调用

### 接口调用说明

**所有接口均接受一个可选配置参数，基本格式如下：**
```javascript
{
    param1: 'xxx',  // 接口需要相关参数1
    ...
    paramn: 'xxx',  // 接口需要相关参数n
    onSuccess: function(response) {
        // 成功回调处理...
    },
    onFail: function(response) {
        // 失败回调处理...
    }
}
``` 

**所有成功回调（如有）返回如下内容：**
```javascript
{
    errorCode: 0,
    errorMessage: 'success',
    reponse: ..   // 根据接口返回具体的数据
}
``` 

**所有错误回调（如有）返回如下内容：**
```javascript
{
    errorCode: 40000,
    errorMessage: '请求参数错误'
}
``` 

**错误码对应描述信息：**

| 错误码    | 错误描述                                         |
| ----------| -------------------------------------------------|
| 30000     | Bridge不存在（可直接认为不支持）                 |
| 30001     | Bridge还未初始化                                 |
| 30002     | Bridge初始化失败                                 |
| 40000     | 请求参数错误                                     |
| 40001     | JSTICKET签名校验失败                             |
| 40002     | JSAPI授权失败                                    |
| 40003     | 网络请求出错                                     |
| 40004     | API不存在                                        |
| 40005     | 数据访问错误，比如APP内部访问联系人失败          |
| 40006     | 配置异常，没有调用config或者APPID校验失败        |
| 40007     | 支付失败，目前没有特别错误提示，统一表示支付失败 |
| 40008     | 通用取消，表示用户取消行为                       |
| 50000     | 未知错误。目前此错误码不做任何回调处理           |
| 50003     | 后台服务错误（不可用)                            |

### 接口调用列表

---------------------
#### 容器类  
---------------------

##### 获取终端版本号     
接口方法：FSOpen.runtime.getVersion   
返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| ver       | String      | 版本号信息，如'5.3' |

举个栗子：  
```javascript
FSOpen.runtime.getVersion({
    onSuccess: function(responseData){
        console.assert(responseData.ver !== undefined);
        console.assert(parseFloat(responseData.ver) > 5.2);
    },
    onFail: function(responseData){
        alert('您的应用不支持JSAPI，请升级');
    }
});
``` 

##### &#10084;  终端升级提示    
接口方法：FSOpen.runtime.showUpdate   
调用参数：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| message   | String      | 升级提示说明        |

举个栗子：  
```javascript
FSOpen.runtime.showUpdate({
    message: '要使用我，你需要更新'
});
``` 

---------------------
#### 设备类  
---------------------

##### &#10084;  指纹验证     
接口方法：FSOpen.device.authenticateUser   
调用参数：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| appName   | String      | 应用名字            |

返回说明：  

| 参数      | 类型        | 说明         |
| ----------| ------------| -------------|
| result    | Number      | 指纹验证结果：0-验证成功，1-验证失败，2-验证取消 |

举个栗子：  
```javascript
FSOpen.device.authenticateUser({
    appName: '战报助手',
    onSuccess: function(resp){
        console.log(resp);
    }
});
``` 

##### &#10084;  屏幕控制     
接口方法：FSOpen.device.setOrientation   
调用参数：  

| 参数        | 类型        | 说明                |
| ------------| ------------| --------------------|
| orientation | Number      | 0-portrait竖屏，1-landscape横屏 |

举个栗子：  
```javascript
FSOpen.device.setOrientation({
    orientation: 1
});
``` 

##### &#10084;  调用扫码     
接口方法：FSOpen.device.scan   
调用参数：  

| 参数        | 类型        | 说明                |
| ------------| ------------| --------------------|
| type        | String      | qr表示二维码；bar表示一维码 |

返回说明：  

| 参数        | 类型        | 说明                |
| ------------| ------------| --------------------|
| text        | String      | 扫码内容            |

举个栗子：  
```javascript
FSOpen.device.scan({
    type: 'qr',
    onSuccess: function(resp) {
        console.log(resp.text);
    }
});
``` 

##### &#10084;  获取通用唯一识别码     
接口方法：FSOpen.device.getUUID   
返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| uuid      | String      | 唯一识别码          |

举个栗子：  
```javascript
FSOpen.device.getUUID({
    onSuccess: function(resp) {
        console.log(resp.uuid);
    }
});
``` 

##### &#10084;  获取热点信息    
接口方法：FSOpen.device.getAP   
返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| ssid      | String      | 热点SSID            |
| macip     | String      | 热点MAC地址         |

举个栗子：  
```javascript
FSOpen.device.getAP({
    onSuccess: function(resp) {
        // ssid: 'FSDevLan'
        // macip: '3c:12:aa:09'
        console.log(resp.ssid, resp.macip);
    }
});
``` 

##### &#10084;  获取网络类型      
接口方法：FSOpen.device.getNetwork   
返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| network   | String      | 网络类型，2g/3g/4g/wifi/unknown/none，none表示离线|

举个栗子：  
```javascript
FSOpen.device.getNetwork({
    onSuccess: function(resp) {
        // network: '3g'
        console.log(resp.network);
    }
});
``` 

---------------------
#### 授权类  
---------------------

##### &#10084;  获取免登授权码    
接口方法：FSOpen.permission.requestAuthCode   
返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| code      | String      | 授权码              |

举个栗子：  
```javascript
FSOpen.permission.requestAuthCode({
    onSuccess: function(resp) {
        _alert(resp);
    },
    onFail: function(resp) {
        _error(resp);
    }
});
``` 

---------------------
#### 启动器  
---------------------

##### &#10084;  启动第三方应用    
接口方法：FSOpen.launcher.launchApp   
调用参数：  

| 参数      | 类型       | 说明                |
| ----------| -----------| --------------------|
| scheme    | String     | iOS：应用scheme |
| pkgName   | String     | Android：应用包名 |

返回说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| result    | Boolean     | true唤起成功；false唤起失败 |

举个栗子：  
```javascript
FSOpen.launcher.launchApp({
    scheme: 'taobao',
    pkgName: 'com.alibaba.taobao',
    onSuccess: function(resp) {
        _alert(resp);
    },
    onFail: function(resp) {
        _error(resp);
    }
});
``` 

##### &#10084;  检测应用是否安装    
接口方法：FSOpen.launcher.checkAppInstalled   
调用参数：  

| 参数      | 类型       | 说明                |
| ----------| -----------| --------------------|
| scheme    | String     | iOS：应用scheme |
| pkgName   | String     | Android：应用包名 |

返回说明：  

| 参数      | 类型            | 说明                |
| ----------| ----------------| --------------------|
| installed | Boolean         | 检测结果 |

举个栗子：  
```javascript
FSOpen.launcher.checkAppInstalled({
    scheme: 'taobao',
    pkgName: 'com.alibaba.taobao',
    onSuccess: function(resp) {
        _alert(resp);
    },
    onFail: function(resp) {
        _error(resp);
    }
});
``` 

---------------------
#### 通讯录  
---------------------

##### &#10084;  根据openid获取用户信息   
接口方法：FSOpen.contact.getUserInfo   
调用参数：  

| 参数      | 类型          | 说明                      |
| ----------| --------------| --------------------------|
| id        | Array[String] | 需要查询的用户OPEN-ID列表 |

返回说明：  

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| users     | Object        | 用户关联数组，比如：{"FSUID_XXX": {openUserId:'',name:'',email:'',profileImageUrl:''}}，如果用户没找到，对应的值为空 |

用户字段说明：

| 字段            | 类型    | 说明        |
| ----------------| --------| ------------|
| openUserId      | String  | 用户OPEN-ID |
| name            | String  | 用户昵称    |
| email           | String  | 用户eamil   |
| profileImageUrl | String  | 用户头像    |

举个栗子：  
```javascript
FSOpen.contact.getUserInfo({
    id: ['FSUID_00000000000', 'FSUID_111111111111'],
    onSuccess: function(responseData){
        conosle.assert(responseData.errorCode == 0);
        console.assert(responseData.users != null);

        var apps = responseData.users;
        for (var key in apps) {
            console.log(apps[key]);
        }
    }
});
``` 

##### &#10084;  获取服务号信息    
接口方法：FSOpen.contact.getAppInfo    
调用参数：  

| 参数      | 类型          | 说明                   |
| ----------| --------------| -----------------------|
| id        | Array[String] | 需要查询的服务号ID列表 |

返回说明：  

| 参数      | 类型          | 说明       |
| ----------| --------------| -----------|
| apps      | Object        | 服务号关联数组，比如：{"FSAID_XXX": {openAppId:'',name:'',imageUrl:''}}，如果服务号没找到，对应的值为空 |

服务号字段说明：

| 字段      | 类型    | 说明        |
| ----------| --------| ------------|
| openAppId | String  | 服务号ID    |
| name      | String  | 服务号名称  |
| imageUrl  | String  | 服务号图片地址 |

举个栗子：  
```javascript
FSOpen.contact.getAppInfo({
    id: ['FSAID_00000000000'],
    onSuccess: function(responseData){
        conosle.assert(responseData.errorCode == 0);
        console.assert(responseData.apps != null);

        var apps = responseData.apps;
        for (var key in apps) {
            console.log(apps[key]);
        }
    }
});
``` 

##### &#10084;  从通讯录里同时显示选择人员、部门和群组会话    
接口方法：FSOpen.contact.choose    
调用参数：    

| 参数                | 类型          | 说明                       |
| --------------------| --------------| ---------------------------|
| selectedUsers       | Array[String] | 可选，已选的人员OPENID列表 |
| selectedDepartments | Array[String] | 可选，已选的部门ID列表     |
| selectedGroups      | Array[String] | 可选，已选的多人回话ID列表 |
| selectedCompanyAll  | Boolean       | 可选，是否已选中全公司，默认false |
| title               | String        | 可选，控件显示标题         |
| excludeSelf         | Boolean       | 可选，是否排除自己         |
| showRecent          | Boolean       | 可选，是否显示最近         |
| showGroupTab        | Boolean       | 可选，是否显示群组标签页   |
| showCompanyAll      | Boolean       | 可选，是否显示全公司选项   |

返回说明：  

| 参数             | 类型          | 说明     |
| -----------------| --------------| ---------|
| users            | Array[Object] | 用户列表 |
| departments      | Array[Object] | 部门列表 |
| groups           | Array[Object] | 群组列表 |
| selectCompanyAll | Array[Object] | 是否选中全公司，注意与调用参数`selectedCompanyAll`区别 |

用户字段说明：

| 字段            | 类型    | 说明        |
| ----------------| --------| ------------|
| openUserId      | String  | 用户OPEN-ID |
| name            | String  | 用户昵称    |
| email           | String  | 用户eamil   |
| profileImageUrl | String  | 用户头像    |

部门字段说明：

| 字段     | 类型    | 说明       |
| ---------| --------| -----------|
| id       | Number  | 部门ID     |
| name     | String  | 部门名称   |
| parentId | Number  | 父亲部门ID |

群组字段说明：

| 字段      | 类型    | 说明     |
| ----------| --------| ---------|
| id        | String  | 群组ID   |
| name      | String  | 群组名称 |

举个栗子：  
```javascript
FSOpen.contact.choose({
    onSuccess: function(responseData){
        conosle.assert(responseData.errorCode == 0);
        console.assert(responseData.users != null);
        console.assert(responseData.departments != null);
        console.assert(responseData.groups != null);
        console.log(responseData.selectCompanyAll);
    }
});
``` 

##### &#10084;  从通讯录里选择人员   
接口方法：FSOpen.contact.chooseUser       
调用参数：   

| 参数                | 类型          | 说明                 |
| --------------------| --------------| ---------------------|
| selectedUsers       | Array[String] | 已选的人员OPENID列表 |
| filterUsers         | Array[String] | 过滤的人员OPENID列表 |
| max                 | Number        | 可选人员上限         |
| radio               | Boolean       | 是否单选，如有这个参数，selectedUsers最多只被选中一个 |
| title               | String        | 可选，控件显示标题   |
| excludeSelf         | Boolean       | 是否排除自己         |
| firstSelf           | Boolean       | 是否优先显示自己     |
| isPrivate           | Boolean       | 是否隐藏自己名字，显示为私密 |

返回说明：  

| 参数             | 类型          | 说明     |
| -----------------| --------------| ---------|
| users            | Array[Object] | 用户列表 |

举个栗子：   
```javascript
FSOpen.contact.chooseUser({
    max: 5,
    onSuccess: function(responseData){
        conosle.assert(responseData.errorCode == 0);
        console.assert(responseData.users != null);
        console.assert(responseData.users.length == 2);

        responseData.users.forEach(function(item){
            console.log(item);
            <!-- {
                "openUserId": "FSUID_XXXXXXXXXXXXXXXXXXX",
                "name": "Andson",
                "email": "andson@fxiaoke.com",
                "profileImageUrl": "xxx"
            } -->
        });
    }
});
``` 

##### &#10084;  从通讯录里选择部门
接口方法：FSOpen.contact.chooseDepartment   
调用参数：   

| 参数                | 类型          | 说明                 |
| --------------------| --------------| ---------------------|
| selectedDepartments | Array[String] | 已选的部门ID列表     |
| filterDepartments   | Array[String] | 过滤的部门ID列表     |
| max                 | Number        | 可选部门上限         |
| radio               | Boolean       | 是否单选，如有这个参数，selectedDepartments最多只被选中一个 |
| title               | String        | 可选，控件显示标题   |

返回说明：  

| 参数             | 类型          | 说明     |
| -----------------| --------------| ---------|
| departments      | Array[Object] | 部门列表 |

举个栗子：  
```javascript
FSOpen.contact.chooseDepartment({
    max: 5,
    onSuccess: function(responseData){
        conosle.assert(responseData.errorCode == 0);
        console.assert(responseData.departments != null);
        console.assert(responseData.departments.length == 1);

        responseData.departments.forEach(function(item){
            console.log(item);
            <!-- {
                "id": 11,
                "name": "事业部",
                "parentId": 1,
            } -->
        });
    }
});
``` 

##### &#10084;  跳到个人主页
接口方法：FSOpen.contact.showProfile    
调用参数：  

| 参数      | 类型      | 说明                 |
| ----------| ----------| ---------------------|
| openId    | String    | 开放平台根据应用ID装换后的用户openId |

举个栗子：   
```javascript
FSOpen.contact.showProfile({
    openId: 'FSUID_5174F22D77B81347E278CBD353748547'
});
``` 

##### &#10084;  跳到部门主页
接口方法：FSOpen.contact.showDepartment   
调用参数：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| id        | Number    | 部门ID    |

举个栗子：  
```javascript
FSOpen.contact.showDepartment({
    id: '1009'
});
``` 

##### &#10084;  跳到服务号资料页
接口方法：FSOpen.contact.openAppProfile   
调用参数：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| appId     | String    | 服务号ID  |

举个栗子：  
```javascript
FSOpen.contact.openAppProfile({
    appId: 'FSAID_1313f95'
});
``` 

##### &#10084;  联系人添加星标
接口方法：FSOpen.contact.mark   
调用参数：  

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| openUserId | String    | 用户OPEN-ID |

返回说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| result    | Number    | 0-表示成功，非0表示失败 |

举个栗子：  
```javascript
FSOpen.contact.mark({
    openUserId: 'FSUID_5174F22D77B81347E278CBD353748547'
});
``` 

---------------------
#### 支付类  
---------------------

##### &#10084;  调起支付页面  
接口方法：FSOpen.pay.request   
调用参数：   

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| amount     | String    | 金额，字符串。比如20.00，单位是元 |
| wareId     | String    | 业务编号                          |
| wareName   | String    | 业务名称，商家自定义              |
| merchantId | String    | 商户ID，由支付平台提供            |
| limitPayer | Number    | 是否限制付款者 1限制，0不限制     |
| fromEa     | Number    | 当前用户的企业号                  |
| fromUid    | Number    | 当前用户的userId                  |
| expireTime | Number    | 二维码的过期时间（不可为空）格式为毫秒数  |
| sign       | String    | 后台返回的签名参数                |

举个栗子：  
```javascript
FSOpen.pay.request({
    amount: '0.1',
    wareId: 'xxx',
    wareName: 'xxx',
    merchantId: 'xxx',
    limitPayer: 1,
    fromEa: 7,
    fromUid: 1099,
    expireTime: 1461564216568,
    sign: '....',
    onSuccess: function(responseData){
        // 没有返回
    },
    onFail: function(responseData){
        // 用户取消
        console.assert(responseData.errorCode == 40008);
    }
});
``` 

##### &#10084;  跳到钱包页面   
接口方法：FSOpen.pay.showWallet    
举个栗子：   
```javascript
FSOpen.pay.showWallet();
``` 

---------------------
#### 导航栏  
---------------------

##### &#10084;  设置标题栏标题
接口方法：FSOpen.navigation.setTitle   
调用参数：   

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| title      | String    | 标题      |

举个栗子：   
```javascript
FSOpen.navigation.setTitle({
    title: '设置标题'
})
``` 

##### &#10084;  设置标题栏左侧返回按钮的文字
接口方法：FSOpen.navigation.setBackBtnText       
调用参数：   

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| text       | String    | 返回按钮文字 |
  
举个栗子：    
```javascript
FSOpen.navigation.setBackBtnText({
    text: '返回'
})
``` 

##### &#10084;  设置左侧自定义按钮    
接口方法：FSOpen.navigation.setLeftBtn       
调用参数：  

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| text       | String    | 按钮文本  |
| onClick    | Function  | 点击回调  |

举个栗子：   
```javascript
FSOpen.navigation.setLeftBtn({
    text: '关闭',
    onClick: function(resp) {
        FSOpen.util.closeWebView();
    }
}
})
``` 

##### &#10084;  注册标题栏右侧文字按钮
接口方法：FSOpen.navigation.addRightBtn       
调用参数：  

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| btnLabel   | String    | 按钮文字  |
| btnIcon    | String    | 如果有定义此参数，则按钮将按照图形按钮形式展示，目前支持的有：add,more |
| onClick    | Function  | 点击回调  |
     
举个栗子：  
```javascript
FSOpen.navigation.addRightBtn({
    btnLabel: '更多',
    btnIcon: 'more',
    onClick: function() {
        // 点击回调
    }
})
``` 

##### &#10084;  设置标题栏右侧多个按钮     
接口说明：此接口将清空掉原addRightBtn注册的所有按钮，**推荐使用此接口**     
接口方法：FSOpen.navigation.setRightBtn       
调用参数：  

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| items      | Object    | 多个按钮的属性数组 |
| onClick    | Function  | 点击回调  |

按钮字段说明：

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| btnId      | String    | 每一个item的唯一标示 |
| icon       | String    | 预置icon的值，对应关系查看附录 |
| text       | String    | item的文本属性 |

`icon`值对应关系：

| 值         | 说明      |
| -----------| ----------|
| fav        | 收藏    |
| add        | 添加    |
| calendar   | 日历    |
| search     | 搜索    |
| delete     | 删除    |
| scan       | 扫描    |
| structure  |  架构   |
| edit       | 编辑    |
| group      | 群组    |
| individual | 个人    |
| more       | 更多    |
| setting    | 设置    |
| chat       | 聊天    |

`onClick`点击回调说明：  

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| btnId     | String        | item的id |

举个栗子：  
```javascript
FSOpen.navigation.setRightBtn({
    items: [
        {btnId: '1', icon: 'fav', text: '收藏'},
        {btnId: '2', icon: 'add', text: '添加'}
    ],
    onClick: function(resp) {
        // {"btnId": "1"}
    },
    onSuccess: function(resp) {
        _alert(resp);
    },
    onFail: function(resp) {
        _error(resp);
    }
})
``` 

##### &#10084;  删除标题栏上所有右侧按钮  
接口方法：FSOpen.navigation.deleteAllRightBtns       
举个栗子：   
```javascript
FSOpen.navigation.deleteAllRightBtns()
``` 

##### &#10084;  显示纷享菜单 
接口方法：FSOpen.navigation.showFSMenu       
调用参数：  

| 参数       | 类型          | 说明      |
| -----------| --------------| ----------|
| menuList   | Array[String] | 菜单项列表，默认全部显示 |

`菜单项`说明：

| 参数                  | 说明      |
| ----------------------| ----------|
| biz:favorite          | 收藏 |
| sns:shareToChat       | 转发到企信 |
| sns:shareToFeed       | 转发到工作流 |
| sns:shareToCrmContact | 转发到CRM联系人 |
| sns:shareToWXFriend   | 分享到微信好友 |
| sns:shareToWXMoments  | 分享到微信朋友圈 |
| sns:shareToQQFriend   | 分享到QQ好友 |
| sns:shareToMail       | 分享到邮件 |
| sns:shareToSms        | 分享到短信 |
| page:refresh          | 页面刷新 |
| page:copyUrl          | 复制链接 |
| page:generateQR       | 生成二维码 |
| page:openInBrower     | 在浏览器中打开 |
| seperator             | 分隔符，仅android端用来分组菜单项 |

举个栗子：   
```javascript
FSOpen.navigation.showFSMenu({
    menuList: [
        'biz:shareToChat',
        'biz:shareToFeeds',
        'biz:shareToCrmContact',
        'biz:favorite',
        'sns:shareToWXFriend',
        'sns:shareToWXMoments',
        'sns:shareToQQFriend',
        'sns:shareToMail',
        'sns:shareToSms',
        'page:refresh',
        'page:copyUrl',
        'page:generateQR',
        'page:openInBrower'
    ]
})
``` 

##### &#10084;  隐藏纷享菜单 
接口方法：FSOpen.navigation.hideFSMenu       
举个栗子：   
```javascript
FSOpen.navigation.hideFSMenu();
``` 

##### &#10084;  设置导航栏中间按钮 
接口方法：FSOpen.navigation.setMiddleIcon       
调用参数：  

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| icon       | String    | 可选，目前只支持问号按钮 |
| onClick    | Function  | 点击回调  |

举个栗子：   
```javascript
FSOpen.navigation.setMiddleIcon({
    onClick: function(resp) {
        alert(JSON.stringify(resp));
    }
}
})
``` 


---------------------
#### 工具类  
---------------------

##### &#10084;  上传文件
接口方法：FSOpen.util.uploadFile         
调用参数：   

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| onUpload   | Function  | 上传回调函数，此回调会多次调用，调用次数正常情况跟上传的文件个数一致 |

`onUpload`的回调参数说明：

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| file       | Object    | 当前上传成功的文件信息 |
| progress   | Object    | 本次上传的进度         |

`file`对象的结构说明：

| 参数            | 类型      | 说明      |
| ----------------| ----------| ----------|
| businessAccount | String    | 当前登录企业账号 |
| employeeId      | Object    | 当前登录用户ID   |
| id              | Object    | 上传对象ID       |
| result          | Object    | 上传结果，true为成功false为失败 |
| tempFilePath    | Object    | 临时存储路径     |

`progress`对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| loaded    | Number    | 已上传（无论成功与否）的文件个数 |
| count     | Number    | 总上传的文件个数，当loaded>=count，表示上传完毕 |

返回说明：

| 参数           | 类型          | 说明           |
| ---------------| --------------| ---------------|
| selectedFiles  | Array[Object] | 选择的文件列表 |

返回图片对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| id        | Number    | 上传对象ID |
| name      | String    | 上传文件名称 |

举个栗子：  
```javascript
FSOpen.util.uploadFile({
    onUpload: function(file, progress) {
        console.log(file);
        console.assert(progress.loaded <= progress.count);
    },
    onSuccess: function(responseData){
        console.assert(responseData.selectedFiles != null)
        console.assert(responseData.selectedFiles.length == 1);   
    },
    onFail: function(responseData){
        console.assert(responseData.errorCode === 40004);
    }
});
``` 

##### &#10084;  上传图片
接口方法：FSOpen.util.uploadImage         
调用参数：   

| 参数       | 类型          | 说明      |
| -----------| --------------| ----------|
| source     | Array[String] | 上传来源列表，目前只支持`album`，`camera`。默认['album', 'camera'] |
| onUpload   | Function      | 上传回调函数，此回调会多次调用，调用次数正常情况跟上传的图片张数一致 |

`onUpload`的回调参数说明：

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| image      | Object    | 当前上传成功的图片信息 |
| progress   | Object    | 本次上传的进度         |

`image`对象的结构说明：

| 参数            | 类型      | 说明      |
| ----------------| ----------| ----------|
| businessAccount | String    | 当前登录企业账号 |
| employeeId      | Object    | 当前登录用户ID   |
| id              | Object    | 上传对象ID       |
| result          | Object    | 上传结果，true为成功false为失败 |
| tempFilePath    | Object    | 临时存储路径     |

`progress`对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| loaded    | Number    | 已上传（无论成功与否）的图片张数 |
| count     | Number    | 总上传的图片张数，当loaded>=count，表示上传完毕 |

返回说明：

| 参数           | 类型          | 说明           |
| ---------------| --------------| ---------------|
| selectedImages | Array[Object] | 选择的图片列表 |

返回图片对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| id        | Number    | 上传对象ID |
| name      | String    | 上传文件名称 |
| thumbPath | String    | 上传文件的缩略图路径，例：faciImage://www.fxiaoke.com?asset/asset.png?id=1693248043 |

举个栗子：  
```javascript
FSOpen.util.uploadImage({
    onUpload: function(image, progress) {
        console.log(image);
        console.assert(progress.loaded <= progress.count);
    },
    onSuccess: function(responseData){
        console.assert(responseData.selectedImages != null)
        console.assert(responseData.selectedImages.length == 1);   
    }
});
``` 

##### &#10084;  获取当前地理位置
接口方法：FSOpen.util.getLocation        
返回说明：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| location  | Object    | 位置信息  |

`location`对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| longitude | String    | 经度信息  |
| latitude  | String    | 维度信息  |
| city      | String    | 所在城市  |

`onFail`调用失败回调说明：

| 错误码    | 错误描述     |
| ----------| -------------|
| 40003     | 数据请求失败 |
| 40005     | 数据授权失败，比如系统未对应用进行授权 |

举个栗子：    
```javascript
FSOpen.util.getLocation({
    onSuccess: function(responseData){
        console.assert(responseData.location != null);
        console.log(responseData.location);
    },
    onFail: function(responseData){
        console.log(responseData.errorCode);
    }
});
``` 

##### &#10084;  打开新窗口  
接口说明: URL支持fs://格式，http(s)://格式。   
接口方法：FSOpen.util.openWindow    
调用参数：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| url       | String    | 跳转应用地址 |

举个栗子：  
```javascript
FSOpen.util.openWindow({
    url: 'fs://helper/meeting/send'
});
``` 

##### &#10084;  打开新窗口(WebView)  
接口方法：FSOpen.util.openWindowForResult       
调用参数：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| url       | String    | 新窗口链接地址，支持fs://，http(s)://等应用内外链接  |
| onClose   | Function  | 新窗口的关闭后回调  |

`onClose`回调参数说明：

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| resultCode | Number    | 1表示用js api进行的关闭，0表示通过返回键等方式关闭 |
| extras     | Object    | extras值即close方法传入的extras值 |

举个栗子：  
```javascript
FSOpen.util.openWindowForResult({
    url: 'fs://helper/meeting/send',
    onClose: function(resp) {
        console.assert(resp.resultCode == 1);
        console.assert(resp.extras !== undefined);
    }
});
``` 

##### &#10084;  关闭当前页面(WebView)
接口方法：FSOpen.util.closeWebView     
调用参数：  

| 参数     | 类型      | 说明      |
| ---------| ----------| ----------|
| extras   | Object    | 关闭时需要回传给上一个窗口（如果有）的参数 |  

举个栗子：  
```javascript
FSOpen.util.closeWebView({
    extras: {data: 1}
});
``` 

##### &#10084;  打开回复输入框
接口方法：FSOpen.util.openReplyPage     
调用参数：   

| 参数         | 类型          | 说明      |
| -------------| --------------| ----------|
| backFillData | Object        | 编辑时回填数据 |
| components   | Array[String] | 快捷输入组件，目前支持：表情（emoji）、图片（pic）、@（at） |
| title        | Object        | 是否显示左侧的返回箭头、IOS使用 |
| placeholder  | String        | 预置输入提示文本 |
| limit        | Number        | 最大输入字符，不区分中英文 |

`backFillData`对象的结构说明：  

| 参数          | 类型          | 说明      |
| --------------| --------------| ----------|
| txt           | String        | 需要回填的文本内容 |
| pics          | Array[String] | 需要回填的选择图片 |
| tempFilePaths | Array[String] | 临时图片路径，可选。如果有，不会重复上传 |

`components`对象的结构说明：  
`components: ['emoji', 'pic', 'at']`

`title`对象的结构说明：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| leftText  | String    | 顶部左侧按钮文本 |
| titleText | String    | 顶部中间抬头文本 |
| rightText | String    | 顶部右侧按钮文本 |
| leftArrow | Boolean   | 是否显示左侧的返回箭头，IOS使用 |

返回说明：

| 参数          | 类型          | 说明      |
| --------------| --------------| ----------|
| txt           | String        | 文本内容，如'批准[微笑]， @北京研发中心'，emoji表情在文本中，由H5端自行解析。 at内容也在里面，at内容在H5端不支持点击。|
| pics          | Array[String] | 图片的本地路径，H5端不需要用它做上传，只是编辑回显的时候需要。 |
| tempFilePaths | Array[String] | 文件上传后的临时路径，由后端进行处理 |
| thumbs        | Array[String] | 图片的缩略图，直接用`<img src="">`标签加载即可 |

举个栗子：  
```javascript
FSOpen.util.openReplyPage({
    backFillData: {  
        txt: '文本内容',
        pics: ['/sdcard/1.jpg','/sdcard/2.jpg']
    },
    components: ['emoji','pic','at'], 
    title: {
        leftText: '返回',
        titleText: '标题',
        rightText: '发送',
        leftArrow: true                        
    },
    onSuccess: function(responseData) {
        console.assert(responseData.txt != null);
        console.assert(responseData.pics.length == 1);
        console.assert(responseData.tempFilePaths.length == 1);
        console.assert(responseData.thumbs.length == 1);
    }
})
``` 

##### &#10084;  打开时间选择控件    
接口说明：此接口的输入输出参数均为24小时制   
接口方法：FSOpen.util.selectDate   
调用参数：   

| 参数         | 类型      | 说明      |
| -------------| ----------| ----------|
| dateType     | String    | 时间格式  |
| defaultValue | String    | 默认值    |

`dateType`字段的结构说明：

| 值        | 格式                  | 说明          |
| ----------| ----------------------| --------------|
| month     | yyyy-MM               | 年月          |
| day       | yyyy-MM-dd            | 年月日        |
| week      | yyyy-MM-dd~yyyy-MM-dd | 周            |
| time      | HH:mm                 | 时分秒，24小时制 |
| day&#124;time | yyyy-MM-dd HH:mm      | 年月日 时分秒 |

返回说明：     

| 参数         | 类型      | 说明      |
| -------------| ----------| ----------|
| selectedDate | String    | 如果有时分秒，为24小时制 |

举个栗子：  
```javascript
FSOpen.util.selectDate({
    dateType: 'month',
    defaultValue: '2015-03-24',
    onSuccess: function(responseData) {
        console.assert(responseData.selectedDate == '2015-03-24');
    }
})
``` 

##### &#10084;  图片预览
接口方法：FSOpen.util.previewImage          
调用参数：    

| 参数      | 类型          | 说明      |
| ----------| --------------| ----------|
| imgSrc    | Array[String] | 图片地址列表 |
| thumbSrc  | Array[String] | 图片缩略图地址列表 |
| index     | Number        | 预览第几张图片，索引从0开始计算 |

举个栗子：    
```javascript
FSOpen.util.previewImage({
    imgSrc: ["http://***.png", "http://***.png"],
    thumbSrc: ["http://***.png", "http://***.png"],
    index: 1
})
``` 

##### &#10084;  文档预览
接口方法：FSOpen.util.previewDocument     
调用参数：  

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| docSrc    | String    | 文档地址  |
 
举个栗子：    
```javascript
FSOpen.util.previewDocument({
    docSrc: "http://***.doc"
})
``` 

##### &#10084;  埋点统计
接口方法：FSOpen.util.traceEvent    
调用参数：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| detail    | Object    | 统计数据内容，任意json字段  |
 
举个栗子：  
```javascript
FSOpen.util.traceEvent({
    detail: {
        m1: 'eventName',
        m2: 'Hello world',
        m3: 10
    } 
});
```

##### &#10084;  通用收藏
接口方法：FSOpen.util.favorite    
调用参数：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| title     | String    | 收藏标题 |
| desc      | String    | 收藏描述 |
| link      | String    | 收藏链接 |
| thumbUrl  | String    | 收藏内容的缩略图 |
| tagList   | Array[String] | 收藏内容的标签列表 |
 
举个栗子：  
```javascript
FSOpen.util.favorite({
    title: '纷享开放平台JSAPI',
    desc: '纷享开放平台JSAPI',
    link: location.href,
    thumbUrl: '',
    tagList: ['纷享', 'JSAPI'],
    onSuccess: function(resp) {
        console.log(resp)
    },
    onFail: function(resp) {
        console.log(resp)
    }
});
```

##### &#10084;  根据人和部门ID打开对应工作视图
接口方法：FSOpen.util.openFeed    
调用参数：

| 参数         | 类型      | 说明      |
| -------------| ----------| ----------|
| type         | String    | `user`打开用户的工作视图，`dept`打开部门的 |
| openUserId   | String    | 用户的OPEN-ID |
| departmentId | String    | 部门ID |
 
举个栗子：  
```javascript
FSOpen.util.openFeed({
    type: 'dept',
    departmentId: '1000'
});
```

##### &#10084;  将文件或图片存入网盘
接口方法：FSOpen.util.saveToFSDisk    
调用参数：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| name      | String    | 文件名 |
| path      | String    | 以`N_`开头的文件路径信息 |
 
举个栗子：  
```javascript
FSOpen.util.saveToFSDisk({
    name: '纷享逍客培训.pptx',
    path: 'N_XXXXXXX'
});
```

##### &#10084;  打开收藏界面（当前用户）
接口方法：FSOpen.util.openFavorite    
举个栗子：  
```javascript
FSOpen.util.openFavorite();
```

##### &#10084;  发起音视频电话
接口方法：FSOpen.util.openAVSession    
调用参数：

| 参数         | 类型        | 说明      |
| -------------| ------------| ----------|
| openUserId   | String      | 用户OPEN-ID |
 
举个栗子：  
```javascript
FSOpen.util.openAVSession({
    openUserId: 'FSUID_xxxxxxx'
});
```

##### &#10084;  发起音视频会议
接口方法：FSOpen.util.openAVMeeting    
调用参数：

| 参数         | 类型          | 说明      |
| -------------| --------------| ----------|
| openUserIds  | Array[String] | 用户OPEN-ID列表 |
 
举个栗子：  
```javascript
FSOpen.util.openAVMeeting({
    openUserIds: ['FSUID_xxxxxxx']
});
```

##### &#10084;  打开网盘界面（当前用户）
接口方法：FSOpen.util.openFSDisk    
举个栗子：  
```javascript
FSOpen.util.openFSDisk();
```

##### &#10084;  网盘选择文件
接口方法：FSOpen.util.chooseFileFromFSDisk    
返回说明：

| 参数      | 类型          | 说明           |
| ----------| --------------| ---------------|
| file      | Object        | 选中的文件信息 |

返回文件对象的结构说明：

| 参数      | 类型      | 说明      |
| ----------| ----------| ----------|
| id        | Number    | 文件ID |
| name      | String    | 文件名 |
| path      | String    | 以`N_`开头的文件路径信息 |
| size      | Number    | 文件大小 |
| url       | String    | 文件实际访问链接地址，先去掉，要fix这个问题 |

举个栗子：  
```javascript
FSOpen.util.chooseFileFromFSDisk({
    onSuccess: function(responseData){
        console.log(responseData.file);
    },
    onFail: function(responseData){
        console.assert(responseData.errorCode === 40004);
    }
});
```

---------------------
#### 会话  
---------------------

##### &#10084;  进入到企信会话    
接口方法：FSOpen.chat.toConversation       
调用参数：   

| 参数         | 类型          | 说明           |
| -------------| --------------| ---------------|
| type         | String        | 会话类型，值：user-多（私）人会话，dept-部门会话，app-服务号私人会话，common-通用会话ID |
| openUserIds  | Array[String] | 用户ID列表，如果只有一个将发起私人会话 |
| departmentId | String        | 部门ID |
| appId        | String        | 服务号ID |
| sessionId    | String        | 通用会话ID |

举个栗子：  
```javascript
FSOpen.chat.toConversation({
    type: 'user',
    openUserIds: ['FSUID_xxxxxxx'],
    departmentId: '1000',
    appId: 'FSAID_xxxxx',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        alert(resp);
    }
})
``` 

---------------------
#### 邮件处理  
---------------------

##### &#10084;  转发企信
接口说明：分享到企信消息里去　　
接口方法：FSOpen.mail.shareToChat    
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| url       | String    | 转发的链接地址 |
| postTime  | String    | 原企信发布时间，时间格式：yyyy-MM-dd hh:mm:ss |
| summary   | String    | 原企信摘要     |
| title     | String    | 原企信抬头     |
| sender    | String    | 企业邮箱使用，指定发件人名称 |
  
举个栗子：  
```javascript
FSOpen.mail.shareToChat({
    url: 'http://www.fxiaoke.com',
    postTime: '2016-04-28 12:51:00',
    summary: 'Hello Fxiaoke',
    title: 'Hello world'
})
``` 

##### &#10084;  转发分享    
接口说明：分享到动态流里去   
接口方法：FSOpen.mail.shareToFeed       
调用参数：  

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| url       | String    | 转发的链接地址 |
| postTime  | String    | 原企信发布时间，时间格式：yyyy-MM-dd hh:mm:ss |
| summary   | String    | 原企信摘要     |
| title     | String    | 原企信抬头     |
| sender    | String    | 企业邮箱使用，指定发件人名称 |
 
举个栗子：    
```javascript
FSOpen.mail.shareToFeed({
    url: 'http://www.fxiaoke.com',
    postTime: '2016-04-28 12:51:00',
    summary: 'Hello Fxiaoke',
    title: 'Hello world'
})
``` 

---------------------
#### 页面操作类  
---------------------

##### &#10084;  页面刷新    　　
接口方法：FSOpen.page.refresh        

举个栗子：  
```javascript
FSOpen.page.refresh();
``` 

##### &#10084;  复制页面链接    　　
接口方法：FSOpen.page.copyUrl        

举个栗子：  
```javascript
FSOpen.page.copyUrl();
``` 

##### &#10084;  当前页面链接生成二维码    　　
接口方法：FSOpen.page.generateQR        

举个栗子：  
```javascript
FSOpen.page.generateQR();
``` 

##### &#10084;  在浏览器中打开    　　
接口方法：FSOpen.page.openInBrower        

举个栗子：  
```javascript
FSOpen.page.openInBrower();
``` 

---------------------
#### 分享转发类  
---------------------

##### &#10084;  分享到动态    　　
接口方法：FSOpen.share.toFeed            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |
| type      | String    | 分享资源类型，保留备用 |
| dataUrl   | String    | 分享资源地址，配合type一起使用 |

举个栗子：  
```javascript
FSOpen.share.toFeed({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5'
});
``` 

##### &#10084;  分享到企信    　　
接口方法：FSOpen.share.toChat            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |
| type      | String    | 分享资源类型，保留备用 |
| dataUrl   | String    | 分享资源地址，配合type一起使用 |

举个栗子：  
```javascript
FSOpen.share.toChat({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5'
});
``` 

##### &#10084;  分享给CRM联系人    　　
接口方法：FSOpen.share.toCrmContact            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| link      | String    | 分享链接 |

举个栗子：  
```javascript
FSOpen.share.toCrmContact({
    link: 'http://www.fxiaoke.com'
});
``` 

##### &#10084;  分享给微信朋友   　　
接口方法：FSOpen.share.toWXFriend            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |
| type      | String    | 分享资源类型，保留备用 |
| dataUrl   | String    | 分享资源地址，配合type一起使用 |

举个栗子：  
```javascript
FSOpen.share.toWXFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5'
});
``` 

##### &#10084;  分享到微信朋友圈   　　
接口方法：FSOpen.share.toWXMoments            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |
| type      | String    | 分享资源类型，保留备用 |
| dataUrl   | String    | 分享资源地址，配合type一起使用 |

举个栗子：  
```javascript
FSOpen.share.toWXMoments({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5'
});
``` 

##### &#10084;  分享给QQ好友   　　
接口方法：FSOpen.share.toQQFriend            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |
| type      | String    | 分享资源类型，保留备用 |
| dataUrl   | String    | 分享资源地址，配合type一起使用 |

举个栗子：  
```javascript
FSOpen.share.toQQFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5'
});
``` 

##### &#10084;  分享给邮件联系人   　　
接口方法：FSOpen.share.toMail            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| link      | String    | 分享链接 |

举个栗子：  
```javascript
FSOpen.share.toMail({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com'
});
``` 

##### &#10084;  分享到短信   　　
接口方法：FSOpen.share.toSms            
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| link      | String    | 分享链接 |

举个栗子：  
```javascript
FSOpen.share.toSms({
    link: 'http://www.fxiaoke.com'
});
``` 

---------------------
#### 分享回调接口 
---------------------

纷享菜单回调是指系统内置的导航右侧3个点菜单的功能，在用户触发点击的时候的回调处理。通过此回调用户可定义要分享的内容信息。  

所有接口在用户取消分享均统一触发onFail回调，返回errorCode为400008   

##### &#10084;  分享到动态   　　
接口方法：FSOpen.menu.onShareToFeed            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToFeed({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享到会话   　　
接口方法：FSOpen.menu.onShareToChat            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToChat({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享给CRM联系人   　　
接口方法：FSOpen.menu.onShareToCrmContact            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToCrmContact({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享给微信好友   　　
接口方法：FSOpen.menu.onShareToWXFriend            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToWXFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享到微信朋友圈   　　
接口方法：FSOpen.menu.onShareToWXMoments            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToWXMoments({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享给QQ好友  　　
接口方法：FSOpen.menu.onShareToQQFriend            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| desc      | String    | 分享摘要描述 |
| link      | String    | 分享链接 |
| imgUrl    | String    | 分享缩略图地址 |

举个栗子：  
```javascript
FSOpen.menu.onShareToQQFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com'，
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享给邮件联系人  　　
接口方法：FSOpen.menu.onShareToMail            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| title     | String    | 分享标题 |
| link      | String    | 分享链接 |

举个栗子：  
```javascript
FSOpen.menu.onShareToMail({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

##### &#10084;  分享到短信  　　
接口方法：FSOpen.menu.onShareToSms            
调用参数：           

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| link      | String    | 分享链接 |

举个栗子：  
```javascript
FSOpen.menu.onShareToSms({
    link: 'http://www.fxiaoke.com',
    onSuccess: function(resp) {
        alert(resp);
    },
    onFail: function(resp) {
        if (resp.errorCode == 40008) {
            alert('用户取消分享');
        }
        alert(resp);
    }
});
``` 

---------------------
#### 通知提示类  
---------------------

##### &#10084;  显示toast    　　
接口方法：FSOpen.notification.toast        
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| icon      | String    | icon样式，有success和error，默认为空 |
| text      | String    | 提示信息 |
| duration  | Number    | 显示持续时间，单位秒，默认按系统规范 |
| delay     | Number    | 延迟显示，单位秒，默认0 |
  
举个栗子：  
```javascript
FSOpen.notification.toast({
        icon: 'success',
        text: '提示信息',
        duration: 2,
        delay: 1
    });
``` 

##### &#10084;  弹出提示alert    　　
接口方法：FSOpen.notification.alert        
调用参数：   

| 参数        | 类型      | 说明           |
| ------------| ----------| ---------------|
| title       | String    | 弹窗标题 |
| message     | String    | 消息内容 |
| buttonLabel | String    | 按钮名称 |
  
举个栗子：  
```javascript
FSOpen.notification.alert({
    message: '消息内容',
    title: '弹窗标题',
    buttonLabel: '按钮名称',
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  弹出提示confirm   　　
接口方法：FSOpen.notification.confirm        
调用参数：   

| 参数         | 类型          | 说明           |
| -------------| --------------| ---------------|
| title        | String        | 弹窗标题 |
| message      | String        | 消息内容 |
| buttonLabels | Array[String] | 按钮名称 |

返回说明：   

| 参数        | 类型      | 说明           |
| ------------| ----------| ---------------|
| buttonIndex | Number    | 被点击按钮的索引值，Number类型，从0开始 |

举个栗子：  
```javascript
FSOpen.notification.confirm({
    message: '消息内容',
    title: '弹窗标题',
    buttonLabels: ['按钮名称1', '按钮名称2'],
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  弹出提示prompt   　　
接口方法：FSOpen.notification.prompt        
调用参数：   

| 参数         | 类型          | 说明           |
| -------------| --------------| ---------------|
| title        | String        | 弹窗标题 |
| message      | String        | 消息内容 |
| buttonLabels | Array[String] | 按钮名称 |

返回说明：   

| 参数        | 类型      | 说明           |
| ------------| ----------| ---------------|
| value       | String    | 输入的值 |
| buttonIndex | Number    | 被点击按钮的索引值，Number类型，从0开始 |
  
举个栗子：  
```javascript
FSOpen.notification.prompt({
    message: '消息内容',
    title: '弹窗标题',
    buttonLabels: ['按钮名称1', '按钮名称2'],
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  震动提示vibrate  　　
接口方法：FSOpen.notification.vibrate        
调用参数：   

| 参数         | 类型          | 说明           |
| -------------| --------------| ---------------|
| duration     | Number        | 震动时间，android可配置；iOS忽略 |

举个栗子：  
```javascript
FSOpen.notification.vibrate({
    duration: 3,
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  显示预加载提示框  　　
接口说明：和hidePreloader配合使用
接口方法：FSOpen.notification.showPreloader        
调用参数：   

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| text      | String    | loading显示的字符，空表示不显示文字 |
| showIcon  | Boolean   | 是否显示icon，默认true |

举个栗子：  
```javascript
FSOpen.notification.showPreloader({
    text: '正在加载中',
    showIcon: true,
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  隐藏预加载提示框  　　
接口说明：和showPreloader配合使用
接口方法：FSOpen.notification.hidePreloader        

举个栗子：  
```javascript
FSOpen.notification.hidePreloader({
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  单选列表 　　
接口方法：FSOpen.notification.actionSheet        
调用参数：   

| 参数         | 类型      | 说明           |
| -------------| ----------| ---------------|
| title        | String    | 标题说明 |
| cancelButton | String    | 取消按钮文本 |
| othersButton | String    | 其他按钮列表 |

举个栗子：  
```javascript
FSOpen.notification.actionSheet({
    title: '标题',
    cancelButton: '取消',
    othersButton: ['湖人', '马刺', '勇士'],
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  模态窗口 　　
接口方法：FSOpen.notification.modal        
调用参数：   

| 参数         | 类型      | 说明           |
| -------------| ----------| ---------------|
| title        | String    | 标题说明 |
| image        | String    | 图片地址 |
| content      | String    | 窗口内容 |
| buttonLabels | String    | 其他按钮列表 |

举个栗子：  
```javascript
FSOpen.notification.modal({
    title: '标题',
    image: '',
    content: '我是文本内容',
    buttonLabels: ['了解更多', '就这样吧'],
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

---------------------
#### UI相关类  
---------------------

##### &#10084;  启用下拉刷新 　　
接口方法：FSOpen.ui.pullRefresh.enable    
调用参数：   

| 参数          | 类型          | 说明      |
| --------------| --------------| ----------|
| onPullRefresh | Function      | 下拉刷新回调 |

`onPullRefresh`的回调参数说明：

| 参数       | 类型      | 说明      |
| -----------| ----------| ----------|
| state      | Object    | 当前下拉阶段 |

举个栗子：  
```javascript
FSOpen.ui.pullRefresh.enable({
    onPullRefresh: function(resp) {
        _alert(resp);
    },
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  禁用下拉刷新 　　
接口方法：FSOpen.ui.pullRefresh.disable        
举个栗子：  
```javascript
FSOpen.ui.pullRefresh.disable();
``` 

##### &#10084;  收起下拉刷新 　　
接口方法：FSOpen.ui.pullRefresh.stop        
举个栗子：  
```javascript
FSOpen.ui.pullRefresh.stop();
``` 

##### &#10084;  启用Bounce   　　
接口说明：启用Webview的弹性效果，仅支持ios
接口方法：FSOpen.ui.bounce.enable        
举个栗子：  
```javascript
FSOpen.ui.bounce.enable();
``` 

##### &#10084;  禁用Bounce   　　
接口说明：禁用Webview的弹性效果，仅支持ios
接口方法：FSOpen.ui.bounce.disable        
举个栗子：  
```javascript
FSOpen.ui.bounce.disable();
``` 

---------------------
#### 地图  
---------------------

##### &#10084;  获取当前地理位置       　　
接口方法：FSOpen.geolocation.get        
返回说明：

| 参数      | 类型      | 说明           |
| ----------| ----------| ---------------|
| accuracy  | Number    | 实际的定位精度半径（单位米） |
| address   | String    | 格式化地址，如：深圳市南山区大冲商务中心 |
| country   | String    | 国家           |
| province  | String    | 省份，如：广东省        |
| city      | String    | 城市，如：深圳市。直辖市会返回空 |
| district  | String    | 行政区，如：南山区      |
| street    | String    | 街道，如：铜鼓路10000号 |

举个栗子：  
```javascript
FSOpen.geolocation.get({});
``` 

##### &#10084;  地图定位    　　
接口方法：FSOpen.map.locate        
调用参数：   

| 参数         | 类型      | 说明           |
| -------------| ----------| ---------------|
| latitude     | Number    | 标准维度 |
| longitude    | Number    | 标准经度 |

返回说明：

| 参数         | 类型      | 说明           |
| -------------| ----------| ---------------|
| latitude     | Number    | POI的标准维度  |
| longitude    | Number    | POI的标准经度  |
| title        | String    | POI的名称      |
| province     | String    | POI所在省，可能为空 |
| provinceCode | String    | POI所在省编码，可能为空 |
| city         | String    | POI所在城市，可能为空 |
| cityCode     | String    | POI所在城市的编码，可能为空 |
| district     | String    | POI所在区，可能为空 |
| districtCode | String    | POI所在区的编码，可能为空 |
| postCode     | String    | POI的邮编，可能为空 |
| street       | String    | POI的街道地址，可能为空 |

举个栗子：  
```javascript
FSOpen.map.locate({
    latitude: 39.903578,
    longitude: 116.473565,
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 

##### &#10084;  位置显示    　　
接口方法：FSOpen.map.show        
调用参数：   

| 参数         | 类型      | 说明           |
| -------------| ----------| ---------------|
| latitude     | Number    | 标准维度 |
| longitude    | Number    | 标准经度 |
| title        | String    | 在地图锚点气泡显示的文本 |

举个栗子：  
```javascript
FSOpen.map.show({
    latitude: 39.903578,
    longitude: 116.473565,
    title: '纷享逍客深研基地',
    onSuccess: function(resp) {
        _alert(resp)
    },
    onFail: function(resp) {
        _error(resp)
    }
});
``` 


### Webview控制参数列表 

| 参数名称        | 类型      | 说明         |
| ----------------| ----------| -------------|
| fs_nav_title    | String    | 控制导航栏标题文字，上限30个字 |
| fs_nav_bgcolor  | String    | 控制导航栏颜色，格式为：RRGGBBAA，如：FAFAFAFF |
| fs_nav_pbcolor  | String    | 控制导航栏进度条颜色，格式为：RRGGBBAA，如：FAFAFAFF |
| fs_nav_fsmenu   | Boolean   | 控制是否显示纷享菜单，true为显示，false为不显示，默认显示 |
| fs_auth         | Boolean   | 控制是否需二次鉴权，如果为true则需要，否则不需要，默认false |
| fs_auth_appname | String    | 二次授权的应用名，只有在需要二次授权时使用，非空值需要进行URL encode |


### 接口汇总

| 接口名称                  | 需要授权  | Android支持情况 | Ios支持情况 | 功能说明      |
| --------------------------| ----------| ----------------| ------------| --------------|
| runtime.getVersion        |     N     | 5.3             | 5.3         | 获取终端版本号 |
| runtime.showUpdate        |     N     | 5.4             | 5.4         | 升级提示说明  |
| launcher.launchApp        |     N     | 5.4             | 5.4         | 启动第三方应用 |
| launcher.checkAppInstalled|     N     | 5.4             | 5.4         | 检查第三方应用是否安装 |
| contact.choose            |     Y     | 5.3             | 5.3         | 从通讯录里同时显示选择人员、部门和群组会话 |
| contact.chooseUser        |     Y     | 5.3             | 5.3         | 从通讯录里选择人员 |
| contact.chooseDepartment  |     Y     | 5.3             | 5.3         | 从通讯录里选择部门 |
| contact.showProfile       |     Y     | 5.3             | 5.3         | 跳到个人主页 |
| contact.showDepartment    |     Y     | 5.3             | 5.3         | 跳到部门主页 |
| contact.getUserInfo       |     Y     | 5.3             | 5.3         | 根据openid获取用户信息 |
| contact.getAppInfo        |     Y     | 5.3             | 5.3         | 获取服务号信息 |
| mail.shareToFeed          |     N     | 5.4             | 5.4         | 邮件分享到动态 |
| mail.shareToChat          |     N     | 5.4             | 5.4         | 邮件分享到企信 |
| page.refresh              |     N     | 5.4             | 5.4         | 页面刷新 |
| page.copyUrl              |     N     | 5.4             | 5.4         | 复制当前页面链接 |
| page.generateQR           |     N     | 5.4             | 5.4         | 当前页面生成二维码 |
| page.openInBrower         |     N     | 5.4             | 5.4         | 在浏览器中打开 |
| share.toChat              |     Y     | 5.4             | 5.4         | 转发到企信 |
| share.toFeed              |     Y     | 5.4             | 5.4         | 转发到动态 |
| share.toCrmContact        |     Y     | 5.4             | 5.4         | 分享给crm联系人 |
| share.toWXFriend          |     Y     | 5.4             | 5.4         | 分享给微信好友 |
| share.toWXMoments         |     Y     | 5.4             | 5.4         | 分享到微信朋友圈 |
| share.toQQFriend          |     Y     | 5.4             | 5.4         | 分享给QQ好友 |
| share.toMail              |     Y     | 5.4             | 5.4         | 分享给邮件联系人 |
| share.toSms               |     Y     | 5.4             | 5.4         | 分享给短信联系人 |
| menu.onShareToChat        |     Y     | 5.4             | 5.4         | 转发到企信 |
| menu.onShareToFeed        |     Y     | 5.4             | 5.4         | 转发到动态 |
| menu.onShareToCrmContact  |     Y     | 5.4             | 5.4         | 分享给crm联系人 |
| menu.onShareToWXFriend    |     Y     | 5.4             | 5.4         | 分享给微信好友 |
| menu.onShareToWXMoments   |     Y     | 5.4             | 5.4         | 分享到微信朋友圈 |
| menu.onShareToQQFriend    |     Y     | 5.4             | 5.4         | 分享给QQ好友 |
| menu.onShareToMail        |     Y     | 5.4             | 5.4         | 分享给邮件联系人 |
| menu.onShareToSms         |     Y     | 5.4             | 5.4         | 分享给短信联系人 |
| chat.toConversation       |     Y     | 5.4             | 5.4         | 发起聊天会话 |
| pay.request               |     Y     | 5.3             | 5.3         | 调起支付页面 |
| pay.showWallet            |     Y     | 5.3             | 5.3         | 跳到钱包页面 |
| device.authenticateUser   |     Y     | 5.3             | 5.3         | 用户鉴权      |
| device.setOrientation     |     N     | 5.3             | 5.3         | 屏幕控制      |
| device.scan               |     N     | 5.4             | 5.4         | 调用扫码      |
| device.getUUID            |     Y     | 5.4             | 5.4         | 获取通用唯一识别码 |
| device.getNetwork         |     Y     | 5.4             | 5.4         | 获取网络类型  |
| device.getAP              |     Y     | 5.4             | 5.4         | 获取热点信息  |
| notification.toast        |     N     | 5.4             | 5.4         | 显示toast |
| notification.alert        |     N     | 5.4             | 5.4         | 显示toast |
| notification.confirm      |     N     | 5.4             | 5.4         | 显示toast |
| notification.prompt       |     N     | 5.4             | 5.4         | 显示toast |
| notification.vibrate      |     N     | 5.4             | 5.4         | 显示toast |
| notification.showPreloader|     N     | 5.4             | 5.4         | 显示toast |
| notification.hidePreloader|     N     | 5.4             | 5.4         | 显示toast |
| notification.actionSheet  |     N     | 5.4             | 5.4         | 显示toast |
| notification.modal        |     N     | 5.4             | 5.4         | 显示toast |
| ui.pullRefresh.enable     |     N     | 5.4             | 5.4         | 显示toast |
| ui.pullRefresh.disable    |     N     | 5.4             | 5.4         | 显示toast |
| ui.pullRefresh.stop       |     N     | 5.4             | 5.4         | 显示toast |
| ui.bounce.enable          |     N     | 5.4             | 5.4         | 显示toast |
| ui.bounce.disable         |     N     | 5.4             | 5.4         | 显示toast |
| util.favorite             |     Y     | 5.4             | 5.4         | 收藏 |
| util.uploadFile           |     Y     | 5.4             | 5.4         | 上传文件 |
| util.uploadImage          |     Y     | 5.3             | 5.3         | 上传图片 |
| util.getLocation          |     Y     | 5.3             | 5.3         | 获取当前地理位置 |
| util.traceEvent           |     N     | 5.3             | 5.3         | 埋点统计 |
| util.closeWebView         |     N     | 5.3             | 5.3         | 关闭当前页面(WebView) |
| util.openWindow           |     N     | 5.3             | 5.3         | 跳转到应用内外(WebView) |
| util.openWindowForResult  |     N     | 5.3             | 5.3         | 删除--打开新窗口(WebView) |
| util.openContextMenu      |     N     | 5.4             | 5.4         | 删除--打开上下文菜单 |
| util.openReplyPage        |     N     | 5.3             | 5.3         | 打开回复输入框 |
| util.selectDate           |     N     | 5.3             | 5.3         | 打开时间选择控件 |
| util.previewImage         |     N     | 5.3             | 5.3         | 图片预览 |
| util.previewDocument      |     N     | 5.4             | 5.4         | 文档预览 |
| geolocation.get       |     N     | 5.3             | 5.3         | 设置标题栏标题 |
| map.locate |     N     | 5.3             | 5.3         | 设置标题栏左侧返回按钮的文字 |
| map.show   |     N     | 5.3             | 5.3         | 注册标题栏右侧文字按钮 |
| navigation.setTitle       |     N     | 5.3             | 5.3         | 设置标题栏标题 |
| navigation.setBackBtnText |     N     | 5.3             | 5.3         | 设置标题栏左侧返回按钮的文字 |
| navigation.setLeftBtn    |     N     | 5.3             | 5.3         | 注册标题栏右侧文字按钮 |
| navigation.addRightBtn    |     N     | 5.3             | 5.3         | 注册标题栏右侧文字按钮 |
| navigation.setRightBtn    |     N     | 5.3             | 5.3         | 注册标题栏右侧文字按钮 |
| navigation.deleteAllRightBtns |     N     | 5.3         | 5.3         | 删除标题栏上所有右侧按钮 |
| navigation.showFSMenu     |     N     | 5.4             | 5.4         | 显示系统菜单栏 |
| navigation.hideFSMenu     |     N     | 5.4             | 5.4         | 隐藏系统菜单栏 |
| permission.requestAuthCode|     Y     | 5.4             | 5.4         | 请求免登授权码 |


### 调试技巧

* [各种 真机远程调试 方法 汇总](https://github.com/jieyou/remote_inspect_web_on_real_device)
* [移动端Web开发调试之Chrome远程调试(Remote Debugging)](http://blog.csdn.net/freshlover/article/details/42528643)
* [Browersync](https://browsersync.io/docs/)






 


















    

