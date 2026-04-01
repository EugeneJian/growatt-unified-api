# 飞书源文档 vs Growatt OpenAPI 中文文档审计报告

验证源：
- 飞书导出版清洗稿：`docs/feishu-growatt-open-api-zh.cleaned.md`
- 飞书嵌入参数表：`YKJAskc9QhveoItPncOcj1k6n2c_*`

审计范围：
- 端点级中文 SSOT：`Growatt API/OPENAPI.zh-CN/*.md`
- 中文总览指南：`Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
- 目录首页：`Growatt API/OPENAPI.zh-CN/README.md`

口径：
- 只按字段 / API / 示例 / 模式边界 / TTL / 约束进行审计
- 若飞书正文与飞书 sheet 冲突，以对应 sheet 为字段级优先依据
- 若当前文档包含仓库联调经验、但飞书源未覆盖，则标记为“超出飞书源，需标注来源”，不直接判错

## 总结结论

本轮发现：
- `6` 项明确需要修正的源冲突
- `3` 项超出飞书源、应降级为“测试结论/附注”的内容
- `2` 处飞书源自身冲突，当前文档不应再单边定性

高风险集中在三个区域：
- `readDeviceDispatch` 的请求约束与错误码
- `getDeviceData` / `device push` 的字段主模型
- `token` 文档中 `client_credentials` 请求/响应示例的源偏移

未发现明显字段级冲突的分册：
- `05_api_device_dispatch.md`
- `07_api_device_info.md`

## 高优先级修正项

| 严重级别 | 目标位置 | 差异类型 | 结论 | 源依据 |
| :--- | :--- | :--- | :--- | :--- |
| `P1` | `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:5-8, 38-51` | 必填性错误 | 当前文档声明 `requestId` 非必填，且请求参数表与示例均未体现 `requestId`；飞书 sheet 明确要求 `deviceSn`、`setType`、`requestId` 三项必填。 | `AKVdR4`：A2:A4 |
| `P1` | `Growatt API/OPENAPI.zh-CN/06_api_read_dispatch.md:99-106`、`Growatt API/OPENAPI.zh-CN/10_global_params.md:60` | 返回码冲突 | 当前文档把 `code=18` 写成 `READ_PARAMETER_FAILED`；飞书正文写的是 `READ_DEVICE_PARAM_FAIL`。 | 飞书正文 `3.5`：`docs/feishu-growatt-open-api-zh.cleaned.md:527-533` |
| `P0` | `Growatt API/OPENAPI.zh-CN/09_api_device_push.md:5-7, 34-65` | 字段模型重写 | 当前文档把 push payload 定义为与查询接口相同，并把 `activePower` / `reverActivePower` / 外层 `soc` 降为兼容字段；飞书 push 示例与字段表都把这些字段作为 push 主体字段。 | 飞书正文 `3.8`：`714-758`；sheet `UqiZ4B`：A2:B18 |
| `P1` | `Growatt API/OPENAPI.zh-CN/08_api_device_data.md:5-7, 108-146` | 字段主语义错误 | 当前文档把 `serialNum` 定义为“主字段”，并把 `deviceSn` 视为兼容字段；飞书字段表列的是 `data.deviceSn`，未列 `serialNum`，且还列了当前文档遗漏的 `data.epvTotal`。 | sheet `71dj4m`：A21:A27；飞书正文示例 `631-680` |
| `P1` | `Growatt API/OPENAPI.zh-CN/02_api_access_token.md:37-43, 65-70, 103-110` | 示例 / 请求字段冲突 | 当前文档把 `redirect_uri` 限定为授权码模式必填，并从 `client_credentials` 示例移除；飞书请求表与正文示例均保留该字段。当前文档还将 `client_credentials` 示例的 `expires_in` 改成 `604800`，而飞书示例是 `7200`。 | sheet `F58Ogq`：A2:D6；飞书正文 `105-110`；飞书正文 `64-69` |
| `P2` | `Growatt API/OPENAPI.zh-CN/10_global_params.md:10-13, 52-61` | 全局规则冲突 | 当前文档遗漏 `https://opencloud-test-au.growatt.com`，并把 `code=7`、`code=103` 列为“常见响应码”；飞书全局说明只列出 `0/2/5/6/12/15/16/18`。 | 飞书正文 `783-860` |

## 按接口分组的差异矩阵

### 1. 认证总述 / token 生命周期

**需要修正**

- `02_api_access_token.md:43`
  当前写法：`redirect_uri` 仅授权码模式必填。
  问题：飞书请求表 `F58Ogq` 未给出模式例外，且两种模式的正文示例都包含 `redirect_uri`。
  建议：至少改成“飞书源对 `redirect_uri` 未区分模式；若要继续保留当前约束，必须标注为联调结论而非源规范”。

- `02_api_access_token.md:105-110`
  当前写法：`client_credentials` 示例 `expires_in = 604800`。
  问题：飞书 `client_credentials` 示例是 `7200`。
  建议：改回飞书示例值，或明确标注该示例来自测试环境而非飞书源。

**飞书源自身冲突，暂不直接判错**

- 飞书正文 `2.1/2.2` 同时出现：
  - 示例里 `expires_in = 7200`
  - 叙述里又写“`access_token` 有效期 7 天”
- 当前 `01_authentication.md:96-97` 与 `OPENAPI.zh-CN/README.md:92-95` 选择了“TTL 以实时返回为准”的解释，这不是飞书字段表直接给出的结论。
  建议：不要再把该解释写成源规范，应改成“飞书源存在冲突，运行时以接口实时返回为准”。

### 2. 设备授权 / 绑定 / 解除绑定

**需要修正**

- `04_api_device_auth.md:115, 132-134, 198`
  当前写法：`pinCode` 仅在“环境或目标设备要求”时补充。
  问题：飞书 `6OHkc5` 明确写的是“`deviceSnList[].pinCode` 客户端模式下必填”。
  建议：把源规范层写成“`client_credentials` 模式必填”；如果仓库要保留“按环境而定”的经验结论，应单列为测试注记。

**基本对齐**

- `getDeviceList` 仅 `authorization_code` 支持：当前文档与飞书正文一致。
- `bindDevice` 使用对象项：当前文档与飞书正文 / sheet 一致。
- `unbindDevice` 使用字符串数组：当前文档与飞书正文 / sheet 一致。

**超出飞书源，需标注来源**

- `04_api_device_auth.md:92-105` 把 `client_credentials -> getDeviceList -> code=103 WRONG_GRANT_TYPE` 写成了标准模式边界。
  飞书源只说“仅 authorization_code 模式下支持”，没有给出 `103` 这个标准返回。
  建议：如果保留，降级为“联调观察到的典型失败响应”，不要写成主规范。

### 3. 设备调度回读 `readDeviceDispatch`

**需要修正**

- `06_api_read_dispatch.md:5-8, 38-51`
  当前写法：`requestId` 非必填，请求参数只有 `deviceSn` 与 `setType`。
  问题：飞书 sheet `AKVdR4` 三行参数明确要求 `deviceSn` / `setType` / `requestId`。
  建议：请求参数表、请求示例、总览指南矩阵一并补上 `requestId`。

- `06_api_read_dispatch.md:101-106`
  当前写法：错误码 `18` 对应 `READ_PARAMETER_FAILED`。
  问题：飞书正文写的是 `READ_DEVICE_PARAM_FAIL`。
  建议：统一改名，避免和源规范错位。

**超出飞书源，需标注来源**

- `06_api_read_dispatch.md:111-126`
  当前文档加入了 `duration_and_power_charge_discharge` 返回对象结构。
  飞书正文只给出了 `time_slot_charge_discharge` 数组示例；字段表 `Tnf0GM` 也只有通用 `code/data/message`。
  建议：如果保留该对象示例，明确标注来源于联调而非飞书源。

### 4. 设备数据查询 `getDeviceData`

**需要修正**

- `08_api_device_data.md:6-7`
  当前写法：主规范字段以 `meterPower`、`reactivePower`、`serialNum`、`batteryList[]` 为中心，并将 `activePower` / `reverActivePower` / 外层 `soc` 降级为兼容字段。
  问题：飞书字段表 `71dj4m` 并未把 `serialNum` 列为字段，列的是 `data.deviceSn`；同时它还列了当前文档缺失的 `data.epvTotal`。
  建议：删掉“`serialNum` 为主字段”这类定性，至少同时列出 `deviceSn` 与 `serialNum` 的源冲突，并补上 `epvTotal`。

- `08_api_device_data.md:123`
  当前写法：`data.serialNum` 是“设备序列号主字段”。
  问题：飞书字段表不支持这个“主字段”结论。
  建议：改成“飞书正文示例出现 `serialNum`，字段表列 `deviceSn`，两者需兼容解析”。

- `08_api_device_data.md:139-146`
  当前写法：把 `activePower` / `reverActivePower` / 外层 `soc` 归为历史兼容字段。
  问题：这些字段来自飞书 push 字段表 `UqiZ4B`，不能在查询接口中直接降格为“历史兼容”而不给出处。
  建议：从查询接口中移除该定性，或改成“这些字段主要见于 push payload，不是本接口字段表主定义”。

**飞书源自身冲突，暂不直接判错**

- 飞书查询正文示例 `631-680` 出现 `serialNum`，但字段表 `71dj4m` 写的是 `data.deviceSn`。
  建议：当前仓库不要再选边站，应显式记录“源正文与源字段表不一致”。

### 5. 设备数据推送 `device push`

**需要修正**

- `09_api_device_push.md:5-7`
  当前写法：push payload 应与查询接口主模型保持一致。
  问题：飞书 push 正文与字段表不是这个模型。push 用的是 `activePower` / `reverActivePower` / `deviceSn` / 外层 `soc`。
  建议：把 push 文档独立建模，不再强绑定查询接口。

- `09_api_device_push.md:34-60`
  当前示例使用 `meterPower`、`reactivePower`、`serialNum`。
  问题：飞书 push 示例没有这些字段，给的是 `activePower`、`reverActivePower`、`deviceSn`、`soc`。
  建议：示例整体替换为飞书 push 示例结构。

- `09_api_device_push.md:63-65`
  当前写法：`activePower` / `reverActivePower` / 外层 `soc` 是兼容输入。
  问题：飞书 push 字段表把它们列为正式字段，不是兼容残留。
  建议：删除“兼容”定性。

### 6. 全局参数 / 域名 / 响应码 / setType

**需要修正**

- `10_global_params.md:12`
  当前只列出 `https://opencloud-test.growatt.com`。
  飞书还列出了 `https://opencloud-test-au.growatt.com`。

- `10_global_params.md:60`
  当前写 `READ_PARAMETER_FAILED`。
  飞书写 `READ_DEVICE_PARAM_FAIL`。

**超出飞书源，需标注来源**

- `10_global_params.md:56-61`
  当前把 `code=7 WRONG_DEVICE_TYPE`、`code=103 WRONG_GRANT_TYPE` 列进“常见响应码”主表。
  飞书全局返回码段未列这两个码。
  建议：若保留，挪到 FAQ / 联调补充区，并标注来源。

- `10_global_params.md:79-114`
  当前 `setType` 列表远超飞书字段表 `iQxQ7G`。
  飞书源只明确给出：
  - `time_slot_charge_discharge`
  - `duration_and_power_charge_discharge`
  - `anti_backflow`
  建议：拆成“飞书源已给出 setType”与“仓库扩展 / 联调补充 setType”两部分，避免把扩展内容误写成源规范。

## 入口指南与 SSOT 的二次不一致

以下入口文档复写了端点层的偏移，需要在修正端点层后同步修正：

- `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
  - `36-45`：对 `refresh_token` / `pinCode` / `getDeviceList` 的模式边界写法沿用了当前 SSOT 的解释，应跟随端点层回收为“源规范”与“联调补充”两层
  - `79-80, 86-89, 97-101, 111-113`：同步写入了 `requestId`、遥测主模型、兼容字段等偏移

- `Growatt API/OPENAPI.zh-CN/README.md`
  - `94-95`：把 TTL 解释成“始终以实时返回为准”，但飞书源存在 `7天` vs `7200` 冲突，README 不应替源文档做单边裁决

## 不足与未覆盖项

- 本轮已按字段级拉取所有嵌入 sheet，但图片内容未作为验证源。
- `11_api_troubleshooting.md` 只做了“是否与飞书源冲突”的检查，没有做字段级完整性审查。
- 当前仓库中一部分内容明显来自联调结论，而不是飞书源。例如：
  - `WRONG_GRANT_TYPE`
  - “纯 `deviceSn`、不要带展示前缀”
  - 某些 JSON body 组合约束
  这些内容不一定错误，但必须降级为“测试结论”，不能继续伪装成飞书主规范。
- 飞书源自身仍有两类未解冲突，需业务 / 文档 owner 裁决：
  - token 生命周期：`7200` vs `7天`
  - 查询接口设备序列号字段：`serialNum` vs `deviceSn`

## 建议修正顺序

1. 先修 `06_api_read_dispatch.md` 与 `10_global_params.md` 的 `requestId` / `code=18` 文案错位。
2. 再修 `09_api_device_push.md`，把 push 模型从查询模型中解耦。
3. 再修 `08_api_device_data.md`，移除对 `serialNum` 的单边主字段定性。
4. 然后修 `02_api_access_token.md` 的 `redirect_uri` 与 `client_credentials` 示例。
5. 最后统一回收 `README` / 中文总览指南 / FAQ 中的二次叙述，把“飞书源规范”和“联调补充”明确分层。
