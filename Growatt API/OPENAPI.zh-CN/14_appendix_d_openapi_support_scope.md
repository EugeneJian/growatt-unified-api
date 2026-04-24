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

| 产品大类 | 系列 | 型号 | 拓扑 / 设备类型 | OpenAPI 支持状态 | OAuth2 接入 | 设备信息 / 数据 | 下发调度 | 回读校验 | 数据推送 | 限制条件 / 备注 | 证据来源 | 生效日期 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 10KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 11KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 12KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 13KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 15KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 17KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 20KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 25KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MID 10-30KTL3-XH | MID 30KTL3-XH (AS4777-2 2020) | Supplementary Supply Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN 7000-10000TL-X2 | MIN 10000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN 7000-10000TL-X2 | MIN 7000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN 7000-10000TL-X2 | MIN 8000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN 7000-10000TL-X2 | MIN 9000TL-X2 (AS4777-2 2020) | Grid Connect PV Inverter | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 2500TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 3000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 3600TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 4200TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 4600TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 5000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MIN TL-XH2 | MIN 6000TL-XH2 (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 10KTL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 3000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 4000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 5000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 6000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 7000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 8000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD | MOD 9000TL3-XH (AS4777-2 2020) | Grid Connect Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 10KTL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 3000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 4000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 5000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 6000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 7000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 8000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | MOD-XA | MOD 9000TL3-XA (AS4777-2 2020) | Grid Connect Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AU | SPA 3600TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AU | SPA 4000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AU | SPA 4600TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AU | SPA 5000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AU | SPA 6000TL-AU (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AUB | SPA 3600TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AUB | SPA 4000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AUB | SPA 4600TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AUB | SPA 5000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPA 3000-6000 TL-AUB | SPA 6000TL-AUB (AS4777-2 2020) | Multiple Mode Inverter - Battery Only | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPF | SPF 3000T HVM-G2 (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPF | SPF 6000 ES PLUS (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPF | SPF 6000T HVM-G2 (AS4777-2 2020) | Stand - Alone PV Inverter With Grid Input | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HU | SPH 3600TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HU | SPH 4000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HU | SPH 4600TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HU | SPH 5000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HU | SPH 6000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HUB | SPH 3600TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HUB | SPH 4000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HUB | SPH 4600TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HUB | SPH 5000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPH 3000-6000 TL-HUB | SPH 6000TL-HUB (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPM | SPM 10000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |
| 逆变器 / PCE | SPM | SPM 8000TL-HU (AS4777-2 2020) | Multiple Mode Inverter - PV and Battery | Pending Confirmation | TBD | TBD | TBD | TBD | TBD | CEC AU 基线，OpenAPI 待确认。 | CEC approved inverters list | TBD |

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
| `2026-04-24` | 依据当前 CEC Growatt 逆变器 / PCE 与电池清单预填附件 D，所有 OpenAPI 能力字段暂为待确认 |
