# 基于最新全球 OAuth2 测试报告的文档逐项对比

对比日期：2026-04-08

状态说明：

- 本文件保留“修正前审计基线”与差异分析。
- 2026-04-08 当天已将其中的全球环境入口、`bindDevice data: 1`、TTL 实测值、`refresh` 后旧 token 失效等结论同步到公开文档的 Quick Guide、FAQ、`token`、`refresh`、`device auth` 页面。

测试报告基线：

- `test/oauth2-openApi-platform-global-test-report-2026-03-27.md`

对照文档基线：

- `docs/3 接口列表.md`
- `Growatt API/OPENAPI.zh-CN/01_authentication.md`
- `Growatt API/OPENAPI.zh-CN/02_api_access_token.md`
- `Growatt API/OPENAPI.zh-CN/03_api_refresh.md`
- `Growatt API/OPENAPI.zh-CN/04_api_device_auth.md`
- `Growatt API/OPENAPI.zh-CN/07_api_device_info.md`
- `Growatt API/OPENAPI.zh-CN/08_api_device_data.md`
- `Growatt API/OPENAPI.zh-CN/10_global_params.md`
- `Growatt API/OPENAPI.zh-CN/11_api_troubleshooting.md`
- `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`

## 结论摘要

- 现有自动化测试已跑通：`npm test` 通过。
- 文档检查链路已跑通：`npm run docs:check` 通过。
- 以 2026-03-27 最新全球联调报告为准，核心 OAuth2 / 设备授权 / 设备查询链路与当前文档主体是对齐的。
- 本轮对比发现 3 类需要单独标注的差异：
  - 文档未显式覆盖全球环境的前端登录入口与授权码入口：`/#/login`、`/prod-api/login`、`/prod-api/auth`
  - `bindDevice` 成功响应示例与实测值存在漂移：文档示例为 `data: null`，实测返回 `data: 1`
  - `token/refresh` 的示例 TTL 与实测 TTL 不一致，且文档未显式说明“`refresh` 后旧 access token 立即失效”

## 逐项对比矩阵

| 测试报告项 | 实测结果 | 对照文档 | 结论 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| 前端登录页 `/#/login`、`POST /prod-api/login`、`GET /prod-api/auth` | 全部通过，且报告明确这是真实可用入口 | `docs/3 接口列表.md` 从 `/oauth2/token` 开始；`Growatt API/OPENAPI.zh-CN/01_authentication.md` 只抽象描述“打开 Growatt 登录页/获取 authorization code” | 文档未显式覆盖 | 当前文档没有写错，但没有把全球环境实际入口写出来 |
| `POST /oauth2/token` | 通过 | `docs/3 接口列表.md:13-70`；`Growatt API/OPENAPI.zh-CN/02_api_access_token.md:5-87`；`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:48,61` | 主体一致，示例值有漂移 | 请求方式、参数、`redirect_uri` 口径一致；但文档示例 `expires_in=7200`、`refresh_expires_in=2592000`，报告实测为 `604733` / `2585309` |
| `POST /oauth2/getDeviceList` | 通过，返回 `deviceSn=WCK6584462`、`datalogSn=ZGQ0E820UH` | `docs/3 接口列表.md:142-209`；`Growatt API/OPENAPI.zh-CN/04_api_device_auth.md:38-105`；`Growatt API/OPENAPI.zh-CN/11_api_troubleshooting.md:46` | 一致 | 文档已区分 `deviceSn` 与 `datalogSn`；FAQ 也已建议设备级接口使用纯 `deviceSn` |
| `POST /oauth2/bindDevice` | 通过，请求体为对象数组；本轮未要求 `pinCode` | `docs/3 接口列表.md:222-302`；`Growatt API/OPENAPI.zh-CN/04_api_device_auth.md:118-189`；`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:51,81` | 主体一致，响应示例值有漂移 | 文档要求客户端模式下 `pinCode` 必填，本轮使用授权码模式，不冲突；但文档成功示例 `data: null`，报告实测 `data: 1` |
| `POST /oauth2/getDeviceListAuthed` | 通过 | `docs/3 接口列表.md:328-385`；`Growatt API/OPENAPI.zh-CN/04_api_device_auth.md:219-264` | 一致 | 返回字段与文档定义一致 |
| `POST /oauth2/getDeviceInfo` | 通过 | `docs/3 接口列表.md:664-752`；`Growatt API/OPENAPI.zh-CN/07_api_device_info.md:10-129` | 一致 | `deviceSn`、`datalogSn`、电池相关字段口径一致 |
| `POST /oauth2/getDeviceData` | 通过 | `docs/3 接口列表.md:772-885`；`Growatt API/OPENAPI.zh-CN/08_api_device_data.md:12-145`；`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:55,64` | 一致 | 报告只摘录了部分字段，不与文档字段表冲突 |
| `POST /oauth2/refresh` | 通过 | `docs/3 接口列表.md:83-125`；`Growatt API/OPENAPI.zh-CN/03_api_refresh.md:10-95`；`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:49` | 主体一致，示例值有漂移 | 文档示例 `expires_in=7200`，报告实测刷新后为 `604800`；`refresh_expires_in=2592000` 保持一致 |
| `refresh` 后继续使用旧 access token | 旧 token 立即返回 `TOKEN_IS_INVALID`，fresh token 正常 | `docs/3 接口列表.md:197,302,373,444,740,1140`；`Growatt API/OPENAPI.zh-CN/10_global_params.md:78` | 文档仅部分覆盖 | 文档覆盖了通用错误码 `TOKEN_IS_INVALID`，但没有显式写出“`refresh` 成功后旧 access token 立即失效”的时序行为 |
| `POST /oauth2/unbindDevice` | 通过，预清理和收尾解绑都成功 | `docs/3 接口列表.md:398-444`；`Growatt API/OPENAPI.zh-CN/04_api_device_auth.md:276-322`；`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:53` | 一致 | 文档与实测请求体均为字符串数组 |

## 重点差异说明

### 1. 全球环境登录/授权码入口仍是文档空白

最新报告明确给出以下真实可用入口：

- `https://opencloud-test.growatt.com/#/login?...`
- `POST /prod-api/login`
- `GET /prod-api/auth`

当前仓库文档从 `POST /oauth2/token` 开始组织，没有把这三个入口作为显式端点写出。这个差异更像“文档覆盖范围不够”，而不是“文档写错”。

### 2. `bindDevice` 成功响应的 `data` 字段示例偏保守

文档示例把成功响应写成：

```json
{
  "code": 0,
  "data": null,
  "message": "SUCCESSFUL_OPERATION"
}
```

最新全球报告的成功响应是：

```json
{
  "code": 0,
  "data": 1,
  "message": "SUCCESSFUL_OPERATION"
}
```

这说明当前公开文档的成功示例不能覆盖所有环境返回形态。建议把 `data` 改写为“可能为 `null` 或成功数量”，避免调用方把 `null` 写死。

### 3. `token` / `refresh` 的 TTL 示例值与实测值不一致

文档示例：

- `expires_in = 7200`
- `refresh_expires_in = 2592000`

最新全球报告实测：

- 首次 `token`：`expires_in = 604733`，`refresh_expires_in = 2585309`
- `refresh` 后：`expires_in = 604800`，`refresh_expires_in = 2592000`

字段语义本身没有冲突，但示例值显然不是当前全球环境的稳定运行值。调用方若依赖固定示例值，会和真实环境产生偏差。

### 4. `refresh` 后旧 access token 立即失效属于“联调行为”，当前文档未写透

文档目前只覆盖了通用错误码 `TOKEN_IS_INVALID`，没有写明：

- `POST /oauth2/refresh` 成功后，旧 access token 会立即失效
- 后续 `getDeviceListAuthed`、`unbindDevice` 等调用必须切换到 fresh token

这个点不属于文档主规范错误，但属于很重要的实现级行为，建议进入 FAQ 或“联调观察”部分。

## 建议动作

1. 在 FAQ 或联调观察中补一条全球环境入口说明，明确 `/#/login`、`/prod-api/login`、`/prod-api/auth` 为实测入口。
2. 在 `bindDevice` 文档里把成功响应 `data` 改成更宽松的描述，不要只给 `null` 示例。
3. 在 `token` / `refresh` 文档或 Quick Guide 中强调：TTL 以接口实时返回为准，不应依赖示例值。
4. 在 FAQ 中补充“`refresh` 后旧 access token 立即失效”的联调结论。
