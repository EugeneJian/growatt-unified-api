# 附录 D OpenAPI 支持产品范围

**版本**: draft  
**状态**: 待确认  
**用途**: 本附件用于按型号记录 Growatt 哪些产品已确认支持公开 OpenAPI 集成能力，可作为面向客户、合作方或合同附件的正式范围文件，并在后续获得确认后持续更新。

---

## 1. 适用范围

- 本附件仅描述 Growatt 公开 OpenAPI 的支持范围。
- 本附件本身不等同于 VPP 可接入、DNSP 可注册、CEC 合规或市场项目准入。
- 只有在获得厂商书面确认、正式公开文档依据，或完成真实联调验证后，才应标记为已支持。
- 如果支持范围受固件版本、云区域、电站类型或设备拓扑影响，必须在备注中明确写出。

---

## 2. 状态定义

| 状态 | 含义 |
| :--- | :--- |
| `Confirmed` | 已依据官方证据或真实联调验证，确认支持所列 OpenAPI 范围 |
| `Partial` | 仅支持部分 OpenAPI 能力，例如只支持监控、不支持调度 |
| `Planned` | 有规划或口头信息，但尚无正式证据支撑 |
| `Not Supported` | 已确认不支持所列 OpenAPI 范围 |
| `Pending Confirmation` | 仍在收集或等待确认中 |

---

## 3. OpenAPI 能力矩阵

本附件当前的产品基线来自 `2026-04-24` 核对的澳洲 CEC Growatt 产品清单：

- `61` 个逆变器 / PCE 条目
- `50` 个电池条目
- 下方所有行先统一初始化为 `Pending Confirmation`，待后续逐型号确认 OpenAPI 支持状态

### 3.1 逆变器 / PCE

#### 3.1.1 户用并离网储能一体机

| 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SPH/SPA TL | SPH 3000-6000TL BL; SPH 3000-6000 TL BL-UP; SPH 6000 TL US; SPA 1000-3000TL BL; SPA 3000TL BL-UP | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | SPA/SPH 系列暂不支持并网截止 SOC、离网截止 SOC 字段读取 |
| SPH TL-HU | SPH 3000-6000TL HU; SPH 3000-6000TL HUB | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | SPA/SPH 系列暂不支持并网截止 SOC、离网截止 SOC 字段读取 |
| SPH/SPA TL3-UP | SPH 4000-10000TL3 BH; SPH 4000-10000TL3 BH-UP; SPA 4000-10000TL3 BH; SPA 4000-10000TL3 BH-UP | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | SPA/SPH 系列暂不支持并网截止 SOC、离网截止 SOC 字段读取 |
| SPA TL-AU | SPA 3000-6000TL AU; SPA 3000-6000TL AUB | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | SPA/SPH 系列暂不支持并网截止 SOC、离网截止 SOC 字段读取 |
| SPH-HU | SPH 8-10KTL-HU-US; SPH 8-10KTL-HU-US(B); SPH 8-10KTL-HU; SPH 12-18KTL-HU-US | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | SPA/SPH 系列暂不支持并网截止 SOC、离网截止 SOC 字段读取 |
| SPM-HU | SPM 8-10KTL-HU(AU); SPM 6-10KTL-HU(EU); SPM 8-10KTL-HU(UK); SPM 3000-6000TL-HU; SPM 3000-6000TL-HU(BR); SPM 3000-6000TL-HU2; SPM 8-10KTL-HU2; SPM 3000-6000TL-HU(IT); SPM 2500-6000TL-HU(EU); SPM 8-10KTL-HU(CL) | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |

#### 3.1.2 户用预备储能逆变器

| 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| MIN-XH | MIN 2500-6000TL-XH2; MIN 2500-6000TL-XH/XE/XA | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| MIN-XH US | MIN 3000-11400TL-XH US; MIN 3000-11400TL-XH2 US | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| MIN-XH JP | MIN 6000TL-XH-JP | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| MOD-XH/MID-XH | MOD 3-10KTL3-XH/BP; MID 11-30KTL3-XH; MID 8-15KTL3-XHL/JP | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| MOD/MID-HU | MOD 3-15KTL3-HU; MID 33-50KTL3-HU | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| WIT 25K HU/XHU | WIT 4-15K-HU; WIT 17-25K-HU; WIT 4-25K-XHU | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |

#### 3.1.3 商用储能逆变器

| 系列 | 型号 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| WIS/WIT 100K | WIS 100K-AM; WIT 50-100K-H/HE/HU/A/AE/AU; WIT 50-100K-H/HE/HU/A/AE/AU-US; WIT 28-55K-H/HE/HU/A/AE/AU-US L2 | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| WIT XHU | WIT 29.9-50K-XHU | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |
| WIS 125K | WIS 125K-AM | Confirmed | 支持 | 支持 | 支持 | 支持 | 支持 | 无 |

### 3.2 电池

| 产品大类 | 系列 | 型号 | 拓扑 / 设备类型 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 | 证据来源 | 生效日期 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 电池 | ALP | ALP 10.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 15.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 20.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 25.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 30.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 35.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 40.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 45.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 5.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP | ALP 50.0L-E2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 10.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 15.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 20.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 25.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 30.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 35.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 40.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 45.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 5.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | ALP LV | ALP 50.0L-E1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 10.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 10.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 15.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 15.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 20.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 20.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 25.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 25.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 30.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 5.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX | APX 5.0P-S0 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 10.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 15.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 20.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 25.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 30.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S1 | APX 5.0P-S1 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 10.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 10.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 15.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 15.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 20.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 20.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 25.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 25.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 30.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 30.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 5.0P-S2 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX S2 | APX 5.0P-S2 AU | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |
| 电池 | APX（CEC source series = APXAPX） | APX 30.0P-S0 | Pre-assembled Battery System (BS) | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved batteries list | TBD |

---

## 4. 填写规则

- 原则上按精确型号逐行维护，除非厂商明确按系列统一确认。
- 如果按系列支持，也要在 `型号` 列写清楚覆盖的具体型号范围。
- 如果某型号只支持监控，不支持调度或回读，必须分列标明，不能笼统写“支持”。
- 如果支持范围仅限特定区域，例如 AU / EU / Global，必须写入 `限制条件 / 备注`。
- 如果依赖固件、ShineServer、采集器、电站注册类型或安装配置，也必须在备注里写清楚。

---

## 5. 后续需要补充的信息

- 已确认支持的产品大类、系列和精确型号
- 是否仅支持监控，还是同时支持调度与回读
- 是否存在区域差异，例如 AU / EU / Global 云差异
- 是否存在固件、云端、采集器或注册前提条件
- 面向客户发布时的正式生效日期

---

## 6. 编辑说明

- 本附件应作为持续维护的兼容范围附件使用。
- `CEC listed`、`VPP compatible`、`OpenAPI supported` 应作为三个独立维度维护，不能混为一项。
- 某产品即使出现在监管清单或市场兼容表中，只要没有 OpenAPI 证据，也不应写入 `Confirmed` 范围。

---

## 7. 变更记录

| 日期 | 变更说明 |
| :--- | :--- |
| `2026-07-20` | 更新第 3.1 节"逆变器/PCE"，基于飞书 DTC 机型库数据，记录 31 个系列的完整 OpenAPI 支持状态 |
| `2026-04-24` | 依据当前 CEC Growatt 逆变器 / PCE 与电池清单预填附件 D，所有 OpenAPI 能力字段暂为待确认 |
