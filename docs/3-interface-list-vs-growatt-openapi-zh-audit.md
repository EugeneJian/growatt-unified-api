# 基于 `docs/3 接口列表.md` 的 Growatt Open API 中文文档复审报告

审计日期：2026-03-31  
审计范围：
- 源文件：`docs/3 接口列表.md`
- 目标文档：`Growatt API/OPENAPI.zh-CN/*.md`
- 入口指南：`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`

## 总结结论

以 `docs/3 接口列表.md` 为唯一源文件重审后，当前中文文档的主要问题不在于“漏掉少量字段”，而在于把一部分联调经验或推断写成了主规范。最需要优先修正的是 5 类问题：

1. `readDeviceDispatch` 被写成“不需要 requestId”，但源文件参数表明确要求必填。
2. 设备数据推送模型被改写成“与查询接口一致”，但源文件推送章节给的是另一套字段模型。
3. `access_token` 文档把 `redirect_uri` 和 `client_credentials` 响应结构改写成了模式化推断，与源文件示例不一致。
4. `bindDevice.pinCode` 的适用条件被弱化成“按环境要求”，但源文件写的是“客户端模式下必填”。
5. 全局响应码、域名和 `setType` 目录被扩写出源文件之外的内容，且 `code=18` 的消息字符串写错。

本轮结论中，我把差异分成两类：
- 明确冲突：源文件明确写了 A，当前文档写成了 B。
- 越权扩写：当前文档把源文件未给出的联调结论写成了主规范。此类不一定业务上错误，但不应继续以“规范”口径出现。

## 高优先级修正项

### P0

#### 1. `readDeviceDispatch` 将 `requestId` 从必填改成了非必填

- 源依据：`docs/3 接口列表.md:563-567`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:5-18`
  - `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:36-52`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:79-80`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:86-87`
- 差异类型：必填性错误 / 入口指南二次传播
- 问题说明：源文件参数表明确要求 `deviceSn`、`setType`、`requestId` 三项必填；当前端点文档和入口指南都把它改成了只需要前两项。
- 建议修正：把 `06_api_read_dispatch.md` 的请求参数表、请求示例、简要说明和指南矩阵统一改回“`requestId` 必填”。

#### 2. 推送接口主模型被改写成查询接口模型

- 源依据：`docs/3 接口列表.md:928-999`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/09_api_device_push.md:5-7`
  - `Growatt API/OPENAPI.zh-CN/09_api_device_push.md:34-65`
- 差异类型：字段模型错误 / 示例错误
- 问题说明：源文件 `3.8` 的推送示例和字段表以 `activePower`、`reverActivePower`、`deviceSn`、外层 `soc` 为主；当前文档却要求 push payload 与查询接口一致，并使用了 `meterPower`、`reactivePower`、`serialNum` 作为主模型。
- 建议修正：将推送文档改回源文件的独立 payload 模型，不要再以查询接口模型覆盖推送接口。

### P1

#### 3. `token` 请求参数把 `redirect_uri` 改成了仅授权码模式必填

- 源依据：`docs/3 接口列表.md:22-28`，`docs/3 接口列表.md:42-48`
- 目标位置：`Growatt API/OPENAPI.zh-CN/02_api_access_token.md:35-70`
- 差异类型：请求字段必填性错误 / 示例错误
- 问题说明：源文件参数表把 `redirect_uri` 标为必传，且 `client_credentials` 请求示例也包含该字段；当前文档把它改成仅 `authorization_code` 模式必填，并在 `client_credentials` 示例中删掉了它。
- 建议修正：按源文件恢复 `redirect_uri` 的统一必传口径；如果团队决定保留模式差异，必须明确标记为“联调观察”，不能继续写成源规范。

#### 4. `client_credentials` 的 token 响应被改写成“最小返回结构”，并使用了源文件未给出的 `expires_in=604800`

- 源依据：`docs/3 接口列表.md:53-70`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/02_api_access_token.md:75-115`
  - `Growatt API/OPENAPI.zh-CN/01_authentication.md:51-67`
  - `Growatt API/OPENAPI.zh-CN/03_api_refresh.md:5-7`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:35-45`
- 差异类型：示例错误 / 模式边界扩写
- 问题说明：源文件 `3.1` 只给出一套统一返回字段与示例，包含 `refresh_token`、`refresh_expires_in`、`expires_in: 7200`；当前文档把 `client_credentials` 改写成“可能不返回 refresh_token”的最小结构，并给了 `expires_in: 604800` 的源外示例。
- 建议修正：主规范层恢复为源文件的统一返回结构；如需保留“某些环境未返回 refresh_token”的说法，应移到 FAQ 或联调附录，并明确标记为源外观察。

#### 5. `bindDevice.pinCode` 的条件被从“客户端模式必填”弱化成“环境要求时再传”

- 源依据：`docs/3 接口列表.md:234-239`，`docs/3 接口列表.md:258-278`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/04_api_device_auth.md:113-165`
  - `Growatt API/OPENAPI.zh-CN/01_authentication.md:53-66`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:38-45`
- 差异类型：模式边界冲突
- 问题说明：源文件将 `deviceSnList[].pinCode` 标为“客户端模式下必填”；当前文档把它改成“如环境或目标设备要求，再补 pinCode”，削弱了源文件给出的模式约束。
- 建议修正：主规范改回“客户端模式下必填”；如存在联调环境例外，单独标注为环境差异，不要覆盖源规则。

#### 6. `code=18` 的错误消息写错

- 源依据：`docs/3 接口列表.md:621-626`，`docs/3 接口列表.md:1094-1098`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:99-106`
  - `Growatt API/OPENAPI.zh-CN/10_global_params.md:52-61`
- 差异类型：返回码冲突
- 问题说明：源文件中 `code=18` 的消息是 `READ_DEVICE_PARAM_FAIL`；当前文档写成了 `READ_PARAMETER_FAILED`。
- 建议修正：统一改回 `READ_DEVICE_PARAM_FAIL`。

#### 7. `getDeviceData` 把 `serialNum` 设为主字段、把 `deviceSn` 降为兼容字段，超出了源文件能支持的结论

- 源依据：
  - 示例：`docs/3 接口列表.md:782-830`
  - 字段表：`docs/3 接口列表.md:836-876`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/08_api_device_data.md:5-7`
  - `Growatt API/OPENAPI.zh-CN/08_api_device_data.md:52-147`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:88-89`
- 差异类型：字段语义错误 / 源内不一致被擅自裁定
- 问题说明：源文件此处本身存在不一致，示例里出现 `serialNum`，字段表里定义的是 `data.deviceSn`。当前文档直接把 `serialNum` 定义成主字段，并把 `deviceSn` 降级为兼容字段，这不是源文件明确支持的结论。
- 建议修正：不要擅自裁定单一主字段。应明确写出“源文件示例与字段表不一致”，并把两者都列出，等待进一步权威澄清。

#### 8. `readDeviceDispatch` 的“object 或 array”主规范口径没有源依据

- 源依据：`docs/3 接口列表.md:577-626`
- 目标位置：
  - `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:56-126`
  - `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:86-89`
  - `Growatt API/OPENAPI.zh-CN/11_api_troubleshooting.md:101-108`
- 差异类型：返回结构扩写
- 问题说明：源文件 `3.5` 只给出了数组型成功示例，并未给出 object 型回读响应；当前文档把“`data` 可为 object 或 array”写成了主规范，还把它传播到了指南和 FAQ。
- 建议修正：主规范退回到源文件已给出的数组示例；如 object 型结构来自联调，应迁移到 FAQ 或测试附录，并明确注明“源外观察”。

## 按接口分组的差异矩阵

### 认证与 Token

| 严重级别 | 目标位置 | 差异类型 | 需要修正 |
| :--- | :--- | :--- | :--- |
| P1 | `OPENAPI.zh-CN/02_api_access_token.md:35-70` | 请求字段 / 示例错误 | 恢复 `redirect_uri` 的统一必传口径，并在 `client_credentials` 示例中补回该字段。 |
| P1 | `OPENAPI.zh-CN/02_api_access_token.md:75-115` | 响应模型扩写 | 去掉把 `client_credentials` 写成“最小返回结构”的主规范表述，取消源外 `604800` 示例。 |
| P1 | `OPENAPI.zh-CN/01_authentication.md:51-67` | 模式边界扩写 | “client_credentials 不默认承诺 refresh_token”属于源外结论，建议降级为联调说明。 |
| P1 | `OPENAPI.zh-CN/03_api_refresh.md:5-7` | 模式边界扩写 | “仅适用于实际 token 响应中已包含 refresh_token 的场景”不是源文件写法，建议降级为联调说明。 |

### 设备授权

| 严重级别 | 目标位置 | 差异类型 | 需要修正 |
| :--- | :--- | :--- | :--- |
| P1 | `OPENAPI.zh-CN/04_api_device_auth.md:131-165` | 条件约束冲突 | 把 `pinCode` 条件恢复为“客户端模式下必填”。 |
| P2 | `OPENAPI.zh-CN/04_api_device_auth.md:92-105` | 返回码扩写 | `WRONG_GRANT_TYPE` 示例不在源文件返回码列表内，建议移出主规范或明确标注为联调现象。 |
| P2 | `OPENAPI.zh-CN/04_api_device_auth.md:194-198` | 术语扩写 | “纯 SN / 不要传 datalogSn / 不带 SPH 前缀”属于源外经验，建议移到 FAQ。 |

### 设备调度与回读

| 严重级别 | 目标位置 | 差异类型 | 需要修正 |
| :--- | :--- | :--- | :--- |
| P0 | `OPENAPI.zh-CN/06_api_read_dispatch.md:5-52` | 必填字段错误 | 将 `requestId` 加回简要说明、参数表和请求示例。 |
| P1 | `OPENAPI.zh-CN/06_api_read_dispatch.md:99-106` | 返回码冲突 | 将 `READ_PARAMETER_FAILED` 改为 `READ_DEVICE_PARAM_FAIL`。 |
| P1 | `OPENAPI.zh-CN/06_api_read_dispatch.md:109-126` | 返回结构扩写 | 把 object 型响应说明降级为联调观察，不再作为主规范。 |
| P2 | `OPENAPI.zh-CN/05_api_device_dispatch.md:48-53` | 说明轻微偏差 | 源文件字段表把 `value` 标成 `string`，但示例给了 object；当前写成 `string 或 object`。建议注明“源文件示例与字段表并存”，避免看起来像已统一定论。 |

### 设备信息 / 数据 / 推送

| 严重级别 | 目标位置 | 差异类型 | 需要修正 |
| :--- | :--- | :--- | :--- |
| P1 | `OPENAPI.zh-CN/08_api_device_data.md:5-7` | 字段语义错误 | 不要把 `serialNum` 定义为主字段；应显式记录源文件中 `serialNum` 示例与 `deviceSn` 字段表的冲突。 |
| P1 | `OPENAPI.zh-CN/08_api_device_data.md:137-146` | 兼容字段越权 | `activePower` / `reverActivePower` / 外层 `soc` 在源文件 `3.7` 中并未定义为查询主字段，也不应被当前文档直接写成“历史兼容字段”主规范。 |
| P0 | `OPENAPI.zh-CN/09_api_device_push.md:5-65` | 推送模型错误 | 用源文件 `3.8` 的字段集重写整页文档，不再宣称 push 与 query 主模型一致。 |

### 全局参数

| 严重级别 | 目标位置 | 差异类型 | 需要修正 |
| :--- | :--- | :--- | :--- |
| P2 | `OPENAPI.zh-CN/10_global_params.md:10-13` | 域名缺失 | 补上 `https://opencloud-test-au.growatt.com`。 |
| P1 | `OPENAPI.zh-CN/10_global_params.md:52-61` | 返回码冲突 / 扩写 | 把 `code=18` 改回 `READ_DEVICE_PARAM_FAIL`；`code=7`、`code=103` 不在源文件全局返回码列表中，应移到联调附录或 FAQ。 |
| P1 | `OPENAPI.zh-CN/10_global_params.md:72-114` | `setType` 目录越权扩写 | 源文件全局参数只列出 3 个 `setType`：`time_slot_charge_discharge`、`duration_and_power_charge_discharge`、`anti_backflow`。当前大表超出了源文件范围，建议缩回源文件范围，或改名为“联调补充索引”。 |

## 入口指南与 SSOT 的二次不一致

以下问题不仅存在于端点文档，还被入口层再次放大：

1. `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:79-89`
   - 把 `readDeviceDispatch` 输入写成只需 `deviceSn` 和 `setType`。
   - 把查询 / 推送的主模型统一成 `meterPower`、`reactivePower`、`serialNum`。
   - 这些都与源文件不一致，且会把错误传播给只读入口指南的实现方。

2. `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md:97-101`
   - 把 `WRONG_GRANT_TYPE`、JSON body、纯 `deviceSn`、对象项绑定、兼容字段等联调结论写成“应与主规范一并理解”。
   - 这些内容大多不是 `docs/3 接口列表.md` 明确给出的，应移到测试附录或 FAQ。

3. `Growatt API/OPENAPI.zh-CN/README.md:88-95`
   - 缺少 `opencloud-test-au.growatt.com`。
   - Token 生命周期描述本身问题不大，但未提示当前文档中的模式化拆分其实不是源文件显式规则。

4. `Growatt API/OPENAPI.zh-CN/11_api_troubleshooting.md:31-121`
   - FAQ 里大量结论属于联调经验，其中最需要回收的是：
   - `WRONG_GRANT_TYPE` 作为固定示例返回。
   - `readDeviceDispatch.data` 固定支持 object/array 双形态。
   - 这些内容不是不能保留，而是不应继续冒充源规范。

## 不足与未覆盖项

1. 本轮以 `docs/3 接口列表.md` 为唯一源文件，没有再使用飞书原始文档与内嵌 sheet 交叉校验。
2. 源文件自身存在局部不一致，最典型的是：
   - `getDeviceData` 示例里出现 `serialNum`，字段表里写的是 `data.deviceSn`。
   - `readDeviceDispatch` 参数表要求 `requestId`，但请求示例又漏掉了它。
3. 对于这类“源内自相矛盾”的地方，本报告只指出当前文档不应擅自裁定，不直接替源文件做二次解释。

## 结论回答

### 哪些字段 / 约束当前文档写错了？

- `readDeviceDispatch.requestId` 被写成非必填。
- `code=18.message` 被写成 `READ_PARAMETER_FAILED`。
- `token` 请求里的 `redirect_uri` 被写成只有授权码模式才必填。
- `bindDevice.pinCode` 被写成“环境要求时再传”，而不是“客户端模式下必填”。
- push 模型被改成 `meterPower/reactivePower/serialNum` 主导。

### 哪些地方是入口指南与端点 SSOT 互相矛盾？

- 指南把 `readDeviceDispatch` 的输入缩成两项，和源文件不一致，也与应修正后的端点页不一致。
- 指南把查询 / 推送的遥测模型统一化，放大了端点页当前的错误建模。
- 指南把一批联调经验提升成“与主规范一并理解”，与“源文件为准”的口径冲突。

### 哪些内容源文件本身没有给出，因此不能据此判错？

- `client_credentials` 下实际是否一定不返回 `refresh_token`。
- `getDeviceList` 是否固定返回 `WRONG_GRANT_TYPE(code=103)`。
- 设备级接口是否必须使用“纯 SN”且绝不带展示前缀。
- `readDeviceDispatch.data` 是否在真实环境中也会返回 object。
- 源文件之外的完整 `setType` 清单。

这些内容如果继续保留，建议统一移到“联调验证结论”或 FAQ，并明确标注“非源文件规范”。
