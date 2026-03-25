# Growatt-Archetecture

## 文档说明

本文档面向第三方平台、生态合作伙伴、系统集成方及相关技术和业务沟通对象，用于说明 Growatt 企业平台的总体架构、接口边界、云边通信方式、协议接入关系以及设备建模原则。

Growatt 企业平台通过统一 API、云边协同通信体系以及标准化与兼容并行的设备接入能力，为多类型外部平台提供一致的接入边界与可演进的架构基础。本文档旨在帮助外部受众快速建立对平台能力范围、接入方式、协议关系和设备模型的整体认知。

文档目标是帮助受众快速理解：

- 平台整体分层与核心能力边界
- Legacy API 与 OpenAPI 的对外定位
- 云端、采集器与设备之间的通信关系
- 设备标准化接入与 legacy 兼容路径
- 电池与逆变器之间的建模关系

## 阅读路径

### 总览

1. [文档目的与核心结论](01-document-purpose-and-core-conclusions.md)
2. [平台总体架构](02-platform-architecture.md)

### 角色视图

1. [业务决策视图](03-role-views/01-management-view.md)
2. [平台架构师视图](03-role-views/02-platform-architect-view.md)
3. [API / 第三方接入视图](03-role-views/03-api-partner-view.md)
4. [云边通信视图](03-role-views/04-cloud-edge-view.md)
5. [协议与设备接入视图](03-role-views/05-protocol-device-view.md)
6. [设备建模视图](03-role-views/06-device-modeling-view.md)

### 统一口径与结论

1. [推荐的统一架构口径](04-unified-architecture-statement.md)
2. [总结与后续方向](05-conclusion-and-next-steps.md)

## 适合的阅读对象

- 业务决策者与生态负责人
- 平台架构师与解决方案架构师
- API 集成人员与第三方平台团队
- 设备接入、协议适配与数据建模相关团队

## 使用建议

- 若重点关注平台整体定位，建议先阅读“文档目的与核心结论”和“平台总体架构”。
- 若重点关注接入与集成，建议优先阅读“API / 第三方接入视图”“云边通信视图”和“协议与设备接入视图”。
- 若重点关注数据语义与对象关系，建议优先阅读“设备建模视图”和“推荐的统一架构口径”。
