## 纷享服务

### 通讯录
<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.contact.select</td>
      <td>选择员工和部门</td>
   </tr>	
	<tr>
      <td>service.contact.selectDepartment</td>
      <td>选择部门</td>
   </tr>	
	<tr>
      <td>service.contact.selectUser</td>
      <td>选择员工</td>
   </tr>	
	<tr>
      <td>service.contact.getMembers</td>
      <td>获取成员信息</td>
   </tr>
	<tr>
      <td>service.contact.getUsersInfo</td>
      <td>获取员工信息</td>
   </tr>	
	<tr>
      <td>service.contact.setMark</td>
      <td>关注员工或取消关注</td>
   </tr>	
	<tr>
      <td>service.contact.getServiceChannelsInfo</td>
      <td>获取服务号信息</td>
   </tr>	  
</table>

> 使用`FSOpen.util.open`接口可跳转到“个人资料页”或“部门工作页”，参考[Util]()。    

TODO：锚点

#### 关注员工或取消关注

代码样例
```javascript
FSOpen.service.contact.setMark({
    userId: 'FSUID_5174F22D77B81347E278CBD353748547',
    value: true,
    onSuccess: function(resp) {
        alert(JSON.stringify(resp));
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

方法名：FSOpen.service.contact.setMark   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数       | 类型        | 必须 | 说明         |
| -----------| ------------| -----| -------------|
| userId     | String      | 是   | 纷享用户的ID |
| value      | Boolean     | 是   | 是否关注 |

#### 获取某群组或部门的用户ID列表     

代码样例
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

方法名：FSOpen.service.contact.getMembers   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数         | 类型        | 必须 | 说明         |
| -------------| ------------| -----| -------------|
| departmentId | Number      | 是   | 如果查询对象是一个部门，则需传入部门ID。 |
| sessionId    | String      | 是   | 如果查询对象是一个部门，则需传入群组（会话）ID。如果传入了一个有效的`departmentId`，接口后会忽略`sessionId`传参。 |

成功回调返回参数：    

| 参数    | 类型          | 说明         |
| --------| --------------| -------------|
| userIds | Array[String] | 用户ID列表 |


#### 获取服务号信息     

代码样例
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

方法名：FSOpen.service.contact.getServiceChannelsInfo   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数       | 类型        | 必须 | 说明         |
| -----------| ------------| -----| -------------|
| serviceChannelIds  | Array[String]      | 是   | 服务号ID列表 |

成功回调返回参数：      

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| serviceChannels     | Object        | 用户`serviceChannel`关联数组，比如：{'FSAID_13135e9': {serviceChannelId:'',name:'',imgUrl:''}}，如果用户没找到，对应的值为空 |

`serviceChannel`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| serviceChannelId  | String| 服务号ID  |
| name      | String        | 服务号名称     |
| imgUrl    | String        | 服务号Logo地址 |

#### 获取用户信息     

代码样例
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

方法名：FSOpen.service.contact.getUsersInfo   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数       | 类型          | 必须 | 说明         |
| -----------| --------------| -----| -------------|
| userIds    | Array[String] | 是   | 用户ID列表 |

成功回调返回参数：      

| 参数      | 类型          | 说明     |
| ----------| --------------| ---------|
| users     | Object        | 用户`user`关联数组，比如：{'FSUID_XXX': {userId:'',nickname:'',email:'',avatarUrl:'',position:'',marked:true}}，如果用户没找到，对应的值为空 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户ID  |
| nickname  | String        | 用户昵称     |
| email     | String        | 用户电子邮箱 |
| avatarUrl | String        | 用户头像     |
| position  | String        | 用户职位信息 |
| marked    | Boolean       | 是否关注了此用户 |

#### 从通讯录选择人员，部门和群组     

代码样例
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

方法名：FSOpen.service.contact.select   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   | 指定控件的可选范围，只有两个情况：`company`或`custom`。当为`company`时，数据源为全公司数据列表；当为`custom`时，可通过`users`和`departments`两个参数来指定可选范围。默认为`company`。 |
| users              | Array[String] | 否   | 当`scope`为`custom`时使用，指定用户可选范围 |
| departments        | Array[Number] | 否   | 当`scope`为`custom`时使用，指定部门可选范围 |
| selectedUsers      | Array[String] | 否   | 已选中状态的用户ID列表 |
| selectedDepartments| Array[Number] | 否   | 已选中状态的部门ID列表 |
| selectedGroups     | Array[String] | 否   | 已选中状态的群组ID列表 |
| selectedCompanyAll | Boolean       | 否   | 是否已选中“全公司”，只在`showCompanyAll`为`true`时有效 |
| showRecent         | Boolean       | 否   | 是否显示最近，默认为`true` |
| showGroupTab       | Boolean       | 否   | 是否显示群组标签页，默认为`true` |
| showCompanyAll     | Boolean       | 否   | 是否显示全公司选项，默认为`true` |
| excludedUsers       | Array[String]| 否   | 过滤器，需要从当前设定范围（参考`scope`）排除掉的用户ID列表。js 2.0.0暂未实现。 |
| excludedDepartments | Array[Number]| 否   | 过滤器，需要从当前设定范围（参考`scope`）排除掉的部门ID列表。js 2.0.0暂未实现。 |
| hasEmail            | Boolean      | 否   | 过滤器，为`true`代表仅显示有Email的用户数据。不指定则全部显示。 |
| hasPhone            | Boolean      | 否   | 过滤器，为`true`代表仅显示有电话号码的用户数据。不指定则全部显示。 |

返回说明：  

| 参数        | 类型          | 说明     |
| ------------| --------------| ---------|
| users       | Array[Object] | 选择的用户`user`列表 |
| departments | Array[Object] | 选择的部门`department`列表 |
| groups      | Array[Object] | 选择的群组`group`列表 |
| selectedSum | Array[Object] | 所有选中的人的总数。如果选中了部门，则部门的人去重后计入总数。 |
| selectedCompanyAll | String | 是否选中了全公司 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户ID  |
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

#### 从通讯录选择部门     

代码样例
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

方法名：FSOpen.service.contact.selectDepartment   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   | 指定控件的可选范围，只有两个情况：`company`或`custom`。当为`company`时，数据源为全公司数据列表；当为`custom`时，可通过`departments`参数来指定可选范围。默认为`company`。 |
| departments        | Array[Number] | 否   | 当`scope`为`custom`时使用，指定部门可选范围 |
| selectedDepartments| Array[Number] | 否   | 已选中状态的部门ID列表 |
| max                | Number        | 否   | 最大选择上限，当`max=1`时为单选。默认不限制 |
| excludedDepartments| Array[Number] | 否   | 过滤器，需要从当前设定范围（参考`scope`）排除掉的部门ID列表 |

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


#### 从通讯录选择人员     

代码样例
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

方法名：FSOpen.service.contact.selectUser   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数               | 类型          | 必须 | 说明         |
| -------------------| --------------| -----| -------------|
| title              | String        | 否   | 选择控件的显示标题，默认为空 |
| scope              | String        | 否   |指定控件的可选范围，只有两个情况：`company`或`custom`。当为`company`时，数据源为全公司数据列表；当为`custom`时，可通过`users`参数来指定可选范围。默认为`company`。 |
| users              | Array[String] | 否   | 当`scope`为`custom`时使用，指定用户可选范围 |
| selectedUsers      | Array[String] | 否   | 已选中状态的用户ID列表 |
| max                | Number        | 否   | 最大选择上限，当`max=1`时为单选。默认不限制 |
| excludedUsers      | Array[String] | 否   | 过滤器，需要从当前设定范围（参考`scope`）排除掉的用户Id列表 |
| hasEmail           | Boolean       | 否   | 过滤器，为`true`代表仅显示有Email的用户数据。不指定则全部显示。 |
| hasPhone           | Boolean       | 否   | 过滤器，为`true`代表仅显示有电话号码的用户数据。不指定则全部显示。 |

返回说明：  

| 参数        | 类型          | 说明     |
| ------------| --------------| ---------|
| users       | Array[Object] | 选择的用户`user`列表 |
| selectedSum | Array[Object] | 所有选中的人的总数 |

`user`字段说明：

| 参数      | 类型          | 说明         |
| ----------| --------------| -------------|
| userId    | String        | 用户ID  |
| nickname  | String        | 用户昵称     |
| email     | String        | 用户电子邮箱 |
| avatarUrl | String        | 用户头像     |
| position  | String        | 用户职位信息 |



### 企信会话 
<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.conversation.setupFSCall</td>
      <td>发起1对1纷享电话</td>
   </tr>	
	<tr>
      <td>service.conversation.setupFSConference</td>
      <td>发起多人纷享电话会议</td>
   </tr>	
</table>

> 使用`FSOpen.util.open`接口可跳转到“企信会话窗口”，参考[Util]()。 TODO：锚点

#### 发起1对1纷享电话

代码样例
```javascript
FSOpen.service.conversation.setupFSCall({
    userId: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E']
});
``` 

方法名：FSOpen.service.conversation.setupFSCall   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| userId    | String    | 是   | 用户ID  |

#### 发起多人纷享电话会议

代码样例
```javascript
FSOpen.service.conversation.setupFSConference({
    userIds: ['FSUID_571AA7C41A11BE3D9BA25BDD397AC86E']
});
``` 

方法名：FSOpen.service.conversation.setupFSConference   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型         | 必须 | 说明         |
| ----------| -------------| -----| -------------|
| userIds   | Array[String]| 是   | 用户ID列表 |



### 收藏 

<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.favorite.add</td>
      <td>添加收藏</td>
   </tr>	
</table>

>使用`FSOpen.util.open`接口可跳转到“我的收藏”，参考[Util]()。 TODO：锚点

#### 添加收藏

代码样例
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

方法名：FSOpen.service.favorite.add   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型          | 必须 | 说明         |
| ----------| --------------| -----| -------------|
| title     | String        | 是   | 收藏标题 |
| desc      | String        | 否   | 收藏描述 |
| link      | String        | 否   | 收藏链接，默认为当前页面链接 |
| imgUrl    | String        | 否   | 收藏内容的缩略图 |
| tagList   | Array[String] | 否   | 收藏内容的标签列表 |



### 位置 


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.geo.getLocation</td>
      <td>获取当前地理位置</td>
   </tr>	
	<tr>
      <td>service.geo.selectPOI</td>
      <td>选择兴趣点</td>
   </tr>	
</table>

#### 获取当前地理位置      

代码样例
```javascript
FSOpen.service.geo.getLocation({
    onSuccess: function(resp) {
        alert('位置信息：' + JSON.stringify(resp));
    },
    onFail: function(error) {
        alert('操作失败：' + JSON.stringify(error));
    }
});
``` 

方法名：FSOpen.service.geo.getLocation   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

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

#### 选择兴趣点      

代码样例
```javascript
FSOpen.service.geo.selectPOI({
    latitude: 39.903578,
    longitude: 116.473565,
    onSuccess: function(resp) {
        alert('位置信息：' + JSON.stringify(resp));
    },
    onFail: function(error) {
        alert('操作失败：' + JSON.stringify(error));
    }
});
``` 

方法名：FSOpen.service.geo.selectPOI   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：          

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

<FOR_FS_INTERNAL_ONLY>
### 邮件 
<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.mail.shareToConversation</td>
      <td>邮件转发到企信</td>
   </tr>	
	<tr>
      <td>service.mail.shareToFeed</td>
      <td>邮件转发到工作圈</td>
   </tr>	
</table>


#### 转发邮件到企信     

代码样例
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

方法名：FSOpen.service.mail.shareToConversation  
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数     | 类型   | 必须 | 说明         |
| ---------| -------| -----| -------------|
| title    | String | 是   | 邮件标题 |
| summary  | String | 否   | 邮件摘要 |
| postTime | String | 否   | 邮件发送时间，格式：`yyyy-MM-dd hh:mm:ss` |
| url      | String | 否   | 邮件查看地址 |
| sender   | String | 否   | 发件人名称 |

#### 转发邮件到工作     

代码样例
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

方法名：FSOpen.service.mail.shareToFeed  
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数     | 类型   | 必须 | 说明         |
| ---------| -------| -----| -------------|
| title    | String | 是   | 邮件标题 |
| summary  | String | 否   | 邮件摘要 |
| postTime | String | 否   | 邮件发送时间，格式：`yyyy-MM-dd hh:mm:ss` |
| url      | String | 否   | 邮件查看地址 |
| sender   | String | 否   | 发件人名称 |

</FOR_FS_INTERNAL_ONLY>

### 支付 


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.pay.request</td>
      <td>发起支付请求</td>
   </tr>	
	<tr>
      <td>service.pay.requestForCorp</td>
      <td>发起企业支付请求</td>
   </tr>	
</table>

#### 发起支付请求     

代码样例
```javascript
FSOpen.service.pay.request({
    amount: 1,
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

方法名：FSOpen.service.pay.request  
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数       | 类型    | 必须 | 说明         |
| -----------| --------| -----| -------------|
| amount     | Number  | 是   | 支付金额，精确到分。比如2000是指20元整。单位分 |
| productId  | String  | 是   | 业务编号 |
| productName| String  | 是   | 业务名称，商家自定义 |
| merchantId | String  | 是   | 商户ID，由支付平台提供 |
| limitPayer | Boolean | 是   | 是否限制付款者，`true`-限制，`false`-不限制 |
| fromEa     | String  | 是   | 当前用户的企业号 |
| fromUid    | String  | 是   | 当前用户的userId |
| expireTime | Number  | 是   | 二维码的过期时间，格式为毫秒数 |
| signature  | String  | 是   | 最终的参数签名值 |

#### 发起企业支付请求     

代码样例
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

方法名：FSOpen.service.pay.requestForCorp  
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数         | 类型    | 必须 | 说明         |
| -------------| --------| -----| -------------|
| amount       | Number  | 是   | 支付金额，精确到分。比如2000是指20元整。单位分 |
| productId    | String  | 是   | 商品ID |
| orderNo      | String  | 是   | 订单号 |
| merchantCode | String  | 是   | 商户号 |
| remark       | String  | 否   | 交易备注 |
| subject      | String  | 是   | 商品名称 |
| body         | String  | 是   | 商品描述 |
| toEA         | String  | 否   | 收款的企业号，为空默认为纷享 |
| toEAName     | String  | 否   | 收款的企业名称，为空默认为纷享 |
| toEAWalletId | String  | 否   | 收款企业账号ID，为空默认为纷享 |
| signature    | String  | 是   | 最终的参数签名值 |



### 分享 

此类接口对应纷享菜单里的分享接口，可独立使用。

<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.share.toConversation</td>
      <td>转发到企信</td>
   </tr>	
	<tr>
      <td>service.share.toFeed</td>
      <td>转发到工作</td>
   </tr>	
      </tr>
	<tr>
      <td>service.share.toCRMContact</td>
      <td>转发到CRM联系人</td>
   </tr>	
	<tr>
      <td>service.share.toWXFriend</td>
      <td>转发给微信朋友</td>
   </tr>	
      </tr>
	<tr>
      <td>service.share.toWXMoments</td>
      <td>分享到微信朋友圈</td>
   </tr>	
	<tr>
      <td>service.share.toQQFriend</td>
      <td>转发给QQ朋友</td>
   </tr>	
      </tr>
	<tr>
      <td>service.share.viaSMS</td>
      <td>通过短信转发</td>
   </tr>	
	<tr>
      <td>service.share.viaEmail</td>
      <td>通过邮件转发</td>
   </tr>	
</table>

#### 转发到企信     

代码样例
```javascript
FSOpen.service.share.toConversation({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toConversation   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| type      | String      | 否   | 分享的资源类型，目前支持`text`-文字，`link`-链接，`image`-图片，`file`-文件。当`link`参数为空时，默认`text`类型，否则默认为`link`类型。 |
| title     | String      | 否   | 资源类型为`link`时使用，表示分享标题，默认当前页面标题 |
| desc      | String      | 否   | 资源类型为`link`时使用，表示分享摘要描述，默认当前页面描述（`<meta name="description" content="网页摘要内容在这里填写">`标签中的内容），取不到则显示页面URL。|
| link      | String      | 否   | 资源类型为`link`时使用，表示分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 资源类型为`link`时使用，表示分享缩略图地址，默认为纷享预置图标 |
| name      | String      | 否   | 资源类型为`image`或`file`时使用，表示资源名 |
| size      | String      | 否   | 资源类型为`image`或`file`时使用，表示资源大小 |
| npath     | String      | 否   | 资源类型为`image`或`file`时使用，表示资源存储地址。资源需是存储在纷享平台上，采用N-Path地址引用，如`N_201512_08_101239c8308f4ea7325f69df4fba386f1.pptx`。 |
| content   | String      | 否   | 资源类型为`text`时使用，表示文件内容 |

#### 转发到工作流     

代码样例
```javascript
FSOpen.service.share.toFeed({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toFeed   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| type      | String      | 否   | 分享的资源类型，目前支持`text`-文字，`link`-链接，`image`-图片，`file`-文件。当`link`参数为空时，默认`text`类型，否则默认为`link`类型。 |
| title     | String      | 否   | 资源类型为`link`时使用，表示分享标题，默认当前页面标题 |
| desc      | String      | 否   | 资源类型为`link`时使用，表示分享摘要描述，默认当前页面描述（`<meta name="description" content="网页摘要内容在这里填写">`标签中的内容），取不到则显示页面URL。 |
| link      | String      | 否   | 资源类型为`link`时使用，表示分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 资源类型为`link`时使用，表示分享缩略图地址，默认为纷享预置图标 |
| name      | String      | 否   | 资源类型为`image`或`file`时使用，表示资源名 |
| size      | String      | 否   | 资源类型为`image`或`file`时使用，表示资源大小 ，单位为kb。 TODO： 林惠 kb？|
| npath     | String      | 否   | 资源类型为`image`或`file`时使用，表示资源存储地址。资源需是存储在纷享平台上，采用N-Path地址引用，如`N_201512_08_101239c8308f4ea7325f69df4fba386f1.pptx`。 |
| content   | String      | 否   | 资源类型为`text`时使用，表示文件内容 |

#### 转发给CRM联系人   

代码样例
```javascript
FSOpen.service.share.toCRMContact({
    link: location.href,
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toCRMContact   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| link      | String      | 否   | 要转发的页面链接 |

#### 分享给微信好友     

代码样例
```javascript
FSOpen.service.share.toWXFriend({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toWXFriend   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为纷享预置图标 |

#### 分享到微信朋友圈     

代码样例
```javascript
FSOpen.service.share.toWXMoments({
    title: '纷享逍客',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toWXMoments   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为纷享预置图标 |

#### 分享给QQ好友     

代码样例
```javascript
FSOpen.service.share.toQQFriend({
    title: '纷享逍客',
    desc: '移动办公 自在纷享',
    link: 'http://www.fxiaoke.com',
    imgUrl: 'https://www.fxiaoke.com/static/img/index/logo.png?v=5.1.5',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.toQQFriend   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 分享标题，默认当前页面标题 |
| desc      | String      | 否   | 分享摘要描述，默认当前页面描述（`<meta name="description" content="网页摘要内容在这里填写">`标签中的内容），取不到则显示页面URL。|
| link      | String      | 否   | 分享链接地址，默认当前页面链接 |
| imgUrl    | String      | 否   | 分享缩略图地址，默认为纷享预置图标 |


#### 通过短信转发     

代码样例
```javascript
FSOpen.service.share.viaSMS({
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.viaSMS   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| content   | String      | 否   | 转发内容，最多140字，可使用{url}替换符来表示当前页面的url |



#### 通过邮件转发     

代码样例
```javascript
FSOpen.service.share.viaMail({
    title: '纷享逍客',
    content: '移动办公，自在纷享 {url}',
    onSuccess: function(resp) {
        // 可以在这里做些分享数据统计
        alert('分享成功');
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

方法名：FSOpen.service.share.viaMail   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型        | 必须 | 说明         |
| ----------| ------------| -----| -------------|
| title     | String      | 否   | 转发邮件标题 |
| content   | String      | 否   | 转发邮件内容，可使用`{url}`(5个字符)来表示当前页面的URL，后台会在最终内容中替换。 |

### 日历 


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.calendar.createEvent</td>
      <td>创建日程</td>
   </tr>		
</table>

>使用`FSOpen.util.open`接口可跳转到“日历”，参考[Util]()。 TODO：锚点

#### 创建日程提醒     

代码样例
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

方法名：FSOpen.service.calendar.createEvent   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| content   | String    | 否   | 日程提醒内容 |



### 工作流 


<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.feed.create</td>
      <td>创建一条工作</td>
   </tr>	
</table>

>使用`FSOpen.util.open`接口可跳转到“工作详情”，参考[Util]()。 TODO：锚点

#### 创建一条工作    

代码样例
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

方法名：FSOpen.service.feed.create   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| type      | String    | 否   | 工作类型：`share`-分享，`diary`-日志，`approval`-审批，`task`-任务，`schedule`-日程，`order`-指令，不指定则由用户自行选择 |
| content   | String    | 否   | 工作文本内容，除任务外，均默认赋值到各类型工作的第一个字段，比如日报填入到“今日工作”；任务则填入到第二个字段“备注” |

### 网盘 

<table>
   <tr>
      <td>接口名</td>
      <td>接口描述</td>
   </tr>
	<tr>
      <td>service.disk.addFile</td>
      <td>文件保存到网盘</td>
   </tr>	
	<tr>
      <td>service.disk.selectFile</td>
      <td>从网盘中选取文件</td>
   </tr>	
</table>

#### 将文件保存到网盘     


```javascript
FSOpen.service.disk.addFile({
    fileName: '纷享逍客培训.pptx',
    fileNPath: 'N_201606_29_f13bbed15ba14413bc0aef29be255817.pptx',
    onSuccess: function(resp) {
        alert('保存成功');
    },
    onFail: function(error) {
        alert('保存失败，错误码：' + error.errorCode);
    }
});
```

方法名：FSOpen.service.disk.addFile   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

调用参数说明：      

| 参数      | 类型      | 必须 | 说明         |
| ----------| ----------| -----| -------------|
| fileName  | String    | 是   | 存储文件名称，需要带上文件后缀 |
| fileNPath | String    | 是   | 文件地址。资源需是存储在纷享平台上，采用N-Path地址引用，如`N_201512_08_101239c8308f4ea7325f69df4fba386f1.pptx`。  |

#### 从网盘选择文件     

代码样例
```javascript
FSOpen.service.disk.selectFile({
    onSuccess: function(resp) {
        alert('文件信息：' + JSON.stringify(resp));
    },
    onFail: function(error) {
        alert('操作失败，错误码：' + error.errorCode);
    }
});
``` 

方法名：FSOpen.service.disk.selectFile   
JS版本：2.0.0    
客户端支持版本：5.4.0及以上     

成功回调返回参数：      

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| file      | Object    | 文件信息 |

`file`字段说明：

| 参数      | 类型      | 说明     |
| ----------| ----------| ---------|
| id        | String    | 文件ID信息 |
| fileName  | String    | 文件名 |
| fileNPath | String    | 文件地址。资源需是存储在纷享平台上，采用N-Path地址引用，如`N_201512_08_101239c8308f4ea7325f69df4fba386f1.pptx`。 |
| size      | Number    | 文件大小，以字节为单位 |
| url       | String    | 可通过HTTP连接访问的文件地址 |