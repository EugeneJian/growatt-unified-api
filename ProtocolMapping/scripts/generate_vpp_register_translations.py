#!/usr/bin/env python3
"""Generate the reviewed English register translation overlay for VPP rows.

The overlay is intentionally separate from the PDF extraction result. It keeps a
Chinese source snapshot so a future PDF refresh fails fast when a translated row
is stale and needs review.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


DEFAULT_VPP_JSON = Path("ProtocolMapping/data/vpp_protocol_v2_05.json")
DEFAULT_OUTPUT = Path("ProtocolMapping/data/register_translations/en-US/vpp_v2_05.json")

HAN_RE = re.compile(r"[\u3400-\u9fff]")

FIELD_TRANSLATIONS = {
    "SN": "SN",
    "SOC": "SOC",
    "SOH": "SOH",
    "AC充电使能": "AC charge enable",
    "BDC额定充放功率": "BDC rated charge/discharge power",
    "EPS离网使能": "EPS off-grid enable",
    "EPS离网有功功率": "EPS off-grid active power",
    "EPS离网电压(3)": "EPS off-grid voltage (3)",
    "EPS离网频率": "EPS off-grid frequency",
    "GEN口有功功率": "GEN port active power",
    "PV 输入最大功率": "PV input maximum power",
    "PV总发电能量": "Total PV generation energy",
    "PV输入功率": "PV input power",
    "Peak shaving 使能": "Peak shaving enable",
    "Peak shaving备电 SOC": "Peak shaving backup SOC",
    "SYN使能": "SYN enable",
    "VPP协议版本号": "VPP protocol version",
    "保护主码": "Protection main code",
    "保护子码": "Protection sub-code",
    "保留": "Reserved",
    "充放电功率": "Charge/discharge power",
    "充放电功率实际控制值": "Actual charge/discharge power control value",
    "充电截止SOC": "Charge cut-off SOC",
    "分时段充放电默认模式": "Default time-of-use charge/discharge mode",
    "分时段充放电（20 段）": "Time-of-use charge/discharge (20 periods)",
    "到用户的总能量": "Total energy to user",
    "到电网的总能量": "Total energy to grid",
    "功率因数": "Power factor",
    "单相防逆流控制使能": "Single-phase export limit control enable",
    "单簇下模块数量": "Number of modules in one cluster",
    "国家/区域编号": "Country/region code",
    "失效功率百分比": "Fail-safe power percentage",
    "失效时间": "Fail-safe time",
    "工作优先级": "Work priority",
    "市电充电最大功率限值": "Maximum grid charging power limit",
    "市电充电最大功率限值Ⅱ": "Maximum grid charging power limit II",
    "并离网自动切换使能": "Grid/off-grid auto-switch enable",
    "并离网设置": "Grid/off-grid setting",
    "并网放电截止SOC": "On-grid discharge cut-off SOC",
    "开关机命令": "Power on/off command",
    "当天到用户的能量": "Daily energy to user",
    "当天到电网的能量": "Daily energy to grid",
    "控制权限": "Control permission",
    "控制芯片软件代号": "Control chip software code",
    "控制芯片版本号": "Control chip version",
    "控制芯片版本号1": "Control chip version 1",
    "控制芯片版本号2": "Control chip version 2",
    "控制芯片版本号3": "Control chip version 3",
    "控制芯片1软件代号": "Control chip 1 software code",
    "控制芯片1版本号": "Control chip 1 version",
    "控制芯片2软件代号": "Control chip 2 software code",
    "控制芯片2版本号": "Control chip 2 version",
    "故障主码": "Fault main code",
    "故障子码": "Fault sub-code",
    "无功功率": "Reactive power",
    "无功功率模式": "Reactive power mode",
    "无功功率百分比": "Reactive power percentage",
    "时间段优先级": "Time-period priority",
    "最大无功功率（Qmax吸收电网）": "Maximum reactive power (Qmax absorbed from grid)",
    "最大无功功率（Qmax馈入电网）": "Maximum reactive power (Qmax fed into grid)",
    "最大有功功率(Pmax)": "Maximum active power (Pmax)",
    "最大视在功率(Smax)": "Maximum apparent power (Smax)",
    "有功功率": "Active power",
    "有功功率百分比": "Active power percentage",
    "有功功率百分比降额": "Active power percentage derating",
    "有功单相控制使能": "Active power single-phase control enable",
    "模组额定容量": "Module rated capacity",
    "模组额定电压": "Module rated voltage",
    "油机使能": "Generator enable",
    "油机充电功率": "Generator charging power",
    "油机热机时长设置": "Generator warm-up duration setting",
    "油机额定功率": "Generator rated power",
    "独立智能负载有功功率": "Independent smart load active power",
    "电池允许最大充电功率": "Battery maximum allowed charging power",
    "电池允许最大放电功率": "Battery maximum allowed discharging power",
    "电池充满容量（FCC）": "Battery full charge capacity (FCC)",
    "电池充电截止电压": "Battery charge cut-off voltage",
    "电池唤醒功能": "Battery wake-up function",
    "电池工作状态": "Battery operating status",
    "电池放电截止电压": "Battery discharge cut-off voltage",
    "电池日充电电量": "Battery daily charged energy",
    "电池日放电电量": "Battery daily discharged energy",
    "电池最大充电电流": "Battery maximum charging current",
    "电池最大放电电流": "Battery maximum discharging current",
    "电池环境温度": "Battery ambient temperature",
    "电池电压": "Battery voltage",
    "电池电流": "Battery current",
    "电池簇索引": "Battery cluster index",
    "电池类型": "Battery type",
    "电池系统最大充电功率（预留）": "Battery system maximum charging power (reserved)",
    "电池系统最大放电功率（预留）": "Battery system maximum discharging power (reserved)",
    "电池累计充电量": "Battery accumulated charged energy",
    "电池累计放电量": "Battery accumulated discharged energy",
    "电网BC线电压": "Grid line BC voltage",
    "电网B相电流": "Grid phase B current",
    "电网CA线电压": "Grid line CA voltage",
    "电网C相电流": "Grid phase C current",
    "电网电压/电网AB 线电压": "Grid voltage / grid line AB voltage",
    "电网电流/电网A 相电流": "Grid current / grid phase A current",
    "电网频率": "Grid frequency",
    "电表功率": "Meter power",
    "监控芯片软件代号": "Monitoring chip software code",
    "监控芯片版本号": "Monitoring chip version",
    "监控芯片1软件版本名称": "Monitoring chip 1 software version name",
    "监控芯片1芯片版本号": "Monitoring chip 1 chip version",
    "监控芯片2软件代号": "Monitoring chip 2 software code",
    "监控芯片2版本号": "Monitoring chip 2 version",
    "离网下油机停止 SOC": "Generator stop SOC in off-grid mode",
    "离网下油机启动 SOC": "Generator start SOC in off-grid mode",
    "离网放电截止SOC": "Off-grid discharge cut-off SOC",
    "第三方逆变器输出有功功率": "Third-party inverter output active power",
    "簇总数量": "Total number of clusters",
    "系统时间": "System time",
    "设备机型（DTC）": "Device model (DTC)",
    "设置时间段清零使能（4）": "Time-period clearing enable (4)",
    "详见《古瑞瓦特逆变器VPP通信协议之安规参数》": "See Growatt Inverter VPP Communication Protocol - Safety Parameters",
    "负载优先放电截止 SOC（1）": "Load-priority discharge cut-off SOC (1)",
    "超逆流使能": "Excess export enable",
    "远程充放电功率": "Remote charge/discharge power",
    "远程功率控制使能": "Remote power control enable",
    "远程功率控制充电时长": "Remote power-control charging duration",
    "逆变器工作状态": "Inverter operating status",
    "逆变器温度": "Inverter temperature",
    "通信地址": "Communication address",
    "通信失效功能使能": "Communication-loss function enable",
    "通信波特率": "Communication baud rate",
    "防逆流使能": "Export limit enable",
    "防逆流保护模式（2）": "Export limit protection mode (2)",
    "防逆流功率百分比": "Export limit power percentage",
    "防逆流馈电功率变化速率": "Export-limit feed-in power change rate",
    "需量管理使能": "Demand management enable",
    "需量管理逆流功率限值": "Demand management reverse power limit",
    "需量管理顺流功率限值": "Demand management forward power limit",
    "预留": "Reserved",
    "额定功率(Pn)": "Rated power (Pn)",
}

NOTE_EXACT_TRANSLATIONS = {
    "见表3-1": "See Table 3-1",
    "见附表3-3": "See Appendix Table 3-3",
    "见附表3-4": "See Appendix Table 3-4",
    "见附录表3-5": "See Appendix Table 3-5",
    "见附录表3-6": "See Appendix Table 3-6",
    "保留": "Reserved",
    "参考前一簇电池信息定义": "Refer to the previous battery cluster information definition",
    "逆变器版本信息": "Inverter version information",
    "保留\nVPP协议版本信息": "Reserved\nVPP protocol version information",
    "前两位，例：ZO": "First two characters, for example: ZO",
    "后两位，例：AA": "Last two characters, for example: AA",
    "例：02": "Example: 02",
    "正值：充电\n负值：放电": "Positive value: charging\nNegative value: discharging",
    "正：充电\n负：放电": "Positive: charging\nNegative: discharging",
    "正值：向电网馈电\n负值：从电网取电": "Positive value: feed power to the grid\nNegative value: draw power from the grid",
    "正：从电网取电\n负：向电网馈电": "Positive: draw power from the grid\nNegative: feed power to the grid",
    "正值：容性\n负值：感性": "Positive value: capacitive\nNegative value: inductive",
    "GEN口可接入第\n三方逆变器、智能\n负载或油机": "GEN port can connect to a third-party inverter, smart load, or generator",
    "仅DTC为\n21304~21305、\n21308~21309的机\n型使用": "Only for models whose DTC is 21304~21305 or 21308~21309",
    "当输出方式为\nL/N， 电压电流分\n别取电网电压和\n电网电流": "When the output mode is L/N, voltage and current use grid voltage and grid current respectively",
    "机型 EPS离网电压\n0：230V\n1：208V\n2：240V\n3：220V\n4：127V\n5：277V\n6：254V": "Model EPS off-grid voltage\n0: 230V\n1: 208V\n2: 240V\n3: 220V\n4: 127V\n5: 277V\n6: 254V",
    "设1给电池下发一\n次唤醒指令": "Set to 1 to send one wake-up command to the battery",
    "预留为无功曲线": "Reserved for reactive power curve",
    "预留为电池剩余\n容量（RM）": "Reserved for battery remaining capacity (RM)",
    "预留为电池最高\n温度": "Reserved for battery maximum temperature",
    "200表示V2.00，201\n表示V2.01，200及\n以后的版本支持安\n规参数协议": "200 means V2.00, 201 means V2.01. Versions 200 and later support the safety-parameter protocol.",
    "限功率百分比：[0，\n100]\n默认值：100": "Power limit percentage: [0, 100]\nDefault: 100",
    "限功率百分比：[0，\n100]\n默认值：100\n该寄存器和有功功\n率百分比降额\n(30151)取较小者作\n为实际有功限制值\n不存储": "Power limit percentage: [0, 100]\nDefault: 100\nThis register and active power percentage derating (30151) use the smaller value as the actual active power limit.\nNot stored",
    "默认值：0\n各机型范围见备注\n（3）": "Default: 0\nFor each model range, see note (3)",
    "0： PF=1\n1： PF 值设置\n4： 容性无功功率百\n分比（-）\n5： 感性无功功率百\n分比（+）\n默认值：0\n设置逻辑见附录3.6": "0: PF=1\n1: PF value setting\n4: Capacitive reactive power percentage (-)\n5: Inductive reactive power percentage (+)\nDefault: 0\nSetting logic: see Appendix 3.6",
    "[0，2000]∪[18000，\n20000]\n默认值：20000\n实际功率因数PF=\n（寄存器值 -\n10000）*0.0001": "[0, 2000] U [18000, 20000]\nDefault: 20000\nActual power factor PF = (register value - 10000) * 0.0001",
    "0：不使能防逆流\n1: 使能电表1防逆\n流\n2：预留\n3: 使能(外部)CT防\n逆流\n4: 使能(内部)CT防\n逆流\n默认值：0\n3-4仅部分机型使\n用，具体区分见备注\n（7）\n逻辑见附录3.3.2": "0: Export limit disabled\n1: Enable meter 1 export limit\n2: Reserved\n3: Enable external CT export limit\n4: Enable internal CT export limit\nDefault: 0\n3-4 are used only by some models. For specific distinction, see note (7).\nLogic: see Appendix 3.3.2",
    "[-100，100]\n默认值：0\n正值：逆流控制\n负值：顺流控制": "[-100, 100]\nDefault: 0\nPositive value: reverse power control\nNegative value: forward power control",
    "[0，100]\n默认值：0\n30202-30203防逆流\n失效和通信失效共\n用": "[0, 100]\nDefault: 0\n30202-30203 are shared by export-limit failure and communication failure",
    "0：不使能\n1：485通信失效使\n能\n2：USB通讯失效使\n能\n3：485和USB任一\n通讯失效就失效的\n使能\n4：485和USB都通\n讯失效才失效的使\n能\n默认值：0\n控制逻辑见附录\n3.3.2": "0: Disabled\n1: 485 communication-loss enable\n2: USB communication-loss enable\n3: Enable failure when either 485 or USB communication is lost\n4: Enable failure only when both 485 and USB communication are lost\nDefault: 0\nControl logic: see Appendix 3.3.2",
    "0：默认模式\n1：软硬件联合控制\n模式\n2：软件控制模式\n3：硬件控制模式\n默认值：0\n仅户用并网光储机、\n户用并网光伏机使\n用\n使用安规范围见备\n注（8）": "0: Default mode\n1: Software/hardware joint control mode\n2: Software control mode\n3: Hardware control mode\nDefault: 0\nOnly for residential on-grid PV-storage models and residential on-grid PV models.\nFor safety range, see note (8)",
    "手动模式下修改并\n离网及油机模式\n0：并网\n1：离网\n2：油机\n默认值：0\n30209为1时才能设\n置": "Modify grid/off-grid and generator mode in manual mode\n0: On-grid\n1: Off-grid\n2: Generator\nDefault: 0\nCan be set only when 30209 is 1",
    "[0，额定功率/3]\n默认值：额定功率/3": "[0, rated power / 3]\nDefault: rated power / 3",
    "[0，65535]\nAC充电使能开启时\n有效\n默认不限制（65535）\n超出额定功率时不\n限制": "[0, 65535]\nValid when AC charge enable is on\nDefault: unlimited (65535)\nNo limit when exceeding rated power",
    "[0，65535]\nAC充电使能开启时\n有效，和30215取较\n小控制\n默认不限制（65535）\n超出额定功率时不\n限制\n不存储": "[0, 65535]\nValid when AC charge enable is on; controlled by the smaller value together with 30215\nDefault: unlimited (65535)\nNo limit when exceeding rated power\nNot stored",
    "[0，10000]\n默认值：逆变器额定\n功率": "[0, 10000]\nDefault: inverter rated power",
    "[0，3]\n设置该寄存器为x，\n则读写的[30400，\n30406]、[30474，\n30475]及[30496，\n30499]信息属于第x\n簇电池\n默认值：0，表示当\n前电池信息适用于\n所有电池簇": "[0, 3]\nSet this register to x. Then the read/write information in [30400, 30406], [30474, 30475], and [30496, 30499] belongs to battery cluster x.\nDefault: 0, meaning the current battery information applies to all battery clusters",
    "[0，65535]\n默认值：不限制\n（65535），超出额\n定功率时不限制": "[0, 65535]\nDefault: unlimited (65535); no limit when exceeding rated power",
    "[0，65535]\n默认值：不限制\n(65535)，超出额定\n功率时不限制": "[0, 65535]\nDefault: unlimited (65535); no limit when exceeding rated power",
    "第1~20段时间段的\n电池充放电优先级\n模式\n0：负载优先\n1/2：根据时间段正\n负值判断电池/电网\n优先\n3：纯光伏储能\n4：闲置充电模式\n5：预留\n6：闲置模式\n7：预留\n默认值：1": "Battery charge/discharge priority mode for time periods 1~20\n0: Load priority\n1/2: Determine battery/grid priority according to the sign of the time-period value\n3: Pure PV storage\n4: Idle charging mode\n5: Reserved\n6: Idle mode\n7: Reserved\nDefault: 1",
    "0：不限时间\n1~1440min：按照设\n定时间控制功率时\n长\n默认值：0\n不存储": "0: No time limit\n1~1440 min: Control power duration according to the set time\nDefault: 0\nNot stored",
    "0：不使能\n1：使能AC充电，\n优先采用PV充电，\n其次采用AC充电\n2：使能AC充电，\n仅AC充电\n商用储能逆变器默\n认值为1，其他机型\n默认值为0": "0: Disabled\n1: Enable AC charging; PV charging is used first, then AC charging\n2: Enable AC charging; AC charging only\nDefault is 1 for commercial storage inverters; default is 0 for other models",
    "30412~30471为时\n间段设置，默认值均\n为0\n见附表3-2": "30412~30471 are time-period settings, and their default values are all 0\nSee Appendix Table 3-2",
    "用于分时段充放电\n模式下，时间段以外\n的模式设置\n0：负载优先\n1：电池优先\n2：电网优先\n默认值：0": "Used to set the mode outside configured time periods in time-of-use charge/discharge mode\n0: Load priority\n1: Battery priority\n2: Grid priority\nDefault: 0",
    "[0，1]\n默认值：0\n使能后在后续设置\n时间段数（30411）\n时，会将原有时间段\n信息（30380~30399、\n30412-30471）全部\n自动清零并保存": "[0, 1]\nDefault: 0\nAfter enabled, when the number of time periods (30411) is set later, the original time-period information (30380~30399, 30412~30471) will be automatically cleared and saved",
    "铅酸电池使用\n[0，15000]\n按照电压等级区分\n默认值：\n电压等级127V：\n6500；\n227V：10000；\n其余电压等级默认\n值：8000\n仅商用储能逆变器\n使用": "For lead-acid batteries\n[0, 15000]\nDistinguished by voltage level\nDefault:\nVoltage level 127V: 6500;\n227V: 10000;\nDefault for other voltage levels: 8000\nOnly for commercial storage inverters",
    "铅酸电池使用\n[0，15000]\n按照电压等级区分\n默认值：\n电压等级127V：\n3800；\n电压等级227V：\n7500；\n其余电压等级默认\n值：6500\n仅商用储能逆变器\n使用": "For lead-acid batteries\n[0, 15000]\nDistinguished by voltage level\nDefault:\nVoltage level 127V: 3800;\nVoltage level 227V: 7500;\nDefault for other voltage levels: 6500\nOnly for commercial storage inverters",
    "0：待机\n1：自检\n2：预留\n3：故障\n4：升级\n5：PV在线&电池\n离线&并网\n6：PV离线（或在\n线）&电池在线&\n并网\n7：PV在线&电池\n在线&离网\n8：PV离线&电池\n在线&离网\n9：旁路运行": "0: Standby\n1: Self-check\n2: Reserved\n3: Fault\n4: Upgrade\n5: PV online & battery offline & on-grid\n6: PV offline (or online) & battery online & on-grid\n7: PV online & battery online & off-grid\n8: PV offline & battery online & off-grid\n9: Bypass operation",
    "0：电池待机\n1：电池断开\n2：电池充电运行\n3：电池放电运行\n4：故障\n5：升级": "0: Battery standby\n1: Battery disconnected\n2: Battery charging operation\n3: Battery discharging operation\n4: Fault\n5: Upgrade",
}

PHRASE_REPLACEMENTS = [
    ("以MOD-XH为例", "Example for MOD-XH"),
    ("以APX5.0为例", "Example for APX5.0"),
    ("储能电池版本信息", "storage battery version information"),
    ("电表版本信息", "meter version information"),
    ("控制逻辑见附录", "Control logic: see Appendix "),
    ("设置逻辑见附录", "Setting logic: see Appendix "),
    ("逻辑见附录", "Logic: see Appendix "),
    ("见附录", "See Appendix "),
    ("见备注", "see note "),
    ("使用安规范围", "For safety range, "),
    ("采用此协议控制逆变器需要使能", "This must be enabled to control the inverter through this protocol"),
    ("商用储能逆变器默认值为1，其他机型默认值为0", "Default is 1 for commercial storage inverters; default is 0 for other models"),
    ("仅户用并网光储机、户用并网光伏机使用", "Only for residential on-grid PV-storage models and residential on-grid PV models"),
    ("仅户用储能一体机系列机型使用", "Only for residential hybrid storage inverter series models"),
    ("仅商用储能逆变器使用", "Only for commercial storage inverters"),
    ("部分机型使用", "used by some models"),
    ("具体区分", "specific distinction"),
    ("默认不限制", "Default: unlimited"),
    ("超出额定功率时不限制", "No limit when exceeding rated power"),
    ("超出额定功率时不\n限制", "No limit when exceeding rated power"),
    ("和30215取较\n小控制", "controlled by the smaller value together with 30215"),
    ("防逆流\n失效和通信失效共\n用", "shared by export-limit failure and communication failure"),
    ("该寄存器和有功功\n率百分比降额\n(30151)取较小者作\n为实际有功限制值", "this register and active power percentage derating (30151) use the smaller value as the actual active power limit"),
    ("不使能防逆流", "Export limit disabled"),
    ("使能电表1防逆\n流", "Enable meter 1 export limit"),
    ("使能(外部)CT防\n逆流", "Enable external CT export limit"),
    ("使能(内部)CT防\n逆流", "Enable internal CT export limit"),
    ("485通信失效使\n能", "485 communication-loss enable"),
    ("USB通讯失效使\n能", "USB communication-loss enable"),
    ("485和USB任一\n通讯失效就失效的\n使能", "Enable failure when either 485 or USB communication is lost"),
    ("485和USB都通\n讯失效才失效的使\n能", "Enable failure only when both 485 and USB communication are lost"),
    ("不限时间", "No time limit"),
    ("按照设\n定时间控制功率时\n长", "control power duration according to the set time"),
    ("手动模式下修改并\n离网及油机模式", "Modify grid/off-grid and generator mode in manual mode"),
    ("为1时才能设\n置", "can be set only when it is 1"),
    ("用于分时段充放电\n模式下，时间段以外\n的模式设置", "Used to set the mode outside configured time periods in time-of-use charge/discharge mode"),
    ("第1~20段时间段的\n电池充放电优先级\n模式", "Battery charge/discharge priority mode for time periods 1~20"),
    ("根据时间段正\n负值判断电池/电网\n优先", "determine battery/grid priority according to the sign of the time-period value"),
    ("闲置充电模式", "Idle charging mode"),
    ("闲置模式", "Idle mode"),
    ("纯光伏储能", "Pure PV storage"),
    ("离网盒子使能", "Off-grid box enable"),
    ("并网", "On-grid"),
    ("离网", "Off-grid"),
    ("油机", "Generator"),
    ("待机", "Standby"),
    ("自检", "Self-check"),
    ("故障", "Fault"),
    ("升级", "Upgrade"),
    ("旁路运行", "Bypass operation"),
    ("旁路模式", "Bypass mode"),
    ("开机", "Power on"),
    ("关机", "Power off"),
    ("自动", "Automatic"),
    ("手动", "Manual"),
    ("负载优先", "Load priority"),
    ("电池优先", "Battery priority"),
    ("电网优先", "Grid priority"),
    ("电池待机", "Battery standby"),
    ("电池断开", "Battery disconnected"),
    ("电池充电运行", "Battery charging operation"),
    ("电池放电运行", "Battery discharging operation"),
    ("油机不使能", "Generator disabled"),
    ("油机使能", "Generator enabled"),
    ("合相控制", "Combined-phase control"),
    ("单相控制", "Single-phase control"),
    ("铅酸电池使用", "For lead-acid batteries"),
    ("铅酸电池", "lead-acid battery"),
    ("锂电池", "lithium battery"),
    ("铅酸", "lead-acid"),
    ("按照电压等级区分", "distinguished by voltage level"),
    ("电压等级", "voltage level "),
    ("其余电压等级默认\n值", "default for other voltage levels"),
    ("其余电压等级默认值", "default for other voltage levels"),
    ("默认值", "Default"),
    ("默认模式", "Default mode"),
    ("软硬件联合控制\n模式", "software/hardware joint control mode"),
    ("软件控制模式", "software control mode"),
    ("硬件控制模式", "hardware control mode"),
    ("不使能", "Disabled"),
    ("使能", "Enabled"),
    ("预留", "Reserved"),
    ("不存储", "Not stored"),
    ("容性无功功率百\n分比", "capacitive reactive power percentage"),
    ("感性无功功率百\n分比", "inductive reactive power percentage"),
    ("功率因数", "power factor"),
    ("实际功率因数PF", "actual power factor PF"),
    ("寄存器值", "register value"),
    ("时间段设置", "time-period settings"),
    ("均为0", "are all 0"),
    ("见附表", "See Appendix Table "),
    ("前两位", "first two characters"),
    ("后两位", "last two characters"),
    ("例", "for example"),
    ("正值", "positive value"),
    ("负值", "negative value"),
    ("正", "positive"),
    ("负", "negative"),
    ("充电", "charging"),
    ("放电", "discharging"),
    ("向电网馈电", "feed power to the grid"),
    ("从电网取电", "draw power from the grid"),
    ("容性", "capacitive"),
    ("感性", "inductive"),
    ("需量管理", "Demand management"),
    ("逆流功率限值", "reverse power limit"),
    ("顺流功率限值", "forward power limit"),
]


def has_han(value: str) -> bool:
    return bool(HAN_RE.search(value or ""))


def translate_field_name(value: str) -> str:
    if value in FIELD_TRANSLATIONS:
        return FIELD_TRANSLATIONS[value]

    match = re.fullmatch(r"PV(\d+)电压", value)
    if match:
        return f"PV{match.group(1)} voltage"
    match = re.fullmatch(r"PV(\d+)电流", value)
    if match:
        return f"PV{match.group(1)} current"
    match = re.fullmatch(r"([RST])相有功功率", value)
    if match:
        return f"Phase {match.group(1)} active power"
    match = re.fullmatch(r"(\d{5}~\d{5})内容参考(\d{5}~\d{5})", value)
    if match:
        return f"{match.group(1)} content references {match.group(2)}"

    raise ValueError(f"Missing field_name translation: {value}")


def normalize_note_source(value: str) -> str:
    value = value or "-"
    value = value.replace("（", "(").replace("）", ")")
    value = value.replace("，", ", ").replace("：", ": ")
    value = value.replace("、", ", ")
    value = value.replace("～", "~")
    value = re.sub(r"(?<=[\u4e00-\u9fff])\n(?=[\u4e00-\u9fff])", "", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def cleanup_note(value: str) -> str:
    value = value.replace(" : ", ": ")
    value = value.replace(" , ", ", ")
    value = value.replace("( ", "(").replace(" )", ")")
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r" *\n *", "\n", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def translate_note(value: str) -> str:
    if not value or value == "-":
        return "-"
    if value in NOTE_EXACT_TRANSLATIONS:
        return NOTE_EXACT_TRANSLATIONS[value]

    text = normalize_note_source(value)
    for source, target in PHRASE_REPLACEMENTS:
        text = text.replace(source, target)

    text = text.replace("：", ": ").replace("，", ", ").replace("；", "; ")
    text = text.replace("（", "(").replace("）", ")")
    text = text.replace("。", ".")
    text = text.replace("∪", " U ")
    text = text.replace("，", ", ")
    text = cleanup_note(text)

    if has_han(text):
        raise ValueError(f"Missing notes translation: {value!r} -> {text!r}")
    return text


def address_sort_key(row: dict[str, Any]) -> tuple[int, str]:
    start = row.get("address_start")
    if isinstance(start, int):
        return start, str(row.get("address", ""))
    match = re.search(r"\d+", str(row.get("address", "")))
    return int(match.group(0)) if match else 0, str(row.get("address", ""))


def build_overlay(vpp_payload: dict[str, Any]) -> dict[str, Any]:
    records = []
    for profile in vpp_payload.get("register_profiles", []):
        profile_id = profile["id"]
        for row in sorted(profile.get("registers", []), key=address_sort_key):
            field_name_en = translate_field_name(row.get("field_name", ""))
            notes_en = translate_note(row.get("notes", "-"))
            for label, translated in [("field_name_en", field_name_en), ("notes_en", notes_en)]:
                if not translated:
                    raise ValueError(f"Empty {label} for {profile_id} {row.get('address')}")
                if has_han(translated):
                    raise ValueError(f"{label} still contains Chinese for {profile_id} {row.get('address')}: {translated}")
            records.append(
                {
                    "profile_id": profile_id,
                    "address": row["address"],
                    "field_name_source": row.get("field_name", ""),
                    "notes_source": row.get("notes", "-"),
                    "field_name_en": field_name_en,
                    "notes_en": notes_en,
                }
            )

    return {
        "schema_version": "1.0.0",
        "locale": "en-US",
        "source": {
            "document": "古瑞瓦特逆变器 VPP 通信协议 V2.05",
            "protocol_version": "V2.05",
            "document_date": "2026-05-29",
        },
        "records": records,
    }


def main() -> None:
    payload = json.loads(DEFAULT_VPP_JSON.read_text(encoding="utf-8"))
    overlay = build_overlay(payload)
    DEFAULT_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    DEFAULT_OUTPUT.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(overlay['records'])} register translations -> {DEFAULT_OUTPUT}")


if __name__ == "__main__":
    main()
