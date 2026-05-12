# 澳洲主流 VPP 市场图谱与兼容矩阵（联网核验版）

> 核验日期：2026-05-12  
> 方法口径：仅采用公开网页源头证据；优先使用运营方、零售商、平台方或官方帮助中心页面。若零售商未公开透明列出品牌清单，允许使用生态方公开 offer 页，并在判断中显著标注来源属性。

## 1. 一页结论

- 第一层主流零售商/类 VPP：**AGL VPP、Origin Loop、Amber SmartShift / Amber for Batteries、EnergyAustralia / Battery Ease、ENGIE VPP**。来源：AGL 官方 VPP 页、Evergen retailer offers、Amber SmartShift 官方帮助页、EnergyAustralia 官方 VPP 页、ENGIE 官方 VPP 页。
- 第二层特色/新锐方案：**GloBird ZEROHERO VPP、Discover Energy VPP**。来源：GloBird Join VPP 页面、Discover Energy VPP 页面与 Discover 官方兼容清单。
- 第三层区域/安装商主导：**Synergy Battery Rewards（WA）、ShineHub VPP**。来源：Synergy Battery Rewards 与 Supported Solutions List、ShineHub VPP 说明页。
- 平台层：**Evergen**。Evergen 是 VPP/DERMS 平台与硬件集成生态，不应与终端零售商 VPP 同层比较。来源：Evergen Integrated Partners 与 Growatt integrated partner 页面。
- Growatt 当前公开状态：Amber 为 testing，EnergyAustralia / Battery Ease 与 Evergen 为公开正向支持，Synergy 为 DER-storage 有记录但需区分 activation-ready 状态；AGL、Origin Loop、ENGIE、GloBird、Discover、ShineHub 当前公开来源未见 Growatt 正向兼容证据。来源见第 6 节 Growatt 行与第 9 节来源索引。

## 2. 状态图例

- 🟢 已公开支持/接入：当前公开来源可直接验证该品牌或系统在对应项目中可支持、兼容或已列入正向名单。
- 🟡 Beta / Open Beta / Testing / 条件限制：公开来源显示正在测试、open beta、DER-storage 但未见 activation-ready，或兼容条件较强。
- 🔴 本轮未找到公开正向证据：当前公开来源未列出该品牌或组合；不等于技术上绝对不支持。
- ⚪ 官方未公开透明列出品牌清单：项目存在，但当前公开页面没有可复用的品牌级清单。

## 3. 市场图谱分层表

| 对象 | 层级 | 角色定位 | 本轮判断 | 主要公开来源 |
|---|---|---|---|---|
| AGL VPP | 第一层：主流零售商 VPP | 零售商 VPP | 官方 VPP 页直接列出兼容品牌/型号；未列 Growatt。 | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant |
| Origin Loop | 第一层：主流零售商 VPP | 零售商 VPP | 未找到可用 Origin 官方现行 VPP 品牌清单；当前项目与品牌兼容主要依赖 Evergen retailer offers。 | https://evergen.energy/energy-retailer-offers/ |
| Amber SmartShift / Amber for Batteries | 第一层：主流零售商/类 VPP | 动态电价 + 自动化/VPP 类能力 | 官方兼容清单已扩展多品牌；Growatt 仍为 Amber 官方 testing，不在当前通用兼容清单。 | https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift |
| EnergyAustralia / Battery Ease | 第一层：主流零售商 VPP | 零售商 VPP；Battery Ease 是其 VPP-connected electricity plan / 产品 | EnergyAustralia 官方确认 Battery Ease 接入其 VPP 且 NSW 可用；品牌清单主要来自 Evergen Battery Ease offer。 | https://www.energyaustralia.com.au/home/solar-and-batteries/virtual-power-plant |
| ENGIE VPP | 第一层：主流零售商 VPP | 零售商 VPP | ENGIE 官方 VPP 页及品牌子页列出 Tesla、Sungrow、Sigenergy、Empower、Alpha；未列 Growatt。 | https://engie.com.au/residential/energy-efficiency/engie-vpp |
| GloBird ZEROHERO VPP | 第二层：特色零售商/新锐方案 | 电池计划 + 可选 VPP add-on | 官方 VPP add-on 兼容品牌扩展到 Alpha、Anker、Neovolt、Redback、SAJ、Sigenergy、SolaX、Solis+Dyness、Sungrow、eCactus。 | https://www.globirdenergy.com.au/join-vpp/ |
| Discover Energy VPP | 第二层：特色零售商/平台化方案 | 零售 + VPP 平台化 | 官方 VPP 页确认云端 VPP 模式；兼容以电池+逆变器组合清单为准，未列 Growatt。 | https://www.discoverenergy.com.au/vpp |
| Synergy Battery Rewards | 第三层：区域性项目（WA） | 区域政策驱动 VPP | SSL 已更新至 2026-04-30；DER-storage 与 activation-ready 需分开判断。 | https://www.synergy.net.au/Global/SSL |
| ShineHub VPP | 第三层：安装商/渠道主导 VPP | 安装商主导 / retailer-independent | 官方说明仍以 AlphaESS 电池为兼容前提；未列 Growatt。 | https://shinehub.com.au/blog/virtual-power-plant-explained/ |
| Evergen（平台） | 平台层：VPP 平台/编排与运营软件 | 平台 / 编排运营软件 | Integrated Partners 页面列出多品牌硬件伙伴，Growatt 有独立集成页。 | https://evergen.energy/integrated-partners/ |

## 4. 主流项目详细表

| 对象 | 公开项目口径 | 品牌兼容口径来源 | 证据等级 | 主要 URL | 备份 / 补充 URL |
|---|---|---|---|---|---|
| AGL VPP | 官方 VPP 页列出兼容电池与逆变器，并列出 Tesla、LG、SolarEdge、AlphaESS、Sigenergy、Sungrow 等。 | 官方兼容清单 | A | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant | https://www.agl.com.au/help-support/account-setup-management/about-virtual-power-plant |
| Origin Loop | 当前可复用公开证据来自 Evergen retailer offers；未找到 Origin 官方现行品牌级清单。 | 生态方公开 offer 页 | C | https://evergen.energy/energy-retailer-offers/ | Origin 原 VPP URL 本轮仍不作为有效来源索引 |
| Amber SmartShift / Amber for Batteries | 官方帮助页列出现行兼容品牌；open beta 与 testing 分别来自 Amber 官方 beta 页与 Evergen partnership update。 | 官方兼容总表 + 官方 beta/testing 页 | A | https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift | https://help.amber.com.au/hc/en-us/articles/41435142514317-What-does-beta-mean-for-SmartShift-compatibility |
| EnergyAustralia / Battery Ease | EnergyAustralia 官方 VPP 页确认 Battery Ease 是连接家庭电池到其 VPP 的 electricity plan，并当前 NSW 可用；品牌清单来自 Evergen offer。 | 官方项目页 + 生态方公开兼容名单 | B | https://www.energyaustralia.com.au/home/solar-and-batteries/virtual-power-plant | https://evergen.energy/energy-retailer-offers/ |
| ENGIE VPP | ENGIE 官方 VPP 页和品牌子页列出可加入 VPP 的电池/逆变器品牌。 | 官方 VPP 页 + 官方品牌子页 | A | https://engie.com.au/residential/energy-efficiency/engie-vpp | https://evergen.energy/energy-retailer-offers/ |
| GloBird ZEROHERO VPP | 官方 Join VPP 页说明 ZEROHERO 基础功能与可选 VPP add-on，并列出 VPP add-on 兼容品牌。 | 官方 VPP 接入页 | A | https://www.globirdenergy.com.au/join-vpp/ | https://www.globirdenergy.com.au/battery-scheduling/ |
| Discover Energy VPP | 官方 VPP 页描述云端 VPP；帮助中心发布兼容组合清单。 | 官方 VPP 页 + 官方兼容组合清单 | A- | https://www.discoverenergy.com.au/vpp | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List |
| Synergy Battery Rewards | Battery Rewards 是 Synergy VPP 相关项目；SSL 说明 DER-storage 与 activation-ready 的差异。 | 官方项目页 + 官方 SSL | B | https://www.synergy.net.au/Your-home/Solar-battery-and-EV/Battery-Rewards | https://www.synergy.net.au/Global/SSL |
| ShineHub VPP | 官方说明其 VPP 需要兼容电池，当前页面明确 AlphaESS 限制。 | 官方 VPP 说明页 | B | https://shinehub.com.au/blog/virtual-power-plant-explained/ | https://shinehub.com.au/blog/shinehub-community-virtual-power-plant/ |
| Evergen（平台） | 官方 Integrated Partners 页列出硬件伙伴；Growatt 有独立 Supported Hardware 页。 | 官方平台/集成伙伴页 | A | https://evergen.energy/integrated-partners/ | https://evergen.energy/integrated-partners/growatt/ |

## 5. 主流逆变器/电池品牌兼容矩阵

> 说明：澳洲公开 VPP 兼容通常按“电池 + 逆变器系统/组合”披露。矩阵为方便 BD/产品/FAE 快速扫描；逐项目来源和判断依据见第 6 节。

| 品牌 / 系统 | AGL | Origin Loop | Amber | EnergyAustralia / Battery Ease | ENGIE | GloBird | Discover | Synergy | ShineHub | Evergen | 主要来源 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sigenergy | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | 🟢 | 🔴 | 🟢 | AGL, Evergen offers, Amber, ENGIE, GloBird, Synergy SSL, Evergen partners |
| Sungrow | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | 🔴 | 🟢 | AGL, Evergen offers, Amber, ENGIE, GloBird, Discover, Synergy SSL, Evergen partners |
| Tesla | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | AGL, Evergen offers, Amber, ENGIE, Synergy SSL, Evergen partners |
| AlphaESS / Alpha | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | AGL, Evergen offers, Amber, ENGIE, GloBird, Discover, Synergy SSL, ShineHub, Evergen partners |
| FoxESS | 🔴 | 🔴 | 🟡 | 🔴 | 🔴 | 🔴 | 🔴 | 🟡 | 🔴 | 🟢 | Amber beta, Synergy SSL, Evergen partners |
| GoodWe | 🔴 | 🟢 | 🟡 | 🟢 | 🔴 | 🔴 | 🟢 | 🟡 | 🔴 | 🟢 | Evergen offers, Amber testing, Discover, Synergy SSL, Evergen partners |
| Growatt | 🔴 | 🔴 | 🟡 | 🟢 | 🔴 | 🔴 | 🔴 | 🟡 | 🔴 | 🟢 | Amber testing, Evergen offers, Synergy SSL, Evergen Growatt page |
| SolaX | 🔴 | 🟢 | 🔴 | 🔴 | 🔴 | 🟢 | 🔴 | 🟡 | 🔴 | 🟢 | Evergen offers, GloBird, Synergy SSL, Evergen partners |
| GivEnergy | 🔴 | 🟢 | 🟡 | 🟢 | 🔴 | 🔴 | 🔴 | ⚪ | 🔴 | 🟢 | Evergen offers, Amber beta, Evergen partners |
| SolarEdge | 🟢 | 🔴 | 🟢 | 🟢 | 🔴 | 🔴 | 🟢 | 🟡 | 🔴 | 🟢 | AGL, Amber, Evergen offers, Discover, Synergy SSL, Evergen partners |
| BYD + Fronius | 🔴 | 🔴 | 🟢 | 🔴 | 🔴 | 🔴 | 🟢 | 🟡 | 🔴 | ⚪ | Amber, Discover, Synergy SSL (Fronius) |
| Anker Solix | 🔴 | 🔴 | 🟡 | 🔴 | 🔴 | 🟢 | 🔴 | ⚪ | 🔴 | 🟢 | Amber beta, GloBird, Evergen partners |
| Enphase | 🔴 | 🔴 | 🟡 | 🔴 | 🔴 | 🔴 | 🔴 | ⚪ | 🔴 | 🟢 | Amber beta, Evergen partners |
| Redback | 🔴 | 🔴 | 🟢 | 🟢 | 🔴 | 🟢 | 🔴 | ⚪ | 🔴 | 🟢 | Amber, Evergen offers, GloBird, Evergen partners |
| Neovolt | 🔴 | 🔴 | 🟢 | 🔴 | 🔴 | 🟢 | 🔴 | ⚪ | 🔴 | 🟢 | Amber, GloBird, Evergen partners |
| SAJ | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | 🔴 | ⚪ | 🔴 | 🟢 | GloBird, Evergen partners |
| Solis + Dyness | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | 🟡 | 🔴 | 🔴 | 🟢 | GloBird, Discover compatibility list, Synergy SSL, Evergen partners |
| LG Energy Solution / LG Chem | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | 🔴 | 🟢 | 🔴 | 🔴 | ⚪ | AGL, Evergen offers, Amber, Discover, Synergy SSL |
| 1KOMMA5 | 🔴 | 🔴 | 🟡 | 🔴 | 🔴 | 🔴 | 🔴 | ⚪ | 🔴 | ⚪ | Amber beta |
| eCactus / WHES | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | 🔴 | ⚪ | 🔴 | 🟢 | GloBird, Evergen partners |
| Empower | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | 🔴 | 🔴 | ⚪ | 🔴 | 🟢 | ENGIE, Evergen offers |
| Ambrion / Hive / Eveready | 🔴 | 🟢 | 🟢 | 🟢 | 🔴 | 🔴 | 🔴 | 🟢 | 🔴 | 🟢 | Evergen offers, Amber, Synergy SSL, Evergen partners |
| PylonTech | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🟢 | ⚪ | 🔴 | 🟢 | Discover, Evergen partners |

## 6. 各项目兼容判断摘要

### AGL VPP

- 项目状态：🟢 官方 VPP 项目公开可用；来源：https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant
- 品牌判断口径：AGL 官方页面列出的 compatible battery systems and inverters；未列品牌按本轮公开正向证据缺失处理；来源：https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | Tesla, LG, SolarEdge, AlphaESS, Sigenergy, Sungrow | AGL 官方 VPP 页列为兼容电池/逆变器品牌。 | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant |
| 🔴 | Growatt, GoodWe, FoxESS, SolaX, GivEnergy, BYD, Anker, Enphase, Redback, Neovolt, SAJ, Solis+Dyness, 1KOMMA5, eCactus, Empower, PylonTech | AGL 当前公开兼容清单未列出这些品牌。 | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant |

### Origin Loop

- 项目状态：🟡 项目仍见于 Evergen retailer offers，但本轮未找到 Origin 官方现行品牌级 VPP 清单；来源：https://evergen.energy/energy-retailer-offers/
- 品牌判断口径：生态方 Evergen offer 页列出的 Origin Loop 电池/逆变器品牌；该证据不是 Origin 官网自列品牌页。来源：https://evergen.energy/energy-retailer-offers/

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | Tesla, AlphaESS, Eveready, GoodWe, SolaX, LG, Sungrow, Sigenergy, GivEnergy | Evergen retailer offers 页列出 Origin Loop 的最小电池规模与兼容品牌。 | https://evergen.energy/energy-retailer-offers/ |
| 🔴 | Growatt, FoxESS, SolarEdge, BYD, Anker, Enphase, Redback, Neovolt, SAJ, Solis+Dyness, 1KOMMA5, eCactus, Empower, PylonTech | Evergen Origin Loop offer 当前未列这些品牌；未找到 Origin 官方正向清单补强。 | https://evergen.energy/energy-retailer-offers/ |

### Amber SmartShift / Amber for Batteries

- 项目状态：🟢 Amber SmartShift 官方兼容清单公开可用；来源：https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift
- 品牌判断口径：当前兼容清单、open beta 官方说明、GoodWe/Growatt testing 官方说明三者合并判断。来源：https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | Sigenergy, Tesla, SolarEdge, LG Chem + SolarEdge, AlphaESS, Hive, REA POWER, BYD HVM/HVS + Fronius GEN24, Sungrow, Redback, Neovolt, Fronius Reserva | Amber 官方兼容清单列出这些系统或组合。 | https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift |
| 🟡 | 1KOMMA5, Anker Solix, Enphase, FoxESS, GivEnergy | Amber 官方 beta 说明列为 open beta；open beta 期间可接入但仍在优化。 | https://help.amber.com.au/hc/en-us/articles/41435142514317-What-does-beta-mean-for-SmartShift-compatibility |
| 🟡 | GoodWe, Growatt | Amber 官方 Evergen partnership update 明确 GoodWe/Growatt 仍处于 testing 或即将支持范围说明。 | https://help.amber.com.au/hc/en-us/articles/38770967278477-Update-on-Amber-s-partnership-with-Evergen |
| 🔴 | SolaX, SAJ, Solis+Dyness, eCactus, Empower, PylonTech | Amber 当前公开兼容清单、beta 页与 testing 页未列为当前可接入或正在测试的目标。 | https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift |

### EnergyAustralia / Battery Ease

- 项目状态：🟢 EnergyAustralia 官方 VPP 页面确认 Battery Ease 是其 VPP-connected electricity plan，可连接家庭电池到 EnergyAustralia VPP，且当前 NSW 可用；来源：https://www.energyaustralia.com.au/home/solar-and-batteries/virtual-power-plant
- 品牌判断口径：Battery Ease 是 EnergyAustralia 产品/计划；品牌兼容主要来自 Evergen Battery Ease offer，该证据不是 EnergyAustralia 官网自列品牌页。来源：https://evergen.energy/energy-retailer-offers/

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | AlphaESS, Ambrion, Eveready, GivEnergy, GoodWe, Growatt, Hive, LG Energy Solutions, Redback, Sigenergy, SolarEdge, Sungrow, Sunpower, Tesla | Evergen retailer offers 页列出 Battery Ease 最小电池规模与兼容品牌。 | https://evergen.energy/energy-retailer-offers/ |
| 🔴 | FoxESS, SolaX, BYD, Anker, Enphase, Neovolt, SAJ, Solis+Dyness, 1KOMMA5, eCactus, Empower, PylonTech | Evergen Battery Ease offer 当前未列这些品牌。 | https://evergen.energy/energy-retailer-offers/ |

### ENGIE VPP

- 项目状态：🟢 ENGIE 官方 VPP 项目公开可用；来源：https://engie.com.au/residential/energy-efficiency/engie-vpp
- 品牌判断口径：ENGIE 官方 VPP 页的品牌入口与对应 eligible batteries and inverters 子页；Evergen offer 可作为区域和 offer 补充来源。来源：https://engie.com.au/residential/energy-efficiency/engie-vpp

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | Tesla, Sungrow, Sigenergy, Empower, AlphaESS | ENGIE 官方 VPP 页提供这些品牌的 eligible batteries and inverters 子页；Evergen offer 也列出 ENGIE 支持 Alpha ESS、Sungrow、Sigenergy、Tesla、Empower。 | https://engie.com.au/residential/energy-efficiency/engie-vpp |
| 🔴 | Growatt, GoodWe, FoxESS, SolaX, GivEnergy, SolarEdge, BYD, Anker, Enphase, Redback, Neovolt, SAJ, Solis+Dyness, LG, 1KOMMA5, eCactus, PylonTech | ENGIE 官方 VPP 品牌入口和 Evergen ENGIE offer 当前未列这些品牌。 | https://engie.com.au/residential/energy-efficiency/engie-vpp |

### GloBird ZEROHERO VPP

- 项目状态：🟢 GloBird 官方 Join VPP 页面公开可用；来源：https://www.globirdenergy.com.au/join-vpp/
- 品牌判断口径：区分 ZEROHERO 标准计划与可选 VPP add-on；下表仅判断 VPP add-on 兼容品牌。来源：https://www.globirdenergy.com.au/join-vpp/

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | Alpha, Anker, Neovolt, Redback, SAJ, Sigenergy, SolaX, Solis+Dyness, Sungrow, eCactus (WHES) | GloBird Join VPP 页面列为 optional VPP feature 当前兼容品牌。 | https://www.globirdenergy.com.au/join-vpp/ |
| 🔴 | Growatt, GoodWe, FoxESS, Tesla, SolarEdge, BYD, Enphase, GivEnergy, LG, 1KOMMA5, Empower, PylonTech | GloBird 当前 VPP add-on 兼容品牌清单未列这些品牌。 | https://www.globirdenergy.com.au/join-vpp/ |

### Discover Energy VPP

- 项目状态：🟢 Discover Energy 官方 VPP 页面公开可用；来源：https://www.discoverenergy.com.au/vpp
- 品牌判断口径：以 Discover Energy VPP Product Compatibility List 的逆变器+电池组合为准。来源：https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | GoodWe, BYD, PylonTech, AlphaESS, SolarEdge, LG, Sungrow | Discover 官方兼容组合清单列出这些逆变器/电池组合。 | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List |
| 🟡 | Solis + Dyness | Discover 官方兼容组合清单列出 Solis + Dyness，并带有 testing 条件说明。 | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List |
| 🔴 | Growatt, Sigenergy, Tesla, FoxESS, SolaX, GivEnergy, Anker, Enphase, Redback, Neovolt, SAJ, 1KOMMA5, eCactus, Empower | Discover 当前公开兼容组合清单未列这些品牌或组合。 | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List |

### Synergy Battery Rewards

- 项目状态：🟢 Synergy Battery Rewards 公开项目存在；来源：https://www.synergy.net.au/Your-home/Solar-battery-and-EV/Battery-Rewards
- 品牌判断口径：Synergy SSL 中 DER-storage 类别用于 VPP eligibility；绿色 tick 表示 ready to be activated under a VPP program。来源：https://www.synergy.net.au/Global/SSL

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | AlphaESS, Sigenergy, Ambrion | Synergy SSL DER-storage 记录可见 activation-ready tick 或同类正向记录。 | https://www.synergy.net.au/Global/SSL |
| 🟡 | Growatt, GoodWe, FoxESS, SolaX, SolarEdge, Sungrow | Synergy SSL 可见 DER-storage 或相关记录，但本轮按公开页面未确认 activation-ready tick 统一标为条件限制。 | https://www.synergy.net.au/Global/SSL |
| 🟡 | BYD + Fronius | Amber 对 BYD 的现行组合依赖 Fronius；Synergy SSL 对 Fronius 可见正向记录，但不是直接的 BYD Battery Rewards 品牌清单。 | https://www.synergy.net.au/Global/SSL |
| 🔴 | Tesla, LG, Solis+Dyness | Synergy SSL 本轮未见可直接用于 Battery Rewards 的 DER-storage 正向品牌组合。 | https://www.synergy.net.au/Global/SSL |
| ⚪ | GivEnergy, Anker, Enphase, Redback, Neovolt, SAJ, 1KOMMA5, eCactus, Empower, PylonTech | 本轮未形成可复用的 Synergy Battery Rewards 品牌级判断，需后续逐项查 SSL/applicants。 | https://www.synergy.net.au/Global/SSL |

### ShineHub VPP

- 项目状态：🟢 ShineHub VPP 公开说明存在；来源：https://shinehub.com.au/blog/virtual-power-plant-explained/
- 品牌判断口径：ShineHub 官方 VPP 说明页明确当前 VPP 兼容电池限制。来源：https://shinehub.com.au/blog/virtual-power-plant-explained/

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | AlphaESS | ShineHub 官方说明当前 VPP 兼容 AlphaESS 电池。 | https://shinehub.com.au/blog/virtual-power-plant-explained/ |
| 🔴 | Growatt, GoodWe, FoxESS, Sigenergy, Sungrow, Tesla, SolaX, GivEnergy, SolarEdge, BYD, Anker, Enphase, Redback, Neovolt, SAJ, Solis+Dyness, LG, 1KOMMA5, eCactus, Empower, PylonTech | ShineHub 当前公开 VPP 说明未列这些品牌。 | https://shinehub.com.au/blog/virtual-power-plant-explained/ |

### Evergen（平台）

- 项目状态：🟢 Evergen 平台与集成伙伴生态公开可用；来源：https://evergen.energy/integrated-partners/
- 品牌判断口径：Integrated Partners 总表与品牌独立集成页；Evergen 是平台/编排层，不等同于某个零售商 VPP。来源：https://evergen.energy/integrated-partners/

| 品牌状态 | 品牌 / 系统 | 判断依据 | URL |
|---|---|---|---|
| 🟢 | AlphaESS, Anker Solix, Deye, eCactus, Empower, Enphase, Eveready, FoxESS, GivEnergy, GoodWe, Growatt, Hive, Neovolt, PylonTech, Redback, RedX, SAJ, Sigenergy, SolarEdge, SolaX, Solis, Sungrow, Tesla | Evergen Integrated Partners 页面列为 batteries & inverters integrated partners。 | https://evergen.energy/integrated-partners/ |
| 🟢 | Growatt | Evergen Growatt 独立页面列出 Growatt Supported Hardware。 | https://evergen.energy/integrated-partners/growatt/ |
| ⚪ | BYD, LG Energy Solution / LG Chem, 1KOMMA5 | Evergen Integrated Partners 总表本轮未形成清晰品牌级正向判断。 | https://evergen.energy/integrated-partners/ |

## 7. Growatt 专项状态

| 项目 | Growatt 状态 | 判断 | URL |
|---|---|---|---|
| AGL VPP | 🔴 | AGL 官方兼容清单未列 Growatt。 | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant |
| Origin Loop | 🔴 | Evergen Origin Loop offer 未列 Growatt；未找到 Origin 官网正向清单。 | https://evergen.energy/energy-retailer-offers/ |
| Amber SmartShift | 🟡 | Amber 官方说明仍在 testing Growatt，且近期可能限 APX/SPH inverter and battery combinations。 | https://help.amber.com.au/hc/en-us/articles/38770967278477-Update-on-Amber-s-partnership-with-Evergen |
| EnergyAustralia / Battery Ease | 🟢 | Evergen Battery Ease offer 列出 Growatt；EnergyAustralia 官方页确认 Battery Ease 是其 VPP-connected electricity plan。 | https://evergen.energy/energy-retailer-offers/ |
| ENGIE VPP | 🔴 | ENGIE 官方 VPP 品牌入口和 Evergen ENGIE offer 未列 Growatt。 | https://engie.com.au/residential/energy-efficiency/engie-vpp |
| GloBird ZEROHERO VPP | 🔴 | GloBird VPP add-on 兼容品牌清单未列 Growatt。 | https://www.globirdenergy.com.au/join-vpp/ |
| Discover Energy VPP | 🔴 | Discover 官方兼容组合清单未列 Growatt。 | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List |
| Synergy Battery Rewards | 🟡 | Synergy SSL 可见 Growatt DER-storage 相关记录，但本轮按公开页面未确认 activation-ready tick。 | https://www.synergy.net.au/Global/SSL |
| ShineHub VPP | 🔴 | ShineHub VPP 当前公开说明仅确认 AlphaESS。 | https://shinehub.com.au/blog/virtual-power-plant-explained/ |
| Evergen 平台 | 🟢 | Evergen Integrated Partners 与 Growatt 独立页面均提供正向证据。 | https://evergen.energy/integrated-partners/growatt/ |

## 8. 证据使用说明

- **A / A-**：运营方、品牌方或官方帮助中心直接列出项目、品牌、型号或兼容组合。
- **B / B-**：项目官方存在，但品牌级兼容判断主要来自官方生态页、平台页、SSL 或 retailer offer 页面。
- **C**：未找到运营方现行官方项目页或品牌清单，仅能依赖生态方公开 offer 保留结论，需显著标注风险。
- **🔴 不等于不支持**：仅表示本轮未找到可用于老板/销售/FAE 对外引用的公开正向网页。
- **⚪ 不等于不支持**：表示当前公开页面不足以形成品牌级判断，需要继续补厂商、项目方、安装商或技术清单证据。

## 9. 建议下一轮补充

- 对 Synergy：持续跟踪 SSL activation-ready tick 与 applicants 进度页，尤其是 Growatt、Sungrow、GoodWe、SolaX、SolarEdge。
- 对 Amber：持续跟踪 Growatt/GoodWe 是否从 testing 进入 open beta 或 current compatible list。
- 对 Origin：持续查找 Origin 官方现行 VPP/Loop 页面是否恢复；若恢复，应替换 Evergen-only 的 C 级判断。
- 对 EnergyAustralia / Battery Ease：若 EnergyAustralia 官网公开 Battery Ease 品牌清单，可把该产品的品牌证据从 B 提升到 A。
- 对扩展品牌：继续补 BYD、Fronius、Enphase、Redback、Anker、Neovolt、SAJ、Solis+Dyness、LG Energy Solution 在各项目中的官方页面证据。

## 10. 来源索引

| 标题 | URL | 用途 |
|---|---|---|
| AGL VPP official page | https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant | AGL 官方 VPP 项目页与兼容品牌/机型列表 |
| AGL VPP help page | https://www.agl.com.au/help-support/account-setup-management/about-virtual-power-plant | AGL VPP 备份说明 |
| Evergen Energy Retailer Offers | https://evergen.energy/energy-retailer-offers/ | EnergyAustralia / Battery Ease、ENGIE、Origin Loop 的公开 offer 与品牌列表 |
| Amber SmartShift compatibility | https://help.amber.com.au/hc/en-us/articles/10015835768845-Which-batteries-are-compatible-with-SmartShift | Amber 当前兼容品牌总表 |
| Amber beta meaning | https://help.amber.com.au/hc/en-us/articles/41435142514317-What-does-beta-mean-for-SmartShift-compatibility | Amber open beta 品牌状态 |
| Amber Evergen partnership update | https://help.amber.com.au/hc/en-us/articles/38770967278477-Update-on-Amber-s-partnership-with-Evergen | Amber 对 GoodWe / Growatt testing 的公开说明 |
| Amber SmartShift compatibility checker | https://www.amber.com.au/smartshift-compatibility-checker | Amber compatibility checker 与 SmartShift 兼容定义 |
| EnergyAustralia VPP page | https://www.energyaustralia.com.au/home/solar-and-batteries/virtual-power-plant | EnergyAustralia / Battery Ease 官方项目状态与 NSW 可用性 |
| ENGIE VPP page | https://engie.com.au/residential/energy-efficiency/engie-vpp | ENGIE 官方 VPP 项目页与品牌入口 |
| ENGIE Tesla eligible batteries | https://engie.com.au/residential/energy-efficiency/engie-vpp/tesla-eligible-batteries-and-inverters | ENGIE Tesla 兼容子页 |
| ENGIE Sungrow eligible batteries | https://engie.com.au/residential/energy-efficiency/engie-vpp/sungrow-eligible-batteries-and-inverters | ENGIE Sungrow 兼容子页 |
| ENGIE Sigenergy eligible batteries | https://engie.com.au/residential/energy-efficiency/engie-vpp/sigenergy-eligible-batteries-inverters | ENGIE Sigenergy 兼容子页 |
| ENGIE Empower eligible batteries | https://engie.com.au/residential/energy-efficiency/engie-vpp/empower-eligible-batteries-and-inverters | ENGIE Empower 兼容子页 |
| ENGIE Alpha eligible batteries | https://engie.com.au/residential/energy-efficiency/engie-vpp/alpha-eligible-batteries-and-inverters | ENGIE Alpha/AlphaESS 兼容子页 |
| GloBird Join VPP | https://www.globirdenergy.com.au/join-vpp/ | GloBird VPP add-on 兼容品牌列表 |
| GloBird Battery Scheduling | https://www.globirdenergy.com.au/battery-scheduling/ | GloBird ZEROHERO / battery scheduling 备份说明 |
| Discover VPP page | https://www.discoverenergy.com.au/vpp | Discover 官方 VPP 项目页 |
| Discover compatibility list | https://help.discoverenergy.com.au/hc/en-us/articles/1500003407681-Discover-Energy-VPP-Product-Compatibility-List | Discover VPP 兼容组合清单 |
| Synergy Battery Rewards | https://www.synergy.net.au/Your-home/Solar-battery-and-EV/Battery-Rewards | Synergy Battery Rewards 项目页 |
| Synergy Supported Solutions List | https://www.synergy.net.au/Global/SSL | Synergy SSL、DER-storage、activation-ready 判断 |
| ShineHub VPP explained | https://shinehub.com.au/blog/virtual-power-plant-explained/ | ShineHub VPP 与 AlphaESS 限制说明 |
| ShineHub Community VPP | https://shinehub.com.au/blog/shinehub-community-virtual-power-plant/ | ShineHub Community VPP 备份说明 |
| Evergen integrated partners root | https://evergen.energy/integrated-partners/ | Evergen 硬件集成伙伴总表 |
| Evergen Growatt | https://evergen.energy/integrated-partners/growatt/ | Evergen Growatt 独立集成页 |
