## Demo和调试工具

我们为开发者提供了Demo和调试工具，提高开发效率。如果对调用参数有疑问，可使用调试工具。对JSAPI用法有疑问，可查看demo。

[调试工具](https://open.fxiaoke.com/..)  
通过PC端浏览器打开左边的链接后，手机扫描二维码，即可通过PC页面配置JSAPI参数，点击执行来调试手机上的页面。   
[JSAPI使用样例地址](https://open.fxiaoke.com/..)   
[微应用Demo地址](https://open.fxiaoke.com/..)    

## 通用

1. 页面引入JSAPI库

    `<script src="http://www.fxiaoke.com/open/jsapi/1.0.0/jsapi.min.js"></script>` 

    js文件版本在添加升级功能时地址会相应变化，如有需要比如使用新增的JSAPI接口，请随时关注地址变更。但旧的js文件也将一直可用。

2. 全局变量和命名空间

    引入js文件后将会得到一个全局变量`FSOpen`，同时支持amd和cmd引入方式。所有接口都处在这个全局变量下，如`FSOpen.service`，`FSOpen.device`。

3. 权限验证配置

    纷享开放平台JSAPI安全验证，只有通过安全验证的微应用才能调用安全级别较高的API。  
    获取JSAPI权限验证使用的签名方法请参考附录-[JSAPI权限签名算法](#JSAPI权限签名算法)