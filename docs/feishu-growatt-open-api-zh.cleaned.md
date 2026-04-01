# Growatt Open API（中文版）

版本：V1.0
发布时间：2026年3月4日

# 1 OAuth2.0 授权模式说明
- 第三方平台，联系Growatt工作人员，申请 `clientId/clientSecret`，用于对接Growatt OAuth2服务器
- 用于接收Growatt推送设备实时数据的URL，第三方平台，需自行开发，提供给Growatt的URL的对应功能
## **授权码(Authorization Code)模式**
> 该模式对应Growatt用户具备个人账号的情况

1.  Growatt提供订制内嵌登录页HTML5。第三方平台将登录页集成到自己的应用中。如下图:
1.  第三方平台，开发OAuth2.0流程客户端相关功能。
1.  Growatt提供订制内嵌登录页HTML5。第三方平台将登录页集成到自己的应用中。
1.  借助内嵌Growatt登录页，Growatt终端用户完成 OAuth2.0流程。从而第三方平台，得到Growatt终端用户的授权信息，用于后续调用API。
1. 一个OAuth2.0授权信息，对应，一个Growatt终端用户与其指定授权的一个第三方平台。授权信息时效有限，在一段时间后会过期。
1. 第三方平台，在得到Growatt终端用户的OAuth2.0授权信息后，需要开发功能:
> - *建立Growatt终端账号与第三方平台账号的对应关系。*
> *自行维护授权信息的有效期限，过期后需刷新。*
> *如果刷新凭证也过期了，则需要Growatt终端用户，重新进行一次OAuth2.0步骤，再次授权。*

1. 第三方平台，开发功能对应此文档API提供的功能。在第三方平台应用中，第三方平台的用户，操作他对应的Growatt终端账号下，已授权的设备时，通过调用Growatt API，实现相关功能。
1. 第三方平台，开发功能对应此文档API提供的功能。在第三方平台应用中，第三方平台的用户，操作他对应的Growatt终端账号下，已授权的设备时，通过调用Growatt API，实现相关功能。
## **客户端(Client Credentials)模式**
> 该模式对应第三方平台直接对接Growatt平台情况

1.  Growatt提供获取基于标准Client Credentials流程的接口
1.  第三方平台，开发OAuth2.0流程客户端相关功能
1.  第三方平台调用授权接口获取access_token（时效有限，在一段时间后会过期），
1. 第三方平台，在得到Growatt终端用户的OAuth2.0授权信息后，需要开发功能:
> *自行维护授权信息的有效期限，过期后需刷新。*
> *如果刷新凭证也过期了，则需要Growatt终端用户，重新进行一次OAuth2.0步骤，再次授权。*

1. 第三方平台，开发功能对应此文档API提供的功能。以实现设备授权、设备调度、设备数据查询等操作。

# 2 OAuth2.0 授权流程简述

## **授权码(Authorization Code)模式**

- 【初次授权/token过期后再次授权】当Growatt终端用户，需要授权个人账号时，第三方平台打开Growatt登录页，登录Growatt个人账号
- 终端用户登录成功，确认授权，生成并携带OAuth2.0授权码，从Growatt页面，跳转到，第三方平台指定的重定向URL
- 第三方平台通过重定向URL，收到OAuth2.0授权码之后，
将授权码换取Growatt终端用户授权信息：
`access_token`（访问凭证），`refresh_token`（刷新凭证），`expire_time`（访问凭证有效期限，单位秒），`refresh_expires_in`（刷新凭证有效期限，单位秒）
> - *{*
> *“access_token”: “lyoAlLQaRr9y5pMFsEmh7gyUAaVuBCQo1V7FlwNeA22o7vAH2DJSVqEKkGh4”,*
> *“refresh_token”: “wx71QkaF7vceFg9UwjUtum498XeYhXZiCu7iQvAeXQ1AMslXXe2SELJ8cd3a”,*
> *“refresh_expires_in”: 2592000,*
> *“token_type”: “Bearer”,*
> *“expires_in”: 7200*
> *}*

- 第三方平台自行开发功能，保存维护OAuth2.0，Growatt终端用户授权信息。将第三方平台用户与Growatt终端用户授权信息，建立对应关联。
- 第三方平台，在调用此API时，在请求头中，携带Growatt终端用户授权信息。如果授权信息正确且在有效期限内，则可成功调用。
- Growatt终端用户授权信息时效有限，在一段时间后会过期。第三方平台，需要自行维护授权信息的有效期限。
> - *access_token 过期后，可以使用 refresh_token，通过请求 *`*OAuth2.0--refresh*`* 接口，刷新access_token**。*
> - *当 refresh_token 也过期了，无法刷新 access_token 时，需要Growatt终端用户，重新进行一次OAuth2.0步骤，再次授权。*
> - *access_token 有效期**7天**，refresh_token 有效期 30 天*

- 设备相关功能操作，需要调用【设备授权】相关接口，让Growatt终端用户，管理授权下属设备。
- 只有已授权的设备，才可通过API进行操作，以及推送数据到第三方平台指定URL。
## **客户端(Client Credentials)模式**

- 第三方平台通过client、client secret调用授权接口获取access_token，服务器返回如下:`access_token`（访问凭证），`expire_time`（访问凭证有效期限，单位秒）
> - *{*
> *“access_token”: “lyoAlLQaRr9y5pMFsEmh7gyUAaVuBCQo1V7FlwNeA22o7vAH2DJSVqEKkGh4”,*
> *“token_type”: “Bearer”,*
> *“expires_in”: 7200*
> *}*

- 第三方平台，在调用API时，在请求头中，携带授权信息。如果授权信息正确且在有效期限内，则可成功调用。
- Growatt终端用户授权信息时效有限，在一段时间后会过期。第三方平台，需要自行维护授权信息的有效期限。
> - *access_token 过期后，需要再次调用token接口获取新的access_token。*
> - *access_token 有效期7天*

- 设备相关功能操作，需要调用【设备授权】相关接口，管理授权下属设备。
- 只有已授权的设备，才可通过API进行操作，以及推送数据到第三方平台指定URL。

# 3 接口列表

## 3.1 获取access_token
##### 简要描述
- OAuth2，token
- 授权码模式下Client后端用授权码换access_token
- 客户端模式下Client后端通过client_id,client_secret换access_token
##### 请求URL
- `/oauth2/token`
##### 请求方式
- POST
- ContentType：application/x-www-form-urlencoded;
请求参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_F58Ogq），未导出具体表格内容。_

##### 请求示例
```plaintext
## authorization_code模式
{
    "grant_type": "authorization_code", 
    "code": "by1c6oH8lLpllkczRFxuKnMWTEQPO8GmpqkcnDhOcRjLFF4BU5hBvt6whdmd", 
    "client_id": "client123", 
    "client_secret": "secret123",
    "redirect_uri": "http://localhost:9290/hello"
}

## client_credentials模式
{
    "grant_type": "client_credentials",  
    "client_id": "client123", 
    "client_secret": "secret123",
    "redirect_uri": "http://localhost:9290/hello"
}
```

返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_WrZt9t），未导出具体表格内容。_

##### 返回示例
```plaintext
// 授权成功，http状态码200
{
    "access_token": "avYDaEcmPfaphbE8oDmraKM6FOzq7nYI42iz4KTLClpvWegyREQnyiYUG2VA",
    "refresh_token": "BG6DGTZYpZPq0PHei3N4Rvb2yjM4YMZEFrvrf1A8LxI1xKbH2aEOHG3zfNy9",
    "refresh_expires_in": 2592000, 
    "token_type": "Bearer", 
    "expires_in": 7200 
}
```

## 3.2 OAuth2-refresh
##### 简要描述
- OAuth2，refresh
- Client后端用refresh_token，刷新access_token
##### 请求URL
- /oauth2/refresh
##### 请求方式
- POST
- ContentType：application/x-www-form-urlencoded;
请求参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_BcAZXd），未导出具体表格内容。_

##### 请求示例
```plaintext
{
    "grant_type": "refresh_token", //string，非空，必须为authorization_code，OAuth2要求"refresh_token": "bkabsDaCYRWVPHMPqYij1O2rEWPNc34dH97FmQsDzuaopf1RxdDofp63HL4x",
    "client_id": "client123", //string，非空，第三方向古瑞申请的client_id，必须传递正确"client_secret": "secret123" //string，非空，第三方向古瑞申请的client_secret，必须传递正确
}
```

返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_aGxdM8），未导出具体表格内容。_

##### 返回示例
```plaintext
// 授权成功，http状态码200
{
    "access_token": "avYDaEcmPfaphbE8oDmraKM6FOzq7nYI42iz4KTLClpvWegyREQnyiYUG2VA",
    "refresh_token": "BG6DGTZYpZPq0PHei3N4Rvb2yjM4YMZEFrvrf1A8LxI1xKbH2aEOHG3zfNy9",
    "refresh_expires_in": 2592000, //refresh_token的有效时长，单位秒"token_type": "Bearer", //token类型"expires_in": 7200 //access_token的有效时长，单位秒
}
```

## 3.3 设备授权
### 3.3.1 获取可授权的设备列表
##### 简要描述
- 获取Growatt终端用户个人账号下，可授权的设备列表
- 前提，终端用户已注册Growatt账号，并在账号下配网添加设备
- **仅authorization_code模式下支持**
- authFlag为false代表未授权
##### 请求URL
- /oauth2/getDeviceList
##### 请求方式
- POST
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
##### 请求示例
```plaintext
// 无参数
```

返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_QE53rl），未导出具体表格内容。_

##### 返回示例
```plaintext
// 成功，code=0
{
    "code": 0,
    "data": [
        {
            "deviceSn": "HCQSKJMSJ1",
            "deviceTypeName": "sph-s",
            "model": "SPH 10000TL-HU (AU)",
            "nominalPower": 15000,
            "datalogSn": "ZGQ0E8511G",
            "dtc": 21300,
            "communicationVersion": "ZCEA-0005",
            "authFlag": true
        },
        {
            "deviceSn": "QHU1234567",
            "deviceTypeName": "min",
            "model": "MIN 5000TL-XH2",
            "nominalPower": 6000,
            "datalogSn": "ZGQ0F6P208",
            "dtc": 5100,
            "communicationVersion": "ZABA-0023",
            "authFlag": false
        }
    ],
    "message": "SUCCESSFUL_OPERATION"
}

// 失败，code非0
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

data 参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_QzdH9S），未导出具体表格内容。_

### 3.3.2 授权设备
##### 简要描述
- 授权Growatt终端用户下的设备给第三方
##### 请求URL
- /oauth2/bindDevice
##### 请求方式
- POST
- ContentType：application/json;
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
##### 请求示例
请求参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_6OHkc5），未导出具体表格内容。_

```plaintext
## 授权码模式下
{
        "deviceSnList": [
                {
                        "deviceSn": "LXG1234567"
                },
                {
                        "deviceSn": "EGM1234567"
                },
                {
                        "deviceSn": "WAQ1234567"
                },
                {
                        "deviceSn": "LPL1234567"
                }
        ]
}
## 客户端模式下
{
        "deviceSnList": [
                {
                        "deviceSn": "LXG1234567",
                        "pinCode": "123"
                },
                {
                        "deviceSn": "EGM1234567",
                        "pinCode": "456"
                },
                {
                        "deviceSn": "WAQ1234567",
                        "pinCode": "789"
                },
                {
                        "deviceSn": "LPL1234567",
                        "pinCode": "ABC"
                }
        ]
}
```

##### 返回示例
返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_gqbxmG），未导出具体表格内容。_

```plaintext
// 成功，code=0
{
    "code": 0,
    "data": null,
    "message": "SUCCESSFUL_OPERATION"
}

// 失败，code非0
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}

{
    "code": 12,
    "data": [
        "WAQ1234567"
    ],
    "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

### 3.3.3 获取已授权的设备列表
##### 简要描述
- 获取Growatt终端用户个人账号下，已经授权的设备列表
- 前提，终端用户已注册Growatt账号，并在账号下配网添加设备
##### 请求URL
- /oauth2/getDeviceListAuthed
##### 请求方式
- POST
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
##### 请求示例
```plaintext
// 无参数
```

##### 返回示例
返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_NY9nfO），未导出具体表格内容。_

```plaintext
// 成功，code=0
{
    "code": 0,
    "data": [
        {
            "deviceSn": "HCQSKJMSJ1",
            "deviceTypeName": "sph-s",
            "model": "SPH 10000TL-HU (AU)",
            "nominalPower": 15000,
            "datalogSn": "ZGQ0E8511G",
            "dtc": 21300,
            "communicationVersion": "ZCEA-0005",
            "authFlag": true
        }
    ],
    "message": "SUCCESSFUL_OPERATION"
}

// 失败，code非0
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

data返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_XSQDmP），未导出具体表格内容。_

### 
### 3.3.4 解除授权设备
##### 简要描述
- 将Growatt终端用户，授权给第三方的下属设备，解除授权
##### 请求URL
- /oauth2/unbindDevice
##### 请求方式
- POST
- ContentType: application/json;
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
##### 请求示例
请求参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_TXwkZt），未导出具体表格内容。_

```plaintext
{
    "deviceSnList": [ 
        "LXG1234567",
        "LPL1234567"
    ]
}
```

##### 返回示例
返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_lzzT3b），未导出具体表格内容。_

```plaintext
// 成功，code=0
{
    "code": 0,
    "data": null,
    "message": "SUCCESSFUL_OPERATION"
}

// 失败，code非0
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

## 3.4 设备调度
### 
##### 简要描述
- 根据设备的SN来设置设备的相关参数，接口返回的数据只返回密钥token有权限访问的设备设置结果，无权限的设备将不予设置，会返回DEVICE_SN_DOES_NOT_HAVE_PERMISSION错误
- `当前接口频率``每个设备``5S一次`
##### 请求URL
- /oauth2/deviceDispatch
##### 请求方式
- POST
- ContentType：application/json;
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer

Http body参数和说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_waomfD），未导出具体表格内容。_

接口返回参数和说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_Huj5nx），未导出具体表格内容。_

##### 请求示例
```plaintext
{
    "deviceSn": "TEST123456",
    "value": {
        "duration": 10,
        "percentage": 20,
        "type": "dischargeCommand"
    },
    "setType": "duration_and_power_charge_discharge",
    "requestId": "32位字符串(yyyyMMddHHmmssSSSxxxxxxxxxxxxxxx)"
}
```

##### 返回示例
设置成功
```plaintext
 {
    "code": 0,
    "data": null,
    "message": "PARAMETER_SETTING_SUCCESSFUL"
}
```

设备离线
```plaintext
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

参数设置响应超时
```plaintext
{
    "code": 16,
    "data": null,
    "message": "PARAMETER_SETTING_RESPONSE_TIMEOUT"
}
```

设备未回复
```plaintext
{
    "code": 15,
    "data": null,
    "message": "PARAMETER_SETTING_DEVICE_NOT_RESPONDING"
}
```

设备回复失败
```plaintext
{
    "code": 6,
    "data": null,
    "message": "PARAMETER_SETTING_FAILED"
}
```

## 3.5 读取设备调度参数
### 
##### 简要描述
- 根据设备的SN来读取设备的相关参数，接口返回的数据只返回秘钥token有权限访问的设备读取结果，无权限的设备将不予读取，会返回DEVICE_SN_DOES_NOT_HAVE_PERMISSION错误
- `当前接口频率``每个设备``5S一次`
##### 请求URL
- /oauth2/readDeviceDispatch
##### 请求方式
- POST
- ContentType： application/json;
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer

Http body参数和说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_AKVdR4），未导出具体表格内容。_

接口返回参数和说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_Tnf0GM），未导出具体表格内容。_

##### 请求示例
```plaintext
{
"deviceSn": "FDCJQ00003",
"setType": "time_slot_charge_discharge"
}
```

##### 返回示例
设置成功
```plaintext

 {
    "code": 0,
    "data": [
        {
            "startTime": "16:00",   //开始时间（utc+0）
            "endTime": "18:00", //结束时间（utc+0）
            "percentage": 80 //充放电功率百分比(正充负放)
        },
        {
            "startTime": "19:00",
            "endTime": "21:00",
            "percentage": -80
        }
    ],
    "message": "success"
}
```

设备离线
```plaintext
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

读取参数失败
```plaintext
{
    "code": 18,
    "data": null,
    "message": "READ_DEVICE_PARAM_FAIL"
}
```

## 3.6 设备信息查询
##### 简要描述
- 获取Growatt平台，已授权的设备信息，接口返回的数据只返回秘钥token有权限访问的设备查询结果，无权限的设备将不予查询，会返回DEVICE_SN_DOES_NOT_HAVE_PERMISSION错误
##### 请求URL
- /oauth2/getDeviceInfo
##### 请求方式
- POST
- Content-Type：application/json、
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
HTTP 头部参数及说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_LGyprP），未导出具体表格内容。_

HTTP Body 参数及说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_IMGuUC），未导出具体表格内容。_

接口返回参数和说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_uZJKFC），未导出具体表格内容。_

##### 请求示例
```plaintext
{
"deviceSn": "FDCJQ00003"
}
```

##### 返回示例
```plaintext
// 成功，code=0
{
    "code": 0,
    "data": 

        {
            "deviceSn": "USQ1234567",
            "deviceTypeName": "min",
            "model": "BDCBAT",
            "nominalPower": 6000,
            "datalogSn": "XGD6E3P029",
            "datalogDeviceTypeName": "ShineWiFi-X",
            "dtc": 5100,
            "communicationVersion": "ZABA-0021",
            "existBattery": true,
            "batterySn": "0YXH123456789632",
            "batteryModel": "ARK 5.12-25.6XH-A1",
            "batteryCapacity": 5000,
            "batteryNominalPower": 2500,
            "authFlag": true,
            "batteryList": [
                {
                    "batterySn": "0YXH123456789632",
                    "batteryModel": "ARK 5.12-25.6XH-A1",
                    "batteryCapacity": 5000,
                    "batteryNominalPower": 2500
                }
            ]
        },

    "message": "SUCCESSFUL_OPERATION"
}

// 失败，code非0
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

data 参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_5kLYHc），未导出具体表格内容。_

## 3.7 设备数据查询
##### 简要描述
- 根据设备序列号,查询指定设备的高频数据。接口返回的数据只返回秘钥token有权限访问的设备查询结果，无权限的设备将不予查询，会返回DEVICE_SN_DOES_NOT_HAVE_PERMISSION错误
##### 请求URL
- /oauth2/getDeviceData
##### 请求方式
- POST
- Content-Type：application/json
- 请求头，必须携带，有效的 access_token，放入请求头中的，Authorization 参数，并且，需要带前缀 Bearer
HTTP 头部参数及说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_iewtbH），未导出具体表格内容。_

HTTP Body 参数及说明：
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_srjhbN），未导出具体表格内容。_

接口返回参数和说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_HWl6nI），未导出具体表格内容。_

##### 请求示例
```plaintext
{
  "deviceSn": "FDCJQ00003"
}
```

##### 返回示例
```json
{
    "code": 0,
    "data": {
        "fac": 50.03,
        "backupPower": 0.20,
        "batPower": 0.00,
        "pac": 41.30,
        "etoUserToday": 3.10,
        "meterPower": 0.00,
        "utcTime": "2026-03-13 07:48:25",
        "etoUserTotal": 44.80,
        "pexPower": 14.30,
        "batteryList": [
            {
                "chargePower": 0.00,
                "soc": 67,
                "echargeToday": 2.90,
                "vbat": 53.30,
                "index": 1,
                "echargeTotal": 80.70,
                "dischargePower": 0.00,
                "edischargeToday": 1.90,
                "ibat": -1.00,
                "soh": 100,
                "edischargeTotal": 57.60,
                "status": 0
            }
        ],
        "protectCode": 0,
        "reactivePower": 174.90,
        "serialNum": "YRP0N4S00Q",
        "etoGridTotal": 270.70,
        "genPower": 0.00,
        "priority": 0,
        "vac3": 236.90,
        "etoGridToday": 1.50,
        "protectSubCode": 0,
        "vac2": 236.90,
        "vac1": 236.90,
        "payLoadPower": 14.50,
        "faultCode": 0,
        "faultSubCode": 0,
        "batteryStatus": 0,
        "ppv": 14.30,
        "smartLoadPower": 0.00,
        "status": 6
    },
    "message": "SUCCESSFUL_OPERATION"
}
```

返回参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_71dj4m），未导出具体表格内容。_

注意： 状态值定义
设备运行状态 (status)
0: 待机
1: 自检
3: 故障
4: 升级
5: 光伏在线 & 电池离线 & 并网
6: 光伏离线 (或在线) & 电池在线 & 并网
7: 光伏在线 & 电池在线 & 离网
8: 光伏离线 & 电池在线 & 离网
9: 旁路模式
电池总体状态 (batteryStatus)
0: 电池待机
1: 电池断开
2: 电池充电
3: 电池放电
4: 故障
5: 升级
工作优先级 (priority)
0: 负载优先
1: 电池优先
2: 电网优先

## 3.8 设备数据推送
##### 简要描述
- 第三方平台需自行开发，接收数据的功能接口，并提供Growatt相应的URL
- 归属于第三方平台下的设备，将会每隔一段时间，往提供Growatt的URL中，指定高频率更新的推送数据
##### 推送示例
```plaintext

    {
     "data": {
        "activePower": 0.00,
        "batPower": -4816.00,
        "batteryList": [
            {
                "chargePower": 0.00,
                "dischargePower": 2511.00,
                "ibat": -6.40,
                "index": 1,
                "soc": 100,
                "vbat": 376.50
            },
            {
                "chargePower": 0.00,
                "dischargePower": 2305.00,
                "ibat": -6.10,
                "index": 2,
                "soc": 100,
                "vbat": 375.80
            }
        ],
        "batteryStatus": 3,
        "pac": 4562.80,
        "payLoadPower": 365.90,
        "ppv": 0.00,
        "priority": 2,
        "reverActivePower": 4450.10,
        "deviceSn": "TEST123456",
        "soc": 100,
        "status": 6,
        "utcTime": "2026-02-25 00:10:01",
        "vac1": 234.64,
        "vac2": 235.04,
        "vac3": 234.17
    },
    "dataType": "dfcData"
    }
```

参数说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_UqiZ4B），未导出具体表格内容。_

注意： 状态值定义
设备运行状态 (status)
0: 待机
1: 自检
3: 故障
4: 升级
5: 光伏在线 & 电池离线 & 并网
6: 光伏离线 (或在线) & 电池在线 & 并网
7: 光伏在线 & 电池在线 & 离网
8: 光伏离线 & 电池在线 & 离网
9: 旁路模式
电池总体状态 (batteryStatus)
0: 电池待机
1: 电池断开
2: 电池充电
3: 电池放电
4: 故障
5: 升级
工作优先级 (priority)
0: 负载优先
1: 电池优先
2: 电网优先

# 4 全局参数说明
### 域名
正式环境：
https://opencloud.growatt.com
https://opencloud-au.growatt.com
测试环境：
https://opencloud-test.growatt.com
https://opencloud-test-au.growatt.com

### HTTP请求头说明
简要描述：
- 调用API时需要access_token
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_8ifm36），未导出具体表格内容。_

### 返回码说明
```json
{
    "code": 0,
    "data": object or null
    "message": "SUCCESSFUL_OPERATION（OR Other）"
}
```

```json
{
    "code": 12,
    "data": [
        "WAQ1234567"
    ],
    "message": "DEVICE_SN_DOES_NOT_HAVE_PERMISSION"
}
```

```json
{
    "code": 2,
    "message": "TOKEN_IS_INVALID"
}
```

```json
{
    "code": 5,
    "data": null,
    "message": "DEVICE_OFFLINE"
}
```

```json
{
    "code": 18,
    "data": null,
    "message": "READ_DEVICE_PARAM_FAIL"
}
```

```json
{
    "code": 16,
    "data": null,
    "message": "PARAMETER_SETTING_RESPONSE_TIMEOUT"
}
```

```json
{
    "code": 15,
    "data": null,
    "message": "PARAMETER_SETTING_DEVICE_NOT_RESPONDING"
}
```

```json
{
    "code": 6,
    "data": null,
    "message": "PARAMETER_SETTING_FAILED"
}
```

### 设备参数说明
简要描述：
- 每个设置参数的参数枚举、参数说明、参数值说明
_原文此处为飞书表格嵌入（token: YKJAskc9QhveoItPncOcj1k6n2c_iQxQ7G），未导出具体表格内容。_

## 5.附件

### 测试报告
oauth2-openApi平台接口测试报告（飞书文档引用，type: wiki，token: WkkZwLyuDi0Dbyk31AlcXUe7nGh）
### Evergen相关文档
Evergen命令对齐表（飞书文档引用，type: sheet，token: Gcvcs3YwFhrkcetfxurcMHSIn3c）
MIN-XH or XH2_Evergen_ API(2)（飞书文档引用，type: wiki，token: Vq4vwZKy0iyTtTkUhPfcderhnGf）
