## 媒体
### 文件 

<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>media.file.download</td>
      <td>下载文件</td>
   </tr>
	<tr>
      <td>media.file.preview</td>
      <td>预览文件</td>
   </tr>	   
</table>

#### 文件下载
此接口仅适用于Android系统。

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

方法名：FSOpen.media.file.download   
JS版本：2.0.0       
客户端支持版本：5.4.0及以上     

参数说明  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileUrl   | String    | 是   | 要下载的文件地址，支持N-Path地址和标准的HTTP链接地址 |
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

#### 文件预览

代码样例
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

方法名：FSOpen.media.file.preview   
JS版本：2.0.0       
客户端支持版本：5.4.0及以上     

参数说明  

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileNPath | String    | 是   | 文档所对应的N-Path地址，资源需是存储在纷享平台上，采用N-Path地址引用，如`N_201512_08_101239c8308f4ea7325f69df4fba386f1.pptx`。目前支持的文件后缀有`doc``docx``pdf``ppt``pptx`等通用文档格式。 |


### 图片 


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>media.image.preview</td>
      <td>预览图片</td>
   </tr>	   
</table>

#### 图片预览

代码样例
```javascript
FSOpen.media.image.preview({
    index: 0,
    imgUrls: [
        'https://www.fxiaoke.com/static/img/index/icon-wx-small.png?v=5.1.5',
        'https://www.fxiaoke.com/static/img/index/icon-kh-small.jpg?v=5.1.5'
    ]
});
``` 

方法名：FSOpen.media.image.preview   
JS版本：2.0.0       
客户端支持版本：5.4.0及以上     

参数说明  

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| index     | Number        | 否   | 从第几张图片开始预览，索引从0开始计算。默认为0 |
| imgUrls   | Array[String] | 是   | 图片地址列表，默认为空 |
