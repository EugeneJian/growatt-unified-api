# 附录 D OpenAPI 支持的逆变器型号

**版本**: v1.0

**状态**: 客户集成参考

**用途**: 列出已确认支持 Growatt 公开 OpenAPI 能力的逆变器 / PCE 型号范围。

> **阅读说明：** 本附录中的每一行均已确认。“OpenAPI 支持状态”列的 `✓` 表示该行已确认；具体能力列中的 `✓` 表示支持，`!` 表示支持但存在机型字段限制，详情见该行备注。

---

## 1. 适用范围

- 本附录列出已确认可接入 Growatt 公开 OpenAPI 的逆变器 / PCE 型号范围。
- 支持结论仅适用于每行记录的准确型号范围和限制条件。
- 本附录本身不等同于 VPP 可接入、DNSP 可注册、CEC 合规或市场项目准入。
- 客户应将本清单与接口文档及项目接入确认结果结合使用。

---

## 1.1 VPP 集成排除范围

以下产品类别不在 VPP 集成支持范围内：

- **SPA、WIT、WIS 系列及阳台储能产品**：这些户用储能逆变器型号和阳台储能系统不支持 VPP 调度能力。
- **纯光伏逆变器**：不建议接入 VPP，因其缺少电池接口，无法提供可调度的储能服务。

---

## 2. 图标说明

| 图标 | 所在位置 | 含义 |
| :---: | :--- | :--- |
| `✓` | OpenAPI 支持状态 | 所列逆变器 / PCE 型号范围已确认 |
| `✓` | 具体能力列 | 支持该能力 |
| `!` | 具体能力列 | 支持但存在机型字段限制，详情见该行备注 |

型号使用代码标签展示，每行一个型号。

---

## 3. 支持的逆变器 / PCE 型号

本清单包含 12 个已确认的逆变器 / PCE 型号分组。判断具体部署兼容性时，应同时查看每行的限制条件和备注。

### 3.1 逆变器 / PCE

#### 3.1.1 户用混合逆变器

| 清单编号 | 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INV-001 | SPH TL | `SPH 3000-6000TL BL` `SPH 3000-6000 TL BL-UP` `SPH 6000 TL US` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH 机型不提供 `maxChargePower` 或 `maxDischargePower` |
| INV-002 | SPH TL-HU | `SPH 3000-6000TL HU` `SPH 3000-6000TL HUB` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH 机型不提供 `maxChargePower` 或 `maxDischargePower` |
| INV-003 | SPH TL3-UP | `SPH 4000-10000TL3 BH` `SPH 4000-10000TL3 BH-UP` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH 机型不提供 `maxChargePower` 或 `maxDischargePower` |
| INV-004 | SPH-HU | `SPH 8-10KTL-HU-US` `SPH 8-10KTL-HU-US(B)` `SPH 8-10KTL-HU` `SPH 12-18KTL-HU-US` | ✓ | ✓ | ! | ✓ | ✓ | ✓ | SPH 机型不提供 `maxChargePower` 或 `maxDischargePower` |
| INV-005 | SPM-HU | `SPM 8-10KTL-HU(AU)` `SPM 6-10KTL-HU(EU)` `SPM 8-10KTL-HU(UK)` `SPM 3000-6000TL-HU` `SPM 3000-6000TL-HU(BR)` `SPM 3000-6000TL-HU2` `SPM 8-10KTL-HU2` `SPM 3000-6000TL-HU(IT)` `SPM 2500-6000TL-HU(EU)` `SPM 8-10KTL-HU(CL)` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |

#### 3.1.2 户用预备储能逆变器

| 清单编号 | 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INV-006 | MIN-XH | `MIN 2500-6000TL-XH2` `MIN 2500-6000TL-XH/XE/XA` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |
| INV-007 | MIN-XH US | `MIN 3000-11400TL-XH US` `MIN 3000-11400TL-XH2 US` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |
| INV-008 | MIN-XH JP | `MIN 6000TL-XH-JP` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |
| INV-009 | MOD-XH/MID-XH | `MOD 3-10KTL3-XH/BP` `MID 11-30KTL3-XH` `MID 8-15KTL3-XHL/JP` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |
| INV-010 | MOD/MID-HU | `MOD 3-15KTL3-HU` `MID 33-50KTL3-HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |

### 3.2 储能一体机

| 清单编号 | 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AIO-001 | MINA | `MINA 3-10KTL-HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |
| AIO-002 | MODA | `MODA 4-15KTL3-HU` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 无 |

---

## 4. 客户兼容性检查

针对具体部署范围：

1. 确认分配的正式服务区域与 OAuth 客户端。
2. 确认设备出现在已授权设备列表中。
3. 从 `getDeviceInfo` 记录 `model`、`communicationVersion`、`unifiedAPIver`、`deviceVersion` 与 `datalogVersion`。
4. 将机型相关遥测字段按可选字段处理。
5. 正式调度前，在目标型号验证每个所需 `setType` 并回读设置值。
6. 遵守文档规定的按设备频率限制。

已发布的机型差异：SPH 机型不提供 `maxChargePower` 或 `maxDischargePower`。

## 5. 变更记录

| 日期 | 变更说明 |
| :--- | :--- |
| `2026-07-23` | 删除全部 SPA、WIT、WIS 机型；更新系列名称及 INV 编号；型号分组数从 15 更新为 10 |
| `2026-07-22` | 发布仅包含逆变器的支持清单，使用紧凑状态图标、SPA/SPH 字段限制提示，并将型号逐行展示 |
| `2026-07-20` | 根据 DTC 机型库更新逆变器 / PCE 条目 |

## 相关文档

- [设备授权 API](./04_api_device_auth.md)
- [设备信息查询 API](./07_api_device_info.md)
- [设备数据查询 API](./08_api_device_data.md)
- [设备调度 API](./05_api_device_dispatch.md)
- [全局参数](./10_global_params.md)
