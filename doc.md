## 基本使用方法

1. 引入JSAPI库

    `<script src="http://www.fxiaoke.com/open/jsapi/1.0.0/jsapi.min.js"></script>` 

    或者（仅限内部开发使用，保持最新）

    `<script src="http://open.fsfte2.com/open/jsapi/2.0.0/fsapi.min.js"></script>`

2. 配置应用参数

    ```javascript
    FSOpen.config({
        appId: 'FSAID_1313de7',
        timestamp: 1463564391382,
        nonceStr: 'HUsfdsOIIejfoweu2u283',
        signature: '1520C2C8223BC8D46525639743E54659CDD7B163',
        jsApiList: [
            'service.contact.select',
            'service.contact.selectUser',
            'service.contact.selectDepartment'
        ]
    });
    ``` 

    说明：如果第三方应用不涉及JSAPI授权校验相关，可不配置此相关接口。   

3. 通过`FSOpen.ready`和`FSOpen.error`来监听初始化成功或者失败

    ```javascript
    FSOpen.ready(function(bridge){
        console.log('FS LOG:', FSOpen.version);
        // do yourself init;
    });
    FSOpen.error(function(error){
        if (error.errorCode === 30000) {
            alert('5.3以下版本，需要更新');
        } else {
            alert('初始化失败：' + JSON.stringify(error));
        }
    });
    ``` 

    当然，还可以直接使用链式调用：
    
    ```javascript
    // 如果你不需要调用授权接口，不需要配置`config`，
    // 但是`ready`接口请无论如何都不要忘记调用
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
            alert('初始化失败：' + JSON.stringify(error));
        }
    });
    ``` 

## 基本配置说明

#### 全局参数配置
功能说明：用作api授权验证  
参数说明：  

| 参数名        | 类型          | 必须  |
| ------------- |:-------------:| -----:|
| appId         | String        |     Y |
| timestamp     | Long          |     Y |
| nonceStr      | String        |     Y |
| signature     | String        |     Y |
| jsApiList     | List<String>  |     Y |

#### 日志接口配置
功能说明：为了方便外部调试，将内部调试内容输出  
回调参数说明：

| 参数名        | 类型          | 必须  |
| ------------- |:-------------:| -----:|
| message       | String        |     Y |
| logData       | Object        |     N |

## 接口调用

#### 接口调用说明

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
| 40000     | 接口调用参数错误                                 |
| 40001     | JSTICKET签名校验失败                             |
| 40003     | JSAPI接口授权失败                                |
| 40004     | JSAPI接口不存在                                  |
| 40006     | 设备授权失败                                     |
| 40010     | 资源查询失败，比如APP内部访问联系人失败          |
| 40050     | 通用UI取消操作，即用户取消行为                   |
| 40051     | 终端操作等待状态                                 |
| 40052     | 通用接口调用失败                               |
| 404**     | 40400-40449对应着HTTP状态的400-449状态           |
| 405**     | 40500-40510对应着HTTP状态的500-510状态           |
| 50000     | 未知错误。目前此错误码不做任何回调处理（可认为是成功）|

## 接口调用列表

### 容器  

##### 获取终端版本号   
5.3.0   

```javascript
FSOpen.runtime.getVersion({
    onSuccess: function(resp){
        console.assert(resp.ver !== undefined);
        console.assert(parseFloat(resp.ver) > 5.2);
    },
    onFail: function(error){
        alert('您的应用不支持JSAPI，请升级');
    }
});
```

接口方法：FSOpen.runtime.getVersion  
返回成功说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| ver       | String      | 版本号信息，如'5.3.0' |


##### 获取当前登录用户信息   
5.4.0   

```javascript
FSOpen.runtime.getCurrentUser({
    onSuccess: function(resp){
        console.assert(resp.user !== undefined);
    },
    onFail: function(error){
        alert('您的应用不支持JSAPI，请升级');
    }
});
```

接口方法：FSOpen.runtime.getCurrentUser  
返回成功说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| user      | Object      | 返回的当前用户的具体信息，详细字段如下 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 当前用户OPEN-ID  |
| nickname  | String        | 当前用户昵称     |
| email     | String        | 当前用户电子邮箱 |
| avatarUrl | String        | 当前用户头像     |
| position  | String        | 当前用户职位信息 |


##### 获取免登授权码
5.4.0  

```javascript
FSOpen.runtime.requestAuthCode({
    onSuccess: function(resp) {
        console.assert(resp.code !== undefined);
        console.assert(resp.userId !== undefined);
    },
    onFail: function(error) {
        error = error || {};
        alert('操作失败，错误码：' + error.errorCode);
    }
});
```  

接口方法：FSOpen.runtime.requestAuthCode   
返回成功说明：  

| 参数       | 类型        | 说明                |
| -----------| ------------| --------------------|
| code       | String      | 授权码 |
| userId     | String      | 当前登录用户的open user-id |


##### 终端升级提示    
5.4.0

```javascript
FSOpen.runtime.showUpdate({
    message: '当前版本有更新'
});
``` 

接口方法：FSOpen.runtime.showUpdate   
调用参数：  

| 参数      | 类型        | 必须 | 说明                |
| ----------| ------------| -----| --------------------|
| message   | String      | 是   | 升级提示文本 |


---------------------
### 设备类  
---------------------

##### 应用二次认证       
5.3.0
  
```javascript
FSOpen.device.authenticateUser({
    appName: '战报助手',
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

接口方法：FSOpen.device.authenticateUser   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| appName   | String      | 是   | 当前应用名字 |


##### 获取热点信息    
5.4.0   

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

接口方法：FSOpen.device.getAP   
返回成功说明：  

| 参数       | 类型        | 说明                |
| -----------| ------------| --------------------|
| ssid       | String      | 热点SSID            |
| macAddress | String      | 热点MAC地址         |


##### 获取网络类型      
5.4.0  
 
```javascript
FSOpen.device.getNetworkType({
    onSuccess: function(resp) {
        // network: '3g'
        console.assert(resp.network !== undefined);
    }
});
``` 

接口方法：FSOpen.device.getNetworkType   
返回成功说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| network   | String      | 网络类型，2g/3g/4g/wifi/unknown/none，none表示离线|


##### 获取通用唯一识别码     
5.4.0  

```javascript
FSOpen.device.getUUID({
    onSuccess: function(resp) {
        // uuid: '"FD71A168-1CAD-4EF1-BECC-52997124207A'
        console.assert(resp.uuid !== undefined);
    }
});
``` 

接口方法：FSOpen.device.getUUID   
返回成功说明：  

| 参数      | 类型        | 说明                |
| ----------| ------------| --------------------|
| uuid      | String      | 本机唯一识别码          |


##### 调用扫码     
5.4.0

```javascript
FSOpen.device.scan({
    onSuccess: function(resp) {
        // text: 'https://www.fxiaoke.com/'
        console.log(resp.text !== undefined);
    }
});
``` 

接口方法：FSOpen.device.scan   
返回成功说明：  

| 参数        | 类型        | 说明                |
| ------------| ------------| --------------------|
| text        | String      | 扫码内容            |


##### 设备震动     
5.4.0

```javascript
FSOpen.device.vibrate({
    duration: 3000
});
``` 

接口方法：FSOpen.device.vibrate   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| duration  | Number      | 否   | 震动时间，只对Android有效。单位毫秒，默认3秒。 |


### 启动器  

##### 检测应用是否安装
5.4.0  

```javascript
FSOpen.launcher.checkAppInstalled({
    scheme: 'taobao',
    pkgName: 'com.alibaba.taobao',
    onSuccess: function(resp) {
        // installed: true
        console.assert(resp.installed === true);
    }
});
``` 

接口方法：FSOpen.launcher.checkAppInstalled   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| scheme    | String      | 是   | iOS使用，应用scheme |
| pkgName   | String      | 是   | Android使用，应用包名 |

返回成功说明：  

| 参数      | 类型            | 说明                |
| ----------| ----------------| --------------------|
| installed | Boolean         | 检测结果 |


##### 启动第三方应用    
5.4.0  

```javascript
FSOpen.launcher.launchApp({
    scheme: 'taobao',
    pkgName: 'com.alibaba.taobao',
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        if (error.errorCode === 40010) {
            alert('未安装该应用');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.launcher.launchApp   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| scheme    | String      | 是   | iOS使用，应用scheme |
| pkgName   | String      | 是   | Android使用，应用包名 |


### Webview  

---------------------
#### 控制参数列表 
---------------------

Webview控制参数是指当前页面所打开的链接里的参数信息，用于在页面请求前就可以做一些UI、安全相关的控制，提高用户体验。目前已有的参数列表如下：  

| 参数            | 类型    | 说明                      |
| ----------------| --------| --------------------------|
| fs_nav_title    | String  | 控制导航栏标题文字，上限30个字 |
| fs_nav_bgcolor  | String  | 控制导航栏颜色，格式为：RRGGBBAA，如：FAFAFAFF |
| fs_nav_pbcolor  | String  | 控制导航栏进度条颜色，格式为：RRGGBBAA，如：FAFAFAFF |
| fs_nav_fsmenu   | Boolean | 控制是否显示纷享菜单，true为显示，false为不显示，默认显示 |
| fs_auth         | Boolean | 控制是否需二次鉴权，如果为true则需要，否则不需要，默认false |
| fs_auth_appname | String  | 二次授权的应用名，只有在需要二次授权时使用，非空值需要进行URL encode |


---------------------
#### Webview跳转 
---------------------

##### 页面回退
5.4.0

```javascript
FSOpen.webview.back({
});
``` 

接口方法：FSOpen.webview.back      


##### 页面关闭
5.4.0

```javascript
FSOpen.webview.close({
    extras: {
        data: 1
    }
});
``` 

接口方法：FSOpen.webview.close      
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| extras    | Object      | 否   | 如果当前页面是通过`webview.open`接口打开，调用此接口在关闭页面的时候可通过此参数回传一些自定义数据到原先的页面，一般用于新增数据的回传 |


##### 页面打开
5.4.0

```javascript
FSOpen.webview.open({
    url: 'https://www.fxiaoke.com/jsapi-demo',
    onClose: function() {
        alert('Close new window');
    }
});
``` 

接口方法：FSOpen.webview.open      
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| url       | String      | 是   | 需要打开的页面链接地址 |
| onClose   | Function    | 是   | 打开的页面关闭后的回调。如果通过此接口打开的窗口页面里，通过`webview.close`接口来关闭页面的话，可以指定关闭后的回传参数`extras` |


##### 页面的物理键回退拦截
5.4.0

> 仅Android适用。Android物理返回键返回上个页面时被调用。

```javascript
FSOpen.webview.onBackWebview({
    onBack: function() {
        alert('我要关闭了！');
        FSOpen.webview.close();
    }
});
``` 

接口方法：FSOpen.webview.onBackWebview      
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| onBack    | Function    | 是   | 物理键点击事件回调 |

##### 导航的返回键回退拦截
5.4.0

> Webview窗口被关闭时回调，包括顶部栏关闭按钮及物Android物理返回键关闭。

```javascript
FSOpen.webview.onCloseWebview({
    onClose: function() {
        alert('我要关闭了！');
        FSOpen.webview.close();
    }
});
``` 

接口方法：FSOpen.webview.onCloseWebview      
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| onClose   | Function    | 是   | 物理键点击事件回调 |


---------------------
#### 屏幕控制 
---------------------

##### 屏幕控制
5.4.0

```javascript
FSOpen.webview.setOrientation({
    orientation: 'portrait'
});
``` 

接口方法：FSOpen.webview.setOrientation      
调用参数：  

| 参数        | 类型        | 必须 | 说明         |
| ------------| ------------| -----| -------------|
| orientation | String      | 否   | portrait竖屏，landscape横屏。默认为portrait。 |


---------------------
#### 导航栏 
---------------------

##### 删除右侧按钮组
5.4.0  
注意此接口只会删除掉用户自定义添加的按钮组，不会删除纷享菜单  

```javascript
FSOpen.webview.navbar.removeRightBtns();
``` 

接口方法：FSOpen.webview.navbar.removeRightBtns      

##### 隐藏纷享菜单
5.4.0    

```javascript
FSOpen.webview.navbar.hideMenu();
``` 

接口方法：FSOpen.webview.navbar.hideMenu      

##### 定制左侧按钮
5.4.0    

```javascript
FSOpen.webview.navbar.setLeftBtn({
    text: '关闭',
    onClick: function() {
        FSOpen.webview.close();
    }
});
``` 

接口方法：FSOpen.webview.navbar.setLeftBtn        
调用参数：

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| text      | String      | 是   | 定制按钮的文本 |
| onClick   | Function    | 否   | 定制按钮的点击回调，如果没有此参数将默认是关闭窗口 |

##### 定制右侧按钮组
5.4.0    

```javascript
FSOpen.webview.navbar.setRightBtns({
    items: [
        {btnId: '1', icon: 'fav', text: '收藏'},
        {btnId: '2', icon: 'add', text: '添加'}
    ],
    onClick: function(resp) {
        // {btnId: '1'}
        console.assert(resp.btnId !== undefined);
    }
});
``` 

接口方法：FSOpen.webview.navbar.setRightBtns        
调用参数：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| items     | Array[Object] | 是   | 定制按钮的属性数组 |
| onClick   | Function      | 否   | 定制按钮的点击回调 |

`items`单项字段说明：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| btnId     | String    | 是   | 每个item的唯一标示 |
| icon      | String    | 否   | 预置icon的值，优先级高于`text`参数，即优先显示图标 |
| text      | String    | 否   | 每个item的文本属性 |

`icon`属性的值对应关系：

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

 `onClick`点击回调参数属性说明：

 | 参数      | 类型          | 说明     |
 | ----------| --------------| ---------|
 | btnId     | String        | item的id |

##### 定制标题
5.4.0    

```javascript
FSOpen.webview.navbar.setTitle({
    title: '纷享JSAPI'
});
``` 

接口方法：FSOpen.webview.navbar.setTitle        
调用参数：

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 要显示的标题文本，默认为空 |

##### 定制中间图标按钮
5.4.0    

```javascript
FSOpen.webview.navbar.setMiddleBtn({
    onClick: function() {
        FSOpen.webview.open('https://www.fxiaoke.com/aboutus/index.html');
    }
});
``` 

接口方法：FSOpen.webview.navbar.setMiddleBtn        
调用参数：

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| onClick   | Function    | 否   | 定制按钮的点击回调 |

##### 显示纷享菜单
5.4.0    
> 此接口的每个分享功能都可定制分享参数，具体见[Webview-纷享菜单]()

```javascript
FSOpen.webview.navbar.showMenu({
    menuList: [
        'service:favorite',
        'share:toConversation',
        'share:toFeed',
        'separator',
        'share:toCRMContact',
        'share:toWXFriend',
        'share:toWXMoments',
        'share:toQQFriend',
        'share:viaMail',
        'share:viaSMS',
        'separator',
        'page:refresh',
        'page:copyURL',
        'page:generateQR',
        'page:openWithBrowser'
    ]
});
``` 

接口方法：FSOpen.webview.navbar.showMenu          
调用参数：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| menuList  | Array[String] | 是   | 定制的菜单项`menuItem`列表，默认全部显示 |

`menuItem`说明：

| 参数                 | 说明             |
| ---------------------| -----------------|
| service:favorite     | 收藏当前页面     |
| share:toConversation | 转发到企信       |
| share:toFeed         | 转发到工作流     |
| share:toCRMContact   | 转发给CRM联系人  |
| share:toWXFriend     | 分享给微信好友   |
| share:toWXMoments    | 分享到微信朋友圈 |
| share:toQQFriend     | 分享给QQ好友     |
| share:viaMail        | 通过邮件转发     |
| share:viaSMS         | 通过短信转发     |
| page:refresh         | 页面刷新         |
| page:copyURL         | 复制链接         |
| page:generateQR      | 生成二维码       |
| page:openWithBrowser | 在浏览器中打开   |
| separator            | 分隔符，用来分组菜单项 |


---------------------
#### 纷享菜单 
---------------------

此系列接口对应系统内置的导航右侧3个点菜单（即**纷享菜单**）的分享转发功能，在用户触发点击的时候的回调处理。通过此回调用户可定义要分享转发出去的内容信息。

##### 转发到企信     
5.4.0

```javascript
FSOpen.webview.menu.onShareToConversation({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToConversation   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| desc      | String      | 否   | 分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 转发给CRM联系人     
5.4.0

```javascript
FSOpen.webview.menu.onShareToCRMContact({
    link: location.href,
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToCRMContact   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| link      | String      | 否   | 要转发的页面链接 |

##### 转发到工作流     
5.4.0

```javascript
FSOpen.webview.menu.onShareToFeed({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToFeed   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| desc      | String      | 否   | 分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 通过邮件转发     
5.4.0

```javascript
FSOpen.webview.menu.onShareViaMail({
    title: '纷享逍客',
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareViaMail   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 转发邮件标题 |
| content   | String      | 否   | 转发邮件内容，可使用{url}替换符来表示当前页面的url |

##### 分享给QQ好友     
5.4.0

```javascript
FSOpen.webview.menu.onShareToQQFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToQQFriend   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| desc      | String      | 否   | 分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 通过短信转发     
5.4.0

```javascript
FSOpen.webview.menu.onShareViaSMS({
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareViaSMS   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| content   | String      | 否   | 转发内容，最多140字，可使用{url}替换符来表示当前页面的url |

##### 分享给微信好友     
5.4.0

```javascript
FSOpen.webview.menu.onShareToWXFriend({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToWXFriend   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 分享到微信朋友圈     
5.4.0

```javascript
FSOpen.webview.menu.onShareToWXMoments({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.webview.menu.onShareToWXMoments   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |


---------------------
#### 页面 
---------------------

##### 复制链接     
5.4.0

```javascript
FSOpen.webview.page.copyURL();
``` 

接口方法：FSOpen.webview.page.copyURL   

##### 生成二维码     
5.4.0

```javascript
FSOpen.webview.page.generateQR();
``` 

接口方法：FSOpen.webview.page.generateQR   

##### 在浏览器中打开     
5.4.0

```javascript
FSOpen.webview.page.openWithBrowser();
``` 

接口方法：FSOpen.webview.page.openWithBrowser   

##### 页面刷新     
5.4.0

```javascript
FSOpen.webview.page.refresh();
``` 

接口方法：FSOpen.webview.page.refresh  


---------------------
#### Bounce 
---------------------

> 此类接口仅限于IOS系统

##### 启用webview的bounce效果     
5.4.0

```javascript
FSOpen.webview.bounce.enable();
``` 

接口方法：FSOpen.webview.bounce.enable   

##### 禁用webview的bounce效果     
5.4.0

```javascript
FSOpen.webview.bounce.disable();
``` 

接口方法：FSOpen.webview.bounce.disable   

---------------------
#### 下拉刷新 
---------------------

##### 启用下拉刷新     
5.4.0

```javascript
FSOpen.webview.pullRefresh.enable({
    onPullRefresh: function() {
        $.ajax({
            url: '/support/articles/',
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function() {
                FSOpen.webview.pullRefresh.stop();
            },
            error: function() {
            }
        });
    }
});
``` 

接口方法：FSOpen.webview.pullRefresh.enable   
调用参数：

| 参数          | 类型     | 必须 | 说明         |
| --------------| ---------| -----| -------------|
| onPullRefresh | Function | 否   | 下拉到临界值时触发的回调。可在此回调里进行一些延时操作，并在延时操作完毕后通过对应的`webview.pullRefresh.stop`来还原 |   

##### 禁用下拉刷新     
5.4.0

```javascript
FSOpen.webview.pullRefresh.disable();
``` 

接口方法：FSOpen.webview.pullRefresh.disable   

##### 收起下拉刷新     
5.4.0

```javascript
FSOpen.webview.pullRefresh.stop();
``` 

接口方法：FSOpen.webview.pullRefresh.stop   


---------------------
#### 弹层 
---------------------

##### 显示单选列表(actionSheet)     
5.4.0

```javascript
FSOpen.widget.showActionSheet({
    title: '标题',
    cancelBtnLabel: '取消',
    actionBtnLabels: ['湖人', '马刺', '火箭'],
    onSuccess: function(resp) {
        if (resp.actionIndex == 0) {
            alert('选择了湖人');
        } else if (resp.actionIndex == 1) {
            alert('选择了马刺');
        } else {
            alert('选择了火箭');
        }
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showActionSheet   
调用参数：  

| 参数            | 类型          | 必须 | 说明         |
| ----------------| --------------| -----| -------------|
| title           | String        | 否   | 标题说明。如果为空，Android系统默认显示“选项”，ios系统不显示 |
| cancelBtnLabel  | String        | 否   | 取消选择按钮文本，默认为“取消” |
| actionBtnLabels | Array[String] | 是   | 选择按钮文本列表 |

返回成功说明：

| 参数        | 类型      | 说明     |
| ------------| ----------| ---------|
| actionIndex | Number    | 选择的索引号，从0开始 |

##### 显示Alert     
5.4.0

```javascript
FSOpen.widget.showAlert({
    title: '标题',
    content: '消息内容',
    btnLabel: '朕知道了',
    onSuccess: function(resp) {
        // return nothing
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showAlert   
调用参数：  

| 参数     | 类型      | 必须 | 说明         |
| ---------| ----------| -----| -------------|
| title    | String    | 否   | 弹窗标题说明 |
| content  | String    | 否   | 弹窗消息内容 |
| btnLabel | String    | 否   | 弹窗按钮文本，默认“OK” |

##### 显示Confirm     
5.4.0

```javascript
FSOpen.widget.showConfirm({
    title: '标题',
    content: '消息内容',
    btnLabels: ['朕知道了','朕不知道'],
    onSuccess: function(resp) {
        if (resp.btnIndex == 0) {
            alert('朕知道了');
        } else {
            alert('朕不知道');
        }
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showConfirm   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| title     | String    | 否   | 弹窗标题说明 |
| content   | String    | 否   | 弹窗消息内容 |
| btnLabels | String    | 是   | 弹窗按钮左右两个文本 |

返回成功说明：

| 参数     | 类型     | 说明     |
| ---------| ---------| ---------|
| btnIndex | Number   | 点击的按钮索引，从0开始 |

##### 隐藏预加载提示框     
5.4.0

```javascript
FSOpen.widget.hidePreloader();
``` 

接口方法：FSOpen.widget.hidePreloader   

##### 显示模态框     
5.4.0

```javascript
FSOpen.widget.showModal({
    title: '标题',
    imgUrl: '',
    content: '我是一个模态窗口内容',
    btnLabels: ['朕知道了','朕不知道'],
    onSuccess: function(resp) {
        if (resp.btnIndex == 0) {
            alert('朕知道了');
        } else {
            alert('朕不知道');
        }
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showModal   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| title     | String    | 否   | 弹窗标题说明 |
| imgUrl    | String    | 否   | 弹窗图片内容，默认为空不显示 |
| content   | String    | 否   | 弹窗文本内容，默认为空 |
| btnLabels | String    | 是   | 弹窗按钮左右两个文本 |

返回成功说明：

| 参数     | 类型     | 说明     |
| ---------| ---------| ---------|
| btnIndex | Number   | 点击的按钮索引，从0开始 |

##### 显示Prompt     
5.4.0

```javascript
FSOpen.widget.showPrompt({
    title: '标题',
    content: '消息内容',
    btnLabels: ['朕知道了','朕不知道'],
    onSuccess: function(resp) {
        if (resp.btnIndex == 0) {
            alert('朕知道了');
        } else {
            alert('朕不知道');
        }
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showPrompt   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| title     | String    | 否   | 弹窗标题说明 |
| content   | String    | 否   | 弹窗消息内容 |
| btnLabels | String    | 是   | 弹窗按钮左右两个文本 |

返回成功说明：

| 参数     | 类型     | 说明     |
| ---------| ---------| ---------|
| btnIndex | Number   | 点击的按钮索引，从0开始 |
| value    | String   | 弹窗输入框的值 |

##### 显示预加载提示框     
5.4.0

```javascript
FSOpen.widget.showPreloader({
    text: '正在加载中',
    icon: true,
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        // do sth
    }
});
``` 

接口方法：FSOpen.widget.showPreloader   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| text      | String    | 否   | loading显示的文本，空表示不显示文字 |
| icon      | Boolean   | 否   | 是否显示图标，默认为true；若text为空，则强制为true |

##### 显示toast     
5.4.0

```javascript
FSOpen.widget.showToast({
    icon: 'success',
    text: '提示信息',
    duration: 3000,
    delay: 1000,
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        // do sth
    }
});
``` 

接口方法：FSOpen.widget.showToast   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| text      | String    | 否   | 要显示的提示信息，默认为空 |
| icon      | String    | 否   | 要显示的图标样式，有`success`和`error`。默认为`success` |
| duration  | Number    | 否   | 显示持续时间，单位毫秒，默认按系统规范 |
| delay     | Number    | 否   | 延迟显示时间，单位毫秒，默认0 |

##### 显示时间选择器     
5.4.0

> 此接口的输入输出参数均为24小时制

```javascript
FSOpen.widget.showDateTimePicker({
    dateType: 'month',
    defaultValue: '2015-03-24',
    onSuccess: function(resp) {
        console.assert(resp.value == '2015-03-24');
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showDateTimePicker   
调用参数：  

| 参数         | 类型      | 必须 | 说明         |
| -------------| ----------| -----| -------------|
| dateType     | String    | 是   | 时间选择器的选择类型。此类型将决定输入和输出的格式类型 |
| defaultValue | String    | 否   | 时间默认值，若为空将根据`dateType`获取当前时间的对应值 |

`dateType`参数说明：

| 值       | 输入输出格式  | 说明     |
| ---------| --------------| ---------|
| month    | yyyy-MM       | 年月     |
| day      | yyyy-MM-dd    | 年月日   |
| time     | HH:mm         | 时分，24小时制 |
| week     | yyyy-MM-dd~yyyy-MM-dd | 周 |
| day&#124;time | yyyy-MM-dd HH:mm | 年月日 时分 |

返回成功说明：

| 参数       | 类型      | 说明     |
| -----------| ----------| ---------|
| value      | String    | 选择的时间字符串，与`dateType`对应。如果有时分秒，为24小时制 |

##### 显示文本输入框     
5.4.0

```javascript
FSOpen.widget.showEditor({
    min: 1,
    max: 140,
    placeholder: '请输入内容',
    navbar: {
        title: '标题',
        leftLabel: '返回',
        leftArrow: true,
        rightLabel: '发送'
    },
    backFillData: {
        content: '我是输入',
        images: [''],
        tempFilePaths: []
    },
    components: ['emoji', 'image', 'at'],
    onSuccess: function(resp) {
        console.log(resp.content);
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.widget.showEditor   
调用参数：  

| 参数         | 类型          | 必须 | 说明         |
| -------------| --------------| -----| -------------|
| min          | Number        | 否   | 最小输入字符限制，不区分中英文。默认不做限制（为空） |
| max          | Number        | 否   | 最大输入字符限制，不区分中英文。默认不做限制 |
| placeholder  | String        | 否   | 占位符。默认为空 |
| navbar       | Object        | 否   | 输入框标题栏控制，具体说明见下面。|
| backFillData | Object        | 否   | 回填数据内容，支持文本和图片的数据回填，具体说明见下面。默认为空 |
| components   | Array[String] | 否   | 快捷输入组件。目前支持：emoji-表情，image-图片，at-@功能 |

`navbar`参数字段说明：

| 参数       | 类型      | 说明     |
| -----------| ----------| ---------|
| title      | String    | 顶部中间抬头文本 |
| leftLabel  | String    | 顶部左侧按钮文本 |
| leftArrow  | Boolean   | 顶部左侧按钮是否使用箭头图表，IOS使用 |
| rightLabel | String    | 顶部右侧按钮文本 |

`backFillData`参数字段说明：

| 参数          | 类型          | 说明     |
| --------------| --------------| ---------|
| content       | String        | 需要回填的文本内容 |
| images        | Array[String] | 需要回填的图片内容 |
| tempFilePaths | Array[String] | 回填的图片上传后所对应的临时路径，可选。如果有，将不会造成图片重复上传，提高性能 |

返回成功说明：

| 参数          | 类型          | 说明     |
| --------------| --------------| ---------|
| content       | String        | 输入纯文本内容，如“批准[微笑]，@北京研发中心”。Emoji表情由H5端自行解析 |
| thumbs        | Array[String] | 快捷输入所选择的图片缩略图地址，可用来在页面做图片展示 |
| images        | Array[String] | 快捷输入所选择的图片本地路径，不需要做上传，在编辑的时候回显使用 |
| tempFilePaths | Array[String] | 快捷输入所选择的图片上传后的临时路径，由后端进行处理 |


### 纷享服务

---------------------
#### 通讯录 
---------------------

##### 收藏联系人     
5.4.0

```javascript
FSOpen.service.contact.setMark({
    userId: 'FSUID_5174F22D77B81347E278CBD353748547',
    value: true,
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.setMark   
调用参数：  

| 参数       | 类型        | 必须 | 说明         |
| -----------| ------------| -----| -------------|
| userId     | String      | 是   | 纷享用户的OPEN ID |
| value      | Boolean     | 是   | 是否收藏 |

##### 获取某群组或部门的用户ID列表     
5.4.0

```javascript
FSOpen.service.contact.getMembers({
    departmentId: 1000,
    sessionId: 'f6b22ba707bd4447855567291c27476f',
    onSuccess: function(resp) {
        console.assert(resp.userIds.length != undefined);
        FSOpen.service.contact.getUsersInfo({
            userIds: resp.userIds
        });
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.getMembers   
调用参数：  

| 参数         | 类型        | 必须 | 说明         |
| -------------| ------------| -----| -------------|
| departmentId | Number      | 是   | 部门ID，优先级高于sessionId |
| sessionId    | String      | 是   | 群组（会话）ID |

返回成功说明：

| 参数    | 类型          | 说明         |
| --------| --------------| -------------|
| userIds | Array[String] | 用户OPEN-ID列表 |


##### 获取服务号信息     
5.4.0

```javascript
FSOpen.service.contact.getServiceChannelsInfo({
    serviceChannelIds: ['FSAID_1313eef'],
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.getServiceChannelsInfo   
调用参数：  

| 参数       | 类型        | 必须 | 说明         |
| -----------| ------------| -----| -------------|
| serviceChannelIds  | Array[String]      | 是   | 服务号ID列表 |

返回成功说明：  

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| serviceChannels     | Object        | 用户`serviceChannel`关联数组，比如：{'FSAID_13135e9': {serviceChannelId:'',name:'',imgUrl:''}}，如果用户没找到，对应的值为空 |

`serviceChannel`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| serviceChannelId  | String| 服务号ID  |
| name      | String        | 服务号名称     |
| imgUrl    | String        | 服务号图片地址 |

##### 获取用户信息     
5.4.0

```javascript
FSOpen.service.contact.getUsersInfo({
    userIds: [
        'FSUID_571AA7C41A11BE3D9BA25BDD397AC86E',
        'FSUID_643539016707F16000E85ADCC967D12C'
    ],
    onSuccess: function(resp) {
        console.assert(resp.users != null);
        var users = resp.users, key;
        // 遍历搜索到的用户
        for (key in users) {
            // {userId:'',nickname:'',email:'',avatarUrl:'',position:'',marked:true}
            console.log(users[key]);
        }
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.getUsersInfo   
调用参数：  

| 参数       | 类型          | 必须 | 说明         |
| -----------| --------------| -----| -------------|
| userIds    | Array[String] | 是   | 用户OPEN-ID列表 |

返回成功说明：  

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| users     | Object        | 用户`user`关联数组，比如：{'FSUID_XXX': {userId:'',nickname:'',email:'',avatarUrl:'',position:'',marked:true}}，如果用户没找到，对应的值为空 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户OPEN-ID  |
| nickname  | String        | 用户昵称     |
| email     | String        | 用户电子邮箱 |
| avatarUrl | String        | 用户头像     |
| position  | String        | 用户职位信息 |
| marked    | Boolean       | 是否关注了此用户 |

##### 从通讯录选择人员，部门和群组     
5.4.0

```javascript
// 从人员列表、部门列表和群组列表选择
FSOpen.service.contact.select({
    title: '选择数据',
    selectedUsers: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E'],
    selectedDepartments: [1001],
    excludedUsers: ['FSUID_643539016707F16000E85ADCC967D12C'],
    excludedDepartments: [1000],
    hasEmail: true,
    hasPhone: true,
    showRecent: true,
    showGroupTab: true,
    showCompanyAll: true,
    onSuccess: function(resp) {
        console.assert(resp.users != null);
        console.assert(resp.departments != null);
        console.assert(resp.groups != null);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

```javascript
// 自定义用户和部门列表
FSOpen.service.contact.select({
    scope: 'custom',
    users: [
        'FSUID_571AA7C41A11BE3D9BA25BDD397AC86E',
        'FSUID_643539016707F16000E85ADCC967D12C'
    ],
    departments: [
        1000,
        1001
    ],
    title: '选择数据',
    onSuccess: function(resp) {
        console.assert(resp.users != null);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.select   
调用参数：  

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   | 指定控件的数据源，只有两个情况：company或custom。当为company时，数据源为全公司数据列表；当为custom时，可通过`users`和`departments`两个参数来指定。默认为company。 |
| users              | Array[String] | 否   | 当`scope`为custom时使用，指定用户数据源 |
| departments        | Array[Number] | 否   | 当`scope`为custom时使用，指定部门数据源 |
| selectedUsers      | Array[String] | 否   | 已选中状态的用户OPEN-ID列表 |
| selectedDepartments| Array[Number] | 否   | 已选中状态的部门ID列表 |
| selectedGroups     | Array[String] | 否   | 已选中状态的群组ID列表 |
| selectedCompanyAll | Boolean       | 否   | 是否已选中“全公司”，只在`showCompanyAll`为true时有效 |
| showRecent         | Boolean       | 否   | 是否显示最近，默认为true |
| showGroupTab       | Boolean       | 否   | 是否显示群组标签页，默认为true |
| showCompanyAll     | Boolean       | 否   | 是否显示全公司选项，默认为true |
| excludedUsers       | Array[String]| 否   | 过滤器，需要过滤掉的用户OPEN-ID列表。保留待实现参数 |
| excludedDepartments | Array[Number]| 否   | 过滤器，需要过滤掉的部门ID列表。保留待实现参数 |
| hasEmail            | Boolean      | 否   | 过滤器，需要过滤掉Email为空的用户数据 |
| hasPhone            | Boolean      | 否   | 过滤器，需要过滤掉Phone为空的用户数据 |

返回说明：  

| 参数        | 类型          | 说明     |
| ------------| --------------| ---------|
| users       | Array[Object] | 选择的用户`user`列表 |
| departments | Array[Object] | 选择的部门`department`列表 |
| groups      | Array[Object] | 选择的群组`group`列表 |
| selectedSum | Array[Object] | 所有选中的人的总数 |
| selectedCompanyAll | String | 是否选中了全公司 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户OPEN-ID  |
| nickname  | String        | 用户昵称     |
| email     | String        | 用户电子邮箱 |
| avatarUrl | String        | 用户头像     |
| position  | String        | 用户职位信息 |

`department`字段说明：

| 参数        | 类型        | 说明         |
| ------------| ------------| -------------|
| departmentId| Number      | 部门ID       |
| name        | String      | 部门名称     |
| parentId    | String      | 父部门ID     |

`group`字段说明：

| 参数        | 类型        | 说明         |
| ------------| ------------| -------------|
| sessionId   | String      | 群组（会话）ID |
| name        | String      | 群组（会话）名称 |

##### 从通讯录选择部门     
5.4.0

```javascript
FSOpen.service.contact.selectDepartment({
    title: '选择数据',
    selectedDepartments: [1001],
    excludedDepartments: [1000],
    onSuccess: function(resp) {
        console.assert(resp.departments != null);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.selectDepartment   
调用参数：  

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   | 指定控件的数据源，只有两个情况：company或custom。当为company时，数据源为全公司数据列表；当为custom时，可通过`departments`参数来指定。默认为company。 |
| departments        | Array[Number] | 否   | 当`scope`为custom时使用，指定部门数据源 |
| selectedDepartments| Array[Number] | 否   | 已选中状态的部门ID列表 |
| max                | Number        | 否   | 最大选择上限，当`max=1`时为单选。默认不限制 |
| excludedDepartments| Array[Number] | 否   | 过滤器，需要过滤掉的部门ID列表 |

返回说明：  

| 参数        | 类型          | 说明     |
| ------------| --------------| ---------|
| departments | Array[Object] | 选择的部门`department`列表 |
| selectedSum | Array[Object] | 所有选中的人的总数 |

`department`字段说明：

| 参数        | 类型        | 说明         |
| ------------| ------------| -------------|
| departmentId| Number      | 部门ID       |
| name        | String      | 部门名称     |
| parentId    | String      | 父部门ID     |


##### 从通讯录选择人员     
5.4.0

```javascript
FSOpen.service.contact.selectUser({
    title: '选择数据',
    selectedUsers: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E'],
    excludedUsers: ['FSUID_643539016707F16000E85ADCC967D12C'],
    hasEmail: true,
    hasPhone: true,
    onSuccess: function(resp) {
        console.assert(resp.users != null);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.contact.selectUser   
调用参数：  

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   | 指定控件的数据源，只有两个情况：company或custom。当为company时，数据源为全公司数据列表；当为custom时，可通过`users`参数来指定。默认为company。 |
| users              | Array[String] | 否   | 当`scope`为custom时使用，指定用户数据源 |
| selectedUsers      | Array[String] | 否   | 已选中状态的用户OPEN-ID列表 |
| max                | Number        | 否   | 最大选择上限，当`max=1`时为单选。默认不限制 |
| excludedUsers      | Array[String] | 否   | 需要过滤掉的用户OPEN-ID列表 |
| hasEmail           | Boolean       | 否   | 需要过滤掉Email为空的用户数据 |
| hasPhone           | Boolean       | 否   | 需要过滤掉Phone为空的用户数据 |

返回说明：  

| 参数        | 类型          | 说明     |
| ------------| --------------| ---------|
| users       | Array[Object] | 选择的用户`user`列表 |
| selectedSum | Array[Object] | 所有选中的人的总数 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户OPEN-ID  |
| nickname  | String        | 用户昵称     |
| email     | String        | 用户电子邮箱 |
| avatarUrl | String        | 用户头像     |
| position  | String        | 用户职位信息 |


---------------------
#### 企信会话 
---------------------

##### 发起音视频电话
5.4.0

```javascript
FSOpen.service.conversation.setupFSCall({
    userId: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E']
});
``` 

接口方法：FSOpen.service.conversation.setupFSCall   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| userId    | String    | 是   | 用户OPEN-ID  |

##### 发起音视频会议
5.4.0

```javascript
FSOpen.service.conversation.setupFSConference({
    userIds: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E']
});
``` 

接口方法：FSOpen.service.conversation.setupFSConference   
调用参数：  

| 参数      | 类型         | 必须 | 说明         |
| ----------| -------------| -----| -------------|
| userIds   | Array[String]| 是   | 用户OPEN-ID列表 |


---------------------
#### 收藏 
---------------------

##### 添加收藏
5.4.0

```javascript
FSOpen.service.favorite.add({
    title: '纷享开放平台JSAPI',
    desc: '纷享开放平台JSAPI',
    link: location.href,
    imgUrl: '',
    tagList: ['纷享', 'JSAPI'],
    onSuccess: function(resp) {
        alert('收藏成功');
    },
    onFail: function(error) {
        if (error.errorCode === 40050) {
            alert('用户取消收藏');
            return;
        }
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.favorite.add   
调用参数：  

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| title     | String        | 是   | 收藏标题 |
| desc      | String        | 否   | 收藏描述 |
| link      | String        | 否   | 收藏链接，默认为当前页面链接 |
| imgUrl    | String        | 否   | 收藏内容的缩略图 |
| tagList   | Array[String] | 否   | 收藏内容的标签列表 |


---------------------
#### 位置 
---------------------

##### 获取当前地理位置      
5.4.0

```javascript
FSOpen.service.geo.getLocation();
``` 

接口方法：FSOpen.service.geo.getLocation   
返回说明：  

| 参数      | 类型   | 说明     |
| ----------| -------| ---------|
| accuracy  | Number | 实际的定位精度半径（单位米） |
| address   | String | 格式化后的地址，如：深圳市南山区大冲商务中心 |
| country   | String | 国家 |
| province  | String | 省份，如：广东省 |
| city      | String | 城市，如：深圳市。直辖市会返回空 |
| district  | String | 行政区，如：南山区 |
| street    | String | 街道，如：铜鼓路10000号 |

##### 地图定位      
5.4.0

```javascript
FSOpen.service.geo.selectPOI({
    latitude: 39.903578,
    longitude: 116.473565,
    onSuccess: function(resp) {
        console.log(resp);
    }
});
``` 

接口方法：FSOpen.service.geo.selectPOI   
调用参数：      

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| latitude  | Number    | 否   | 标准维度，默认当前位置 |
| longitude | Number    | 否   | 标准经度，默认当前位置 |

返回说明：  

| 参数         | 类型   | 说明     |
| -------------| -------| ---------|
| latitude     | Number | POI的标准维度 |
| longitude    | Number | POI的标准经度 |
| title        | String | POI的名称 |
| province     | String | POI所在省，可能为空 |
| provinceCode | String | POI所在省编码，可能为空 |
| city         | String | POI所在城市，可能为空 |
| cityCode     | String | POI所在城市的编码，可能为空 |
| district     | String | POI所在区，可能为空 |
| districtCode | String | POI所在区的编码，可能为空 |
| postcode     | String | POI的邮编，可能为空 |
| street       | String | POI的街道地址，可能为空 |


---------------------
#### 邮件 
---------------------

**此类接口非外部接口，谨慎使用**

##### 转发邮件到企信     
5.4.0

```javascript
FSOpen.service.mail.shareToConversation({
    title: 'Hello world',
    summary: 'Hello Fxiaoke',
    postTime: '2016-04-28 12:51:00',
    url: 'https://www.fxiaoke.com/',
    onSuccess: function(resp) {
        alert('转发成功');
    },
    onFail: function(error) {
        alert('转发失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.mail.shareToConversation  
调用参数：  

| 参数     | 类型   | 必须 | 说明         |
| ---------| -------| -----| -------------|
| title    | String | 是   | 邮件标题 |
| summary  | String | 否   | 邮件摘要 |
| postTime | String | 否   | 邮件发送时间，格式：yyyy-MM-dd hh:mm:ss |
| url      | String | 否   | 邮件查看地址 |
| sender   | String | 否   | 发件人名称 |

##### 转发邮件到工作流     
5.4.0

```javascript
FSOpen.service.mail.shareToFeed({
    title: 'Hello world',
    summary: 'Hello Fxiaoke',
    postTime: '2016-04-28 12:51:00',
    url: 'https://www.fxiaoke.com/',
    onSuccess: function(resp) {
        alert('转发成功');
    },
    onFail: function(error) {
        alert('转发失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.mail.shareToFeed  
调用参数：  

| 参数     | 类型   | 必须 | 说明         |
| ---------| -------| -----| -------------|
| title    | String | 是   | 邮件标题 |
| summary  | String | 否   | 邮件摘要 |
| postTime | String | 否   | 邮件发送时间，格式：yyyy-MM-dd hh:mm:ss |
| url      | String | 否   | 邮件查看地址 |
| sender   | String | 否   | 发件人名称 |


---------------------
#### 支付 
---------------------

##### 发起支付请求     
5.4.0

```javascript
FSOpen.service.pay.request({
    amount: '0.1',
    productId: 'xxx',
    productName: 'xxx',
    merchantId: 'xxx',
    limitPayer: 1,
    fromEa: 7,
    fromUid: 1099,
    expireTime: 1461564216568,
    signature: '643539016707F16000E85ADCC967D12C',
    onSuccess: function(resp) {
        alert('支付成功');
    },
    onFail: function(error) {
        alert('支付失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.pay.request  
调用参数：  

| 参数       | 类型    | 必须 | 说明         |
| -----------| --------| -----| -------------|
| amount     | String  | 是   | 金额，字符串。比如20.00，需要跟计算签名的值保持一致 |
| productId  | String  | 是   | 业务编号，需要跟计算签名的值保持一致 |
| productName| String  | 是   | 业务名称，商家自定义 |
| merchantId | String  | 是   | 商户ID，由支付平台提供 |
| limitPayer | Number  | 是   | 是否限制付款者 1限制，0不限制 |
| fromEa     | Number  | 是   | 当前用户的企业号 |
| fromUid    | Number  | 是   | 当前用户的userId |
| expireTime | Number  | 是   | 二维码的过期时间，格式为毫秒数 |
| signature  | String  | 是   | 最终的参数签名值 |

##### 发起企业支付请求     
5.4.0

```javascript
FSOpen.service.pay.requestForCorp({
    amount: 1,
    productId: 'xxx',
    orderNo: 'xxx',
    merchantCode: 'xxx',
    remark: 'xxx',
    subject: 'xxx',
    body: 'xxx',
    toEA: 'xxx',
    toEAWalletId: 'xxx',
    signature: '643539016707F16000E85ADCC967D12C',
    onSuccess: function(resp) {
        alert('支付成功');
    },
    onFail: function(error) {
        alert('支付失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.pay.requestForCorp  
调用参数：  

| 参数         | 类型    | 必须 | 说明         |
| -------------| --------| -----| -------------|
| amount       | Number  | 是   | 支付金额，精确到分。比如2000是指20元整。单位分 |
| productId    | String  | 是   | 商品ID |
| orderNo      | String  | 是   | 订单号 |
| merchantCode | String  | 是   | 商户号 |
| remark       | String  | 否   | 交易备注 |
| subject      | String  | 是   | 商品名称 |
| body         | String  | 是   | 商品描述 |
| toEA         | String  | 是   | 收款的企业号 |
| toEAName     | String  | 是   | 收款的企业名称 |
| toEAWalletId | String  | 是   | 收款企业账号ID |
| signature    | String  | 是   | 最终的参数签名值 |


---------------------
#### 分享 
---------------------

**此类接口对应纷享菜单里的分享接口，可独立使用**  

##### 转发到企信     
5.4.0

```javascript
FSOpen.service.share.toConversation({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toConversation   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| type      | String      | 否   | 分享的资源类型，目前支持text-文字，link-链接，image-图片，file-文件。当`link`参数为空时，默认text类型，否则默认为link类型 |
| title     | String      | 否   | 资源类型为link时使用，表示分享标题，默认当前页面标题 |
| desc      | String      | 否   | 资源类型为link时使用，表示分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 资源类型为link时使用，表示分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 资源类型为link时使用，表示分享缩略图地址，默认为系统提供的图 |
| name      | String      | 否   | 资源类型为image或file时使用，表示资源名 |
| size      | String      | 否   | 资源类型为image或file时使用，表示资源大小 |
| npath     | String      | 否   | 资源类型为image或file时使用，表示资源存储地址 |
| content   | String      | 否   | 资源类型为text时使用，表示文件内容 |

##### 转发给CRM联系人     
5.4.0

```javascript
FSOpen.service.share.toCRMContact({
    link: location.href,
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toCRMContact   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| link      | String      | 否   | 要转发的页面链接 |

##### 转发到工作流     
5.4.0

```javascript
FSOpen.service.share.toFeed({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toFeed   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| type      | String      | 否   | 分享的资源类型，目前支持text-文字，link-链接，image-图片，file-文件。当`link`参数为空时，默认text类型，否则默认为link类型 |
| title     | String      | 否   | 资源类型为link时使用，表示分享标题，默认当前页面标题 |
| desc      | String      | 否   | 资源类型为link时使用，表示分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 资源类型为link时使用，表示分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 资源类型为link时使用，表示分享缩略图地址，默认为系统提供的图 |
| name      | String      | 否   | 资源类型为image或file时使用，表示资源名 |
| size      | String      | 否   | 资源类型为image或file时使用，表示资源大小 |
| npath     | String      | 否   | 资源类型为image或file时使用，表示资源存储地址 |
| content   | String      | 否   | 资源类型为text时使用，表示文件内容 |

##### 通过邮件转发     
5.4.0

```javascript
FSOpen.service.share.viaMail({
    title: '纷享逍客',
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.viaMail   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 转发邮件标题 |
| content   | String      | 否   | 转发邮件内容，可使用{url}替换符来表示当前页面的url |

##### 分享给QQ好友     
5.4.0

```javascript
FSOpen.service.share.toQQFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toQQFriend   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| desc      | String      | 否   | 分享摘要描述，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 通过短信转发     
5.4.0

```javascript
FSOpen.service.share.viaSMS({
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.viaSMS   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| content   | String      | 否   | 转发内容，最多140字，可使用{url}替换符来表示当前页面的url |

##### 分享给微信好友     
5.4.0

```javascript
FSOpen.service.share.toWXFriend({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toWXFriend   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |

##### 分享到微信朋友圈     
5.4.0

```javascript
FSOpen.service.share.toWXMoments({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
    },
    onFail: function(error) {
        if (error.errorCode == 40050) {
            alert('用户取消分享');
            return;
        }
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.share.toWXMoments   
调用参数：  

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为系统提供的图 |


---------------------
#### 日历 
---------------------

##### 设置日程提醒     
5.4.0

```javascript
FSOpen.service.calendar.createEvent({
    content: '今天原来要上班',
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.calendar.createEvent   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| content   | String    | 否   | 日程提醒内容 |


---------------------
#### 工作流 
---------------------

##### 创建工作动态     
5.4.0

```javascript
FSOpen.service.feed.create({
    type: 'share',
    content: '周五要上线',
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.create   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| type      | String    | 否   | 动态类型：share-分享，diary-日志，approval-审批，task-任务，schedule-日程，order-指令，不指定则由用户自行选择 |
| content   | String    | 否   | 动态文本内容，除任务外，均默认赋值到各类型动态的第一个字段，比如日报填入“今日工作”；任务填入第二个字段“备注” |

##### 创建分享型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createShare({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createShare   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |

##### 创建日志型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createDiary({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createDiary   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |

##### 创建审批型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createApproval({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createApproval   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |

##### 创建任务型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createTask({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createTask   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |

##### 创建日程型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createSchedule({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createSchedule   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |

##### 创建指令型工作动态     
5.4.0

```javascript
FSOpen.service.feed.createOrder({
    onSuccess: function(resp) {
        alert('创建成功');
    },
    onFail: function(error) {
        alert('创建失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.feed.createOrder   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
|           | String    | 否   | 待定 |


---------------------
#### 网盘 
---------------------

##### 将文件保存到网盘     
5.4.0

> 此接口目前只支持纷享文件系统，见[附录]()

```javascript
FSOpen.service.disk.addFile({
    fileName: '纷享逍客培训.pptx',
    fileNPath: 'N_xxxxxx',
    onSuccess: function(resp) {
        alert('保存成功');
    },
    onFail: function(error) {
        alert('保存失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.disk.addFile   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileName  | String    | 是   | 存储文件名称，需要带上文件后缀 |
| fileNPath | String    | 是   | 以`N_`开头的纷享文件系统的文件路径信息 |

##### 从网盘选择文件     
5.4.0

```javascript
FSOpen.service.disk.selectFile({
    onSuccess: function(resp) {
        console.assert(resp.file !== undefined);
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.service.disk.selectFile   
返回成功说明：  

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| file      | Object    | 文件信息 |

`file`字段说明：

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| id        | String    | 文件ID信息 |
| fileName  | String    | 文件名 |
| fileNPath | String    | 以`N_`开头的纷享文件系统的文件路径信息 |
| size      | Number    | 文件大小，以字节为单位 |
| url       | String    | 可通过HTTP连接访问的文件地址 |

### 媒体

---------------------
#### 文件 
---------------------

##### 文件预览
5.4.0

```javascript
FSOpen.media.file.preview({
    fileNPath: 'N_201606_29_f13bbed15ba14413bc0aef29be255817.docx',
    onSuccess: function(resp) {
        // do sth
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.media.file.preview   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileNPath | String    | 是   | 文档所对应的Npath地址，目前只支持的文件后缀为doc|docx|pdf|ppt|pptx等格式 |

##### 文件下载
5.4.0

> 此接口仅在Android里可用

```javascript
FSOpen.media.file.download({
    fileUrl: 'N_201606_29_f13bbed15ba14413bc0aef29be255817.docx',
    fileName: '纷享JSAPI开发文档.docx',
    onProgress: function(resp) {
        console.log(resp.loaded, resp.total);
    },
    onSuccess: function(resp) {
        console.log(resp.fileLocalPath);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.media.file.download   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileUrl   | String    | 是   | 要下载的文件地址，支持Npath地址和标准的HTTP链接地址 |
| fileName  | String    | 是   | 要下载的文件存储名 |
| onProgress| Function  | 否   | 下载进度回调 |

`onProgress`回调参数说明：

| 参数        | 类型      | 说明     |
| ------------| ----------| ---------|
| loaded      | Number    | 已下载文件大小，以byte为单位 |
| total       | Number    | 总下载文件大小，以byte为单位 |

成功返回说明：

| 参数          | 类型      | 说明     |
| --------------| ----------| ---------|
| fileLocalPath | String    | 下载文件的本地路径 |

##### 文件上传
5.4.0

> 此接口在调用成功后，将会立即通过`onSuccess`回调返回用户选择的文件列表，然后在后续的上传过程中，将通过`onProgress`回调返回某单个文件的上传进度，同时，还会通过`onUpload`回调返回当前批次上传所有文件的上传进度。
> 此接口仅在Android里可用。

```javascript
FSOpen.media.file.upload({
    onUpload: function(resp) {
        console.log('上传文件信息：', resp.file);
        console.log('总上传进度：', resp.count, resp.done);
    },
    onProgress: function(resp) {
        console.log(resp.id, resp.loaded, resp.total);
    },
    onSuccess: function(resp) {
        console.log(resp.selectedFiles);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.media.file.upload   
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| onUpload  | Function  | 否   | 所有文件上传进度回调 |
| onProgress| Function  | 否   | 单个文件上传进度回调 |

`onUpload`回调参数说明：

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| file      | Object    | 当前上传成功的文件`file`信息 |
| done      | Number    | 已完成上传的文件个数 |
| count     | Number    | 总的要上传的文件个数 |

`onProgress`回调参数说明：

| 参数        | 类型      | 说明     |
| ------------| ----------| ---------|
| loaded      | Number    | 已下载文件大小，以byte为单位 |
| total       | Number    | 总下载文件大小，以byte为单位 |

`file`字段说明：

| 参数        | 类型      | 说明     |
| ------------| ----------| ---------|
| id          | String    | 上传的文件ID |
| result      | Boolean   | 上传结果，true表示成功，false表示失败 |
| fileNPath   | String    | 如果上传成功，文件所对应的NPath地址 |

成功返回说明：

| 参数          | 类型          | 说明     |
| --------------| --------------| ---------|
| selectedFiles | Array[String] | 选择的文件`localFile`列表 |

`localFile`字段说明：

| 参数          | 类型      | 说明     |
| --------------| ----------| ---------|
| id            | String    | 上传的文件ID |
| fileName      | String    | 上传的文件名称 |
| fileLocalPath | String    | 上传的文件本地路径 |

---------------------
#### 图片 
---------------------

##### 图片预览
5.4.0

```javascript
FSOpen.media.image.preview({
    index: 0,
    imgUrls: [
        'https://www.fxiaoke.com/static/img/index/icon-wx-small.png?v=5.1.5',
        'https://www.fxiaoke.com/static/img/index/icon-kh-small.jpg?v=5.1.5'
    ]
});
``` 

接口方法：FSOpen.media.image.preview   
调用参数：  

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| index     | Number        | 否   | 从第几张图片开始预览，索引从0开始计算。默认为0 |
| imgUrls   | Array[String] | 是   | 图片地址列表，默认为空 |

##### 图片上传
5.4.0

> 此接口在调用成功后，将会立即通过`onSuccess`回调返回用户选择的图片列表，然后在后续的上传过程中，将通过`onProgress`回调返回某单个图片的上传进度，同时，还会通过`onUpload`回调返回当前批次上传所有图片的上传进度。

```javascript
FSOpen.media.image.upload({
    source: ['album', 'camera'],
    onUpload: function(resp) {
        console.log('上传文件信息：', resp.image);
        console.log('总上传进度：', resp.count, resp.done);
    },
    onProgress: function(resp) {
        console.log(resp.id, resp.loaded, resp.total);
    },
    onSuccess: function(resp) {
        console.log(resp.selectedImages);
    },
    onFail: function(error) {
        alert('获取失败，错误码：' + error.errorCode);
    }
});
``` 

接口方法：FSOpen.media.image.upload   
调用参数：  

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| source    | Array[String] | 否   | 指定图片上传源：album-从相册上传，camera-拍照上传，默认只从相册上传 |
| onUpload  | Function      | 否   | 所有图片上传进度回调 |

`onUpload`回调参数说明：

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| image     | Object    | 当前上传成功的图片`image`信息 |
| done      | Number    | 已完成上传的图片个数 |
| count     | Number    | 总的要上传的图片个数 |

`image`字段说明：

| 参数        | 类型      | 说明     |
| ------------| ----------| ---------|
| id          | String    | 上传的图片ID |
| result      | Boolean   | 上传结果，true表示成功，false表示失败 |
| imageNPath  | String    | 如果上传成功，图片所对应的NPath地址 |

成功返回说明：

| 参数          | 类型          | 说明     |
| --------------| --------------| ---------|
| selectedImages| Array[String] | 选择的图片`localImage`列表 |

`localImage`字段说明：

| 参数          | 类型      | 说明     |
| --------------| ----------| ---------|
| id            | String    | 上传的图片ID |
| imageName      | String    | 上传的图片名称 |
| imageLocalPath | String    | 上传的图片本地路径 |

### Util

##### 埋点统计
5.4.0   
> 此接口为纷享开放平台所提供的非实时统计平台，外部应用可直接使用此接口进行关键数据统计。具体可见[附录]() 

```javascript
FSOpen.util.traceEvent({
    event: {
        m1: 'eventName',
        m2: 'Hello world',
        m3: 10
    }
});
``` 

接口方法：FSOpen.util.traceEvent
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| event     | Object    | 是   | 统计数据内容，用户可自定义任意JSON字段 |

##### 打开内部(native)页面
5.4.0   

```javascript
FSOpen.util.open({
    name: 'conversation',
    params: {
        type: 'user',
        userIds: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E']
    }
});
``` 

接口方法：FSOpen.util.open
调用参数：  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| name      | String    | 是   | 打开窗口类型 |
| params    | Object    | 否   | 打开窗口所需要支持的参数对象 |

`name`参数说明：

| 类型             | 类型描述                 |
| -----------------| -------------------------|
| conversation     | 打开企信会话             |
| feedOfUser       | 打开个人工作界面         |
| feedOfDept       | 打开部门工作界面         |
| favorite         | 打开收藏夹               |
| downloadedFiles  | 打开下载管理界面         |
| disk             | 打开网盘                 |
| calendar         | 打开日历                 |
| profileOfUser    | 打开个人信息界面         |
| profileOfService | 打开服务号信息界面       |
| map              | 打开地图                 |
| wallet           | 打开当前登录用户钱包界面 |
| feedWithId       | 打开Feed详情             |
| checkInRecord    | 打开打卡界面             |
| CRMVisiting      | 打开CRM客户拜访记录界面  |

`conversation`对应的`params`参数说明：

| 参数         | 类型          | 必须 | 说明         |
| -------------| --------------| -----| -------------|
| type         | String        | 否   | 会话类型，值：user-多（私）人会话；dept-部门会话；service-服务号会话；common-通用会话，即直接传入已存在的会话ID，可通过通讯录接口`service.contact.select`选择群组信息得到此ID。默认为user |
| userIds      | Array[String] | 否   | 当`type=user`时使用，表示要发起会话的用户列表 |
| departmentId | Number        | 否   | 当`type=dept`为时使用，表示要发起会话的部门 |
| sessionId    | String        | 否   | 当`type=common`为时使用，表示要进入的群组会话 |
| serviceChannelId | String    | 否   | 当`type=service`为时使用，表示要发起会话的服务号 |

`feedOfUser`对应的`params`参数说明：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| userId    | String        | 是   | 用户OPEN-ID  |

`feedOfDept`对应的`params`参数说明：

| 参数         | 类型          | 必须 | 说明         |
| -------------| --------------| -----| -------------|
| departmentId | Number        | 是   | 部门ID       |

`calendar`对应的`params`参数说明：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| year      | Number        | 否   | 年份，默认当前年份 |
| month     | Number        | 否   | 月份，默认当前月份。值为1~12。|
| date      | Number        | 否   | 日期，默认当天 |

`profileOfUser`对应的`params`参数说明：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| userId    | String        | 是   | 用户OPEN-ID  |

`profileOfService`对应的`params`参数说明：

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| serviceChannelId | String        | 是   | 服务号ID  |

`map`对应的`params`参数说明：

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| latitude  | Number    | 是   | 标准维度，默认当前位置 |
| longitude | Number    | 是   | 标准经度，默认当前位置 |
| title     | String    | 否   | 在地图锚点气泡显示的文本，默认为空不显示 |

`feedWithId`对应的`params`参数说明：

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| feedId    | String    | 是   | 工作详情ID   |
| feedType  | Number    | 是   | 工作详情类型：4-请假 99-外勤签到 |

`checkInRecord`对应的`params`参数说明：

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| checkId   | String    | 是   | 考勤记录ID   |

`CRMVisiting`对应的`params`参数说明：

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| visitingId| String    | 是   | CRM对象ID    |



### 接口汇总

<table>
   <tr>
      <td>一级分类</td>
      <td>二级分类</td>
      <td>接口名</td>
      <td>需要授权</td>
      <td>JS版本</td>
      <td>接口描述</td>
   </tr>
   <tr>
      <td colspan="2" rowspan="3">容器</td>
      <td>runtime.getVersion</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>获取容器版本号</td>
   </tr>
   <tr>
      <td>runtime.requestAuthCode</td>
            <td>Y</td>
      <td>2.0.0</td>
      <td>获取临时授权码用于免登业务</td>
   </tr>
   <tr>
      <td>runtime.showUpdate</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>提示版本升级</td>
   </tr>
   <tr>
      <td colspan="2" rowspan="6">设备</td>
      <td>device.authenticateUser</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>鉴权，支持指纹和纷享密码两种方式</td>
   </tr>
   <tr>
      <td>device.getAP</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取接入点标识</td>
   </tr>
   <tr>
      <td>device.getNetwork</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>获取当前接入的网络类型：WiFi、2/3/4G</td>
   </tr>
   <tr>
      <td>device.getUUID</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取设备唯一编码</td>
   </tr>
   <tr>
      <td>device.scan</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>扫一扫</td>
   </tr>
   <tr>
      <td>device.vibrate</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>手机震动</td>
   </tr>
   <tr>
      <td colspan="2" rowspan="2">启动器</td>
      <td>launcher.checkAppInstalled</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>查询手机是否安装了某App</td>
   </tr>
   <tr>
      <td>launcher.launchApp</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>启动指定的App</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="35">Webview</td>
      <td colspan="1" rowspan="6">URL传参</td>
      <td>fs_nav_title</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>URL后拼接'fs_nav_title=纷享问问'定义导航栏标题</td>
   </tr>
   <tr>
      <td>fs_nav_fsmenu</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>URL后拼接'&fs_nav_fsmenu=true|false'设置是否在导航栏上显示纷享菜单</td>
   </tr>
   <tr>
      <td>fs_nav_bgcolor</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>URL后拼接'&fs_nav_bgcolor=c6a60000'设置导航栏背景颜色</td>
   </tr>
   <tr>
      <td>fs_nav_pgcolor</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>URL后拼接'&fs_nav_pgcolor=c6a60000'设置导航栏进度条颜色</td>
   </tr>
   <tr>
      <td>fs_auth</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>URL后拼接'&auth=true|false'设置访问网页是否需要用户鉴权</td>
   </tr>
   <tr>
      <td>fs_auth_appname</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>当需要用户鉴权（&auth=true)时，需传入应用名称用作用户提示（&auth_appname=纷享问问)</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="4">Webview跳转</td>
      <td>webview.back</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>webview回退到上一级页面</td>
   </tr>
   <tr>
      <td>webview.close</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>关闭webview</td>
   </tr>
   <tr>
      <td>webview.open</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>打开webview新窗口</td>
   </tr>
   <tr>
      <td>webview.onCloseWebview</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>webview窗口被关闭时回调。用于处理侧滑关闭、Android物理返回键关闭</td>
   </tr>
   <tr>
      <td>屏幕翻转</td>
      <td>webview.setOrientation</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>webview横屏竖屏控制</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="7">导航栏</td>
      <td>webview.navbar.setTitle</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>设置导航栏标题</td>
   </tr>
   <tr>
      <td>webview.navbar.setMiddleBtn</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>设置导航栏问号链接</td>
   </tr>
   <tr>
      <td>webview.navbar.setLeftBtn</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>设置导航栏左侧按钮</td>
   </tr>
   <tr>
      <td>webview.navbar.setRightBtns</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>设置导航栏右侧按钮</td>
   </tr>
   <tr>
      <td>webview.navbar.removeRightBtns</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>清除导航栏右侧所有按钮</td>
   </tr>
   <tr>
      <td>webview.navbar.showMenu</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>显示导航栏右侧的“更多”菜单</td>
   </tr>
   <tr>
      <td>webview.navbar.hideMenu</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>隐藏导航栏右侧的“更多”菜单</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="8">纷享菜单</td>
      <td>webview.menu.onShareToConversation</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：转发到企信 </td>
   </tr>
   <tr>
      <td>webview.menu.onShareToFeed</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：转发到“工作”</td>
   </tr>
   <tr>
      <td>webview.menu.onShareToCRMContact</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：转发到CRM联系人</td>
   </tr>
   <tr>
      <td>webview.menu.onShareToWXFriend</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：转发给微信朋友</td>
   </tr>
   <tr>
      <td>webview.menu.onShareToWXMoments</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：分享到微信朋友圈</td>
   </tr>
   <tr>
      <td>webview.menu.onShareToQQFriend</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：转发给QQ朋友</td>
   </tr>
   <tr>
      <td>webview.menu.onShareViaSMS</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：通过短信转发</td>
   </tr>
   <tr>
      <td>webview.menu.onShareViaMail</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>“更多”菜单回调：通过邮件转发</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="4">页面</td>
      <td>webview.page.copyURL</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>复制当前页面URL</td>
   </tr>
   <tr>
      <td>webview.page.generateQR</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>生成当前页面二维码</td>
   </tr>
   <tr>
      <td>webview.page.openWithBrowser</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>用浏览器打开当前页面</td>
   </tr>
   <tr>
      <td>webview.page.refresh</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>页面刷新</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">Bounce</td>
      <td>webview.bounce.disable</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>禁用Bounce</td>
   </tr>
   <tr>
      <td>webview.bounce.enable</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>启用Bounce</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="3">下拉刷新</td>
      <td>webview.pullRefresh.disable</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>禁用下拉刷新</td>
   </tr>
   <tr>
      <td>webview.pullRefresh.enable</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>启用下拉刷新</td>
   </tr>
   <tr>
      <td>webview.pullRefresh.stop</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>停止刷新</td>
   </tr>
   <tr>
      <td colspan="2" rowspan="10">弹层</td>
      <td>widget.showActionSheet</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出菜单</td>
   </tr>
   <tr>
      <td>widget.showAlert</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出警告窗口</td>
   </tr>
   <tr>
      <td>widget.showConfirm</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出确认窗口</td>
   </tr>
   <tr>
      <td>widget.hidePreloader</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>隐藏加载提示</td>
   </tr>
   <tr>
      <td>widget.showModal</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出模态窗口</td>
   </tr>
   <tr>
      <td>widget.showPrompt</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出提示窗口</td>
   </tr>
   <tr>
      <td>widget.showPreloader</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出加载提示</td>
   </tr>
   <tr>
      <td>widget.showToast</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出Toast</td>
   </tr>
   <tr>
      <td>widget.showDateTimePicker</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出日期选择控件</td>
   </tr>
   <tr>
      <td>widget.showEditor</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>弹出文本框</td>
   </tr>
   <tr>
      <td  colspan="1" rowspan="34">纷享服务</td>
      <td  colspan="1" rowspan="7">通讯录</td>
      <td>service.contact.select</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>选择员工和部门</td>
   </tr>
   <tr>
      <td>service.contact.selectDepartment</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>选择部门</td>
   </tr>
   <tr>
      <td>service.contact.selectUser</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>选择员工</td>
   </tr>
   <tr>
      <td>service.contact.getMembers</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取成员列表</td>
   </tr>
   <tr>
      <td>service.contact.getUsersInfo</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取员工信息</td>
   </tr>
   <tr>
      <td>service.contact.setMark</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>关注员工或取消关注</td>
   </tr>
   <tr>
      <td>service.contact.getServiceChannelsInfo</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取服务号信息</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">会话</td>
      <td>service.conversation.setupFSCall</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>发起1对1纷享电话</td>
   </tr>
    <tr>
      <td>service.conversation.setupFSConference</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>发起多人纷享电话会议</td>
   </tr>
   <tr>
      <td>收藏</td>
      <td>service.favorite.add</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>添加收藏</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">位置</td>
      <td>service.geo.getLocation</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>获取当前地理位置</td>
   </tr>
   <tr>
      <td>service.geo.selectPOI</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>选择兴趣点</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">邮件</td>
      <td>service.mail.shareToConversation</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>邮件转发到企信</td>
   </tr>
   <tr>
      <td>service.mail.shareToFeed</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>邮件转发到工作</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">支付</td>
      <td>service.pay.request</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>请求支付</td>
   </tr>
   <tr>
      <td>service.pay.requestForCorp</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>请求企业支付</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="8">分享</td>
      <td>service.share.toConversation</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>转发到企信</td>
   </tr>
   <tr>
      <td>service.share.toFeed</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>转发到“工作”</td>
   </tr>
   <tr>
      <td>service.share.toCRMContact</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>转发到CRM联系人</td>
   </tr>
   <tr>
      <td>service.share.toWXFriend</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>转发给微信朋友</td>
   </tr>
   <tr>
      <td>service.share.toWXMoments</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>分享到微信朋友圈</td>
   </tr>
   <tr>
      <td>service.share.toQQFriend</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>转发给QQ朋友</td>
   </tr>
   <tr>
      <td>service.share.viaMail</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>通过邮件转发</td>
   </tr>
   <tr>
      <td>service.share.viaSMS</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>通过短信转发</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="1">日历</td>
      <td>service.share.toConversation</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建日程</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="7">工作</td>
      <td>service.feed.create</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建工作</td>
   </tr>
   <tr>
      <td>service.feed.createShare</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建分享</td>
   </tr>
   <tr>
      <td>service.feed.createDiary</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建日志</td>
   </tr>
   <tr>
      <td>service.feed.createApproval</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建审批</td>
   </tr>
   <tr>
      <td>service.feed.createTask</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建任务</td>
   </tr>
   <tr>
      <td>service.feed.createSchedule</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建工作日程</td>
   </tr>
   <tr>
      <td>service.feed.createOrder</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>创建指令</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">网盘</td>
      <td>service.disk.addFile</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>文件保存到网盘</td>
   </tr>
   <tr>
      <td>service.disk.selectFile</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>从网盘中选取文件</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="11">媒体</td>
      <td colspan="1" rowspan="3">文件</td>
      <td>media.file.upload</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>上传文件</td>
   </tr>
   <tr>
      <td>media.file.download</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>下载文件</td>
   </tr>
   <tr>
      <td>media.file.preview</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>预览文件</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="2">图片</td>
      <td>media.image.upload</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>上传图片（含拍照）</td>
   </tr>
   <tr>
      <td>media.image.preview</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>预览图片</td>
   </tr>
   <tr>
      <td colspan="1" rowspan="6">音频</td>
      <td>media.audio.startRecord</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>开始录制语音</td>
   </tr>
   <tr>
      <td>media.audio.stopRecord</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>停止录制语音</td>
   </tr>
   <tr>
      <td>media.audio.play</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>播放语音</td>
   </tr>
   <tr>
      <td>media.audio.pause</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>暂停播放语音</td>
   </tr>
   <tr>
      <td>media.audio.resume</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>恢复播放语音</td>
   </tr>
   <tr>
      <td>media.audio.stop</td>
      <td>N</td>
      <td>2.0.0</td>
      <td>停止播放语音</td>
   </tr>
   <tr>
      <td colspan="2" rowspan="3">Util</td>
      <td>util.traceEvent</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>统计事件</td>
   </tr>
   <tr>
      <td>util.open</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>打开纷享内部页面</td>
   </tr>
   <tr>
      <td>util.query</td>
      <td>Y</td>
      <td>2.0.0</td>
      <td>检索分享数据</td>
   </tr>
</table>


### 调试技巧

* [各种 真机远程调试 方法 汇总](https://github.com/jieyou/remote_inspect_web_on_real_device)
* [移动端Web开发调试之Chrome远程调试(Remote Debugging)](http://blog.csdn.net/freshlover/article/details/42528643)
* [Browersync](https://browsersync.io/docs/)
* [weinre](https://people.apache.org/~pmuellr/weinre/docs/latest/)





 

















