下面我把它升级成一版更适合**内部汇报/BD排优先级**的版本。

我把“公开兼容状态”进一步拆成 5 个字段：



- **公开状态**：已公开支持 / 测试中 / 未找到公开证据

- **证据强度**：A / B / C

  

  - **A** = 官方页面或官方 PDF 明确列名 Growatt
  - **B** = 官方或合作方公开页面可推断支持，但不是供应商自己页面直接列名
  - **C** = 仅能确认该 VPP 存在，未找到 Growatt 公开名录

  

- **合作阶段判断**：已落地 / 集成推进中 / 待BD突破

- **BD优先级**：高 / 中 / 低

- **判断依据**：一句话解释为什么这样分级





------





## **澳洲 VPP 供应商 × Growatt 公开兼容状态表（升级版）**



| **供应商 / 项目**                   | **区域**     | **公开状态**           | **证据强度**             | **合作阶段判断**               | **BD优先级** | **判断依据**                                                 | **主要来源**                                                 |
| ----------------------------------- | ------------ | ---------------------- | ------------------------ | ------------------------------ | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Evergen**                         | 澳大利亚多州 | **已公开支持**         | **A**                    | **已落地**                     | **高**       | Evergen 官方单独有 **Growatt / Supported Hardware** 页面，属于最直接公开证据。 | Evergen Growatt 页面                                         |
| **Synergy / Battery Rewards / VPP** | 西澳 WA      | **已公开支持**         | **A**                    | **已落地**                     | **高**       | Synergy 官方 SSL 明确说明，若方案要用于其 **VPP product**，需列在 **DER–Storage**；同一官方 PDF 中可检索到 Growatt 相关型号/厂商信息。 | Synergy SSL 说明与VPP条件 ；Growatt 在 Synergy 旧版 Supported Devices List 中被明确列名 |
| **Horizon Power / Community Wave**  | 西澳 WA      | **已公开支持**         | **A**                    | **已落地**                     | **中高**     | Horizon Power 官方页明确称 **Community Wave 是其 VPP**，并说明新增电池需接入与其 SGD 兼容的逆变器；同站公开信息中可检索到 Growatt 型号。 | Horizon Power 官方 Community Wave 页明确是 VPP               |
| **Amber / SmartShift**              | 多州         | **测试中**             | **A**                    | **集成推进中**                 | **高**       | Amber 兼容列表当前未列 Growatt；但 Amber 官方 FAQ 明确写到 **“We are also testing Growatt inverters”**，并指出近期可能只支持 **APX/SPH** 组合。 | Amber 当前兼容清单未见 Growatt ；Amber FAQ 明确写明正在测试 Growatt |
| **EnergyAustralia / Battery Ease**  | NSW          | **已公开支持（间接）** | **B**                    | **已落地或已具备公开销售条件** | **高**       | EnergyAustralia 官方 VPP 页说明了 **Battery Ease** 是其连接家庭电池到 VPP 的方案；Evergen 的公开零售商页面则直接把 **Growatt** 列入 Battery Ease 支持品牌。这里证据不是 EnergyAustralia 官网直接列名，因此定为 **B**。 | EnergyAustralia 官方 VPP/Battery Ease 说明 ；Evergen Energy Retailer Offers 中 Battery Ease 明列 Growatt |
| **AGL VPP / BYOB**                  | 多州         | **未找到公开证据**     | **A-（对“未列名”判断）** | **待BD突破**                   | **中高**     | AGL 官方 VPP eligibility 页面公开列出 Tesla、LG、SolarEdge、AlphaESS、Sigenergy、Sungrow 等兼容品牌/型号，但未见 Growatt。说明至少当前公开名录中没有 Growatt。 | AGL 官方 eligibility 列表                                    |
| **Origin Loop**                     | 多州         | **未找到公开证据**     | **B**                    | **待BD突破**                   | **高**       | Origin 官方公开页面确认 **Origin Loop** 需要“compatible battery and inverter”；其公开博客/页面列出的兼容品牌包括 Tesla、AlphaESS、Sungrow、LG、Solax、GoodWe、Eveready，但未见 Growatt。 | Origin Loop 官方公开结果与兼容要求                           |



------





## **三类汇总**







### **1）已公开支持**





- **Evergen**：最强证据，官方直接单页列名 Growatt。 
- **Synergy（WA）**：官方 VPP/DER 文件链路清晰，属于强支持证据。 
- **Horizon Power / Community Wave（WA）**：官方明确是 VPP，且公开信息指向 Growatt 兼容。 
- **EnergyAustralia / Battery Ease**：目前更适合写成**“已公开支持（间接）”**，因为 Growatt 是在 Evergen 的零售商支持页中被列出，不是 EnergyAustralia 自己官网直接点名。 







### **2）测试中**





- **Amber / SmartShift**：这是当前最明确的“推进中”对象。兼容列表未正式收录，但官方 FAQ 已明确写明正在测试 Growatt，且方向聚焦 **APX/SPH**。 







### **3）未找到公开证据**





- **AGL**：公开 eligibility 页面列得很细，但没有 Growatt。 
- **Origin Loop**：公开可见兼容要求和若干品牌，但未见 Growatt。 





------





## **证据强度说明**







### **A 级：可直接对外/对内引用**





这类可以在汇报里直接写“官网公开可验证”：



- Evergen 
- Synergy 
- Horizon Power 
- Amber（测试中） 







### **B 级：可以用于内部判断，但表达要谨慎**





- EnergyAustralia：Growatt 出现在 Evergen 的零售商方案页，不是 EA 官网直接列名，所以适合写成**“公开间接证据显示可支持”**。 
- Origin：官方能确认 VPP 存在、且有兼容品牌公开信息，但 Growatt 未见公开列名。 





------





## **对 Growatt 的合作阶段判断**







### **第一梯队：**

### **已落地，适合做案例放大**





1. **Evergen**

   这是最适合拿来做外部背书和内部案例复用的对象，因为 Growatt 已被 Evergen 直接公开列为 supported hardware。 

2. **Synergy（WA）**

   更偏**合规+项目准入+VPP激活**价值。对 Growatt 而言，不只是“能接”，而是与 WA 的政策/技术清单体系挂钩，含金量高。 

3. **Horizon Power / Community Wave**

   更偏区域型/网络型 VPP 接入场景，战略价值在于**西澳离网/弱网/边远社区**示范意义。 







### **第二梯队：**

### **正在推进，最值得尽快突破**





1. **Amber / SmartShift**

   这是当前最值得 BD 和产品团队重点推进的对象之一。因为 Amber 已经公开承认在测 Growatt，这意味着不再是纯陌生开拓，而是**已经进入技术评估阶段**。如果推进顺利，最可能从“测试中”变成“公开支持”。 

2. **EnergyAustralia / Battery Ease**

   这个对象的特点是：公开销售/零售侧已经出现 Growatt 名字，但官方主站没有直接列品牌，说明它更像**渠道层已可售/已可纳入，但品牌显性露出不足**。适合推动把“间接支持”升级为“EnergyAustralia 官方直接列名”。 







### **第三梯队：**

### **还没有公开突破，但值得BD继续推进**





1. **Origin Loop**

   Origin 是头部零售商/VPP 玩家，品牌价值高。虽然当前公开兼容品牌里没看到 Growatt，但它公开兼容的品牌范围并不窄，说明理论上并非完全封闭。这个更像**重要但尚未公开突破的目标账户**。 

2. **AGL**

   AGL 现有兼容名单已经比较具体，但未见 Growatt，说明这边更可能需要完整的产品、接口、质量和运营证明材料，进入门槛相对更高。 





------





## **BD优先级建议**







### **优先级：高**





- **Amber**：因为已经在测试，最容易从“技术验证”走向“正式上线”。 
- **EnergyAustralia**：因为已经出现间接公开支持，距离“官网直接列名”可能只差品牌露出和合作包装。 
- **Origin**：头部零售商，突破后品牌价值大。 
- **Evergen / Synergy**：不是为了“从0到1”，而是为了**把已落地成果转成标杆案例、联合营销、更多区域复制**。 







### **优先级：中高**





- **AGL**：体量大，但现有名单未见 Growatt，预计推进周期会更长。 
- **Horizon Power**：有示范意义，但项目广度和商业扩张性通常不如全国性零售商。 





------





## **一页式汇报结论**





你可以直接把下面这段放进内部汇报：



> 截至 **2026年3月13日**，按澳洲公开网页可验证信息，Growatt 在澳洲 VPP 相关生态中已形成三层状态：

> **第一层：已公开支持**——Evergen、Synergy、Horizon Power；其中 Evergen 为官方直接列名，Synergy/Horizon Power 具有较强的项目准入与区域示范价值。

> **第二层：测试中**——Amber 已官方公开说明正在测试 Growatt，短期最有机会从“测试中”转为“正式兼容”。

> **第三层：未见公开证据**——AGL、Origin 当前公开页面尚未看到 Growatt 被列入兼容目录；其中 Origin 由于品牌影响力与市场位置，仍应作为重点突破对象。

> 同时，**EnergyAustralia Battery Ease** 已出现 Growatt 的公开间接支持证据，建议推动从“渠道页列名”升级到“EnergyAustralia 官方页面直接列名”。 



下一步我可以继续把这份内容整理成 **Excel风格矩阵**，再加一列：**“建议对接人类型 / 建议推进动作 / 预计阻塞点”**。