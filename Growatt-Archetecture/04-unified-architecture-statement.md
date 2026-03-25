# 推荐的统一架构口径

## 推荐表述

### 中文版本

平台整体采用 **API Layer、Cloud Platform Layer、Edge Connectivity Layer、Protocol Abstract Layer 和 Device Layer** 的分层架构。
对外提供两套北向接口：**Legacy API（Token）** 与 **OpenAPI（OAuth 2.0）**，用于支持存量第三方集成与新一代标准化生态接入。

在云端与采集器之间，平台同时支持两种通信路径：
一类是基于 **0x04 分类分级** 的快速刷新链路，用于约 1 分钟级的数据更新；
另一类是基于 **0x03 普通查询** 的 legacy 链路，用于约 5 分钟级的数据兼容查询。

在南向协议侧，采集器通过协议抽象层统一接入现场设备。
当前 **XH 系列、SPH 系列、X 系列** 已完成 **VPP Protocol 2.04** 标准化接入；
**SPF 系列** 仍基于 **RTU Protocol** 进行兼容接入。

在设备建模上，电池不作为独立接入对象，而是通过对应逆变器进行管理和状态上送。
其中 **XH 系列对应 HV Battery，SPH 系列与 SPF 系列对应 LV Battery，X 系列为纯 PV Inverter，不直接管理电池**。
