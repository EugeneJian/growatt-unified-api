# 基于 2026-04-01 基线的 Growatt Open API 中文对齐审计

审计日期：2026-04-02  
审计基线：`docs/3 接口列表.md`（同步自 `3 接口列表20260401_1.md`）  
审计对象：

- `Growatt API/OPENAPI.zh-CN/*.md`
- `Growatt API/Growatt Open API Professional Integration Guide.zh-CN.md`
- 共享展示层与相关测试

## 结论

当前中文公开文档已按 2026 年 4 月 1 日厂商基线完成一轮对齐修复。此前版本中把联调现象写成主规范、把中文 UI 乱码写进测试断言、以及遗漏最新基线字段/返回码的问题，已在本轮集中修正。

## 已修复项

### 规范层

- `POST /oauth2/token` 两种模式示例均恢复 `redirect_uri`
- `POST /oauth2/readDeviceDispatch` 恢复 `requestId` 必填
- `POST /oauth2/bindDevice` 恢复客户端模式下 `pinCode` 必填
- `code=18` 统一恢复为 `READ_DEVICE_PARAM_FAIL`
- `code=19 / DEVICE_ID_ALREADY_EXISTS` 重新纳入设备授权失败示例
- 全局域名补回 `https://opencloud-test-au.growatt.com`
- 全局 `setType` 目录收敛为基线明确列出的 3 项

### 文档分层

- Quick Guide 与 FAQ 不再把联调经验写成主规范
- 设备回读对象型返回、`WRONG_GRANT_TYPE`、纯 `deviceSn` 等内容统一降级到“联调观察（非基线规范）”
- 推送页改为直接发布基线 payload，而不是以查询页口径替代

### 展示与校验

- 中文站点共享文案、标题、特殊页标签、源文件副标题的乱码已修复
- `__tests__/growatt-docs.test.ts` 不再把乱码视为正确行为
- 新增针对 `redirect_uri`、`requestId`、AU 测试域名、`READ_DEVICE_PARAM_FAIL`、推送页基线 payload、Quick Guide/FAQ 观察区的回归断言

## 仍需显式保留的基线内部不一致

以下问题来自厂商 2026-04-01 基线本身，公开拆分文档已显式标注，而不是静默改写：

1. `readDeviceDispatch`
   - 参数表要求 `requestId`
   - 原始请求示例漏写 `requestId`
2. `deviceDispatch`
   - 参数表把 `value` 写成 `string`
   - 同页示例在 `duration_and_power_charge_discharge` 场景下传入对象
3. `getDeviceData`
   - 局部 HTTP 头表写作 `token`
   - `4 全局参数说明` 统一写作 `Authorization: Bearer xxxxxxx`
4. 多个端点的顶层返回参数表把 `data` 写成 `string`
   - 但对应成功示例实际返回 `null`、数组或对象

## 与旧审计结论的差异

- 旧审计中关于 `serialNum` 主字段、独立 push 模型、`WRONG_GRANT_TYPE` 正文化等问题，来自更早版本的拆分文档或更旧基线；它们不再代表 2026-04-01 厂商基线本身。
- 当前审计以 2026-04-01 下载基线为准，优先记录“基线明确给出的规则”和“基线自己仍未消除的矛盾”。
