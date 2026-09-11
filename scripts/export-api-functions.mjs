import XLSX from 'xlsx';

// 一、认证授权类
const authSheet = [
  ['API 接口', '功能说明', '主要参数/返回值'],
  ['/oauth2/token', '获取访问令牌', '支持 authorization_code 和 client_credentials 两种模式'],
  ['/oauth2/refresh', '刷新访问令牌', '使用 refresh_token 更新 access_token'],
  ['/oauth2/getDeviceList', '获取可授权设备列表', '返回用户账号下所有可授权的设备'],
  ['/oauth2/bindDevice', '授权设备', '将设备授权给第三方平台（支持批量）'],
  ['/oauth2/getDeviceListAuthed', '获取已授权设备列表', '返回已授权给当前平台的设备列表'],
  ['/oauth2/unbindDevice', '解除设备授权', '取消设备授权（支持批量）']
];

// 二、设备信息查询类
const deviceInfoSheet = [
  ['API 接口', '功能说明', '信息分类', '可读取的字段'],
  ['/oauth2/getDeviceInfo', '查询设备静态信息', '设备信息', 'deviceSn, model, deviceTypeName, nominalPower, dtc, communicationVersion, unifiedAPIver, deviceVersion'],
  ['', '', '采集器信息', 'datalogSn, datalogDeviceTypeName, datalogVersion'],
  ['', '', '电池信息', 'existBattery, batterySn, batteryModel, batteryCapacity, batteryNominalPower, batteryList, dischargeCutOffSOC, backupCutOffSOC'],
  ['', '', '电站信息', 'systemId, siteName, latitude, longitude, timezone'],
  ['', '', '授权状态', 'authFlag']
];

// 三、设备数据查询类
const deviceDataSheet = [
  ['API 接口', '功能说明', '数据分类', '可读取的字段'],
  ['/oauth2/getDeviceData', '查询设备实时遥测数据', '基础信息', 'deviceSn（设备序列号）, utcTime（UTC时间戳）'],
  ['', '', '电网参数', 'fac（频率）, vac1/vac2/vac3（电压）, reactivePower（无功功率）'],
  ['', '', '功率数据', 'pac（交流输出功率）, batPower（电池功率）, meterPower（电表功率）, pexPower（外部发电功率）, genPower（发电机功率）, ppv（PV功率）, payLoadPower（负载功率）, backupPower（备用输出功率）'],
  ['', '', '电池参数', 'soc（系统级荷电状态）, maxChargePower（最大充电功率）, maxDischargePower（最大放电功率）, batteryStatus（电池状态）'],
  ['', '', '能量数据', 'etoUserToday/Total（取电量）, etoGridToday/Total（馈电量）, epvToday/Total（PV发电量）'],
  ['', '', '状态信息', 'status（运行状态）, priority（工作优先级）, faultCode/SubCode（故障码）, protectCode/SubCode（保护码）'],
  ['', '', '电池列表详细', '每个电池的 index, soc, chargePower, dischargePower, vbat, ibat, soh, status, echargeToday/Total, edischargeToday/Total']
];

// 四、设备数据推送类
const pushSheet = [
  ['API 接口', '功能说明', '推送内容'],
  ['Webhook 推送', '向第三方平台主动推送设备数据', '推送内容与 /oauth2/getDeviceData 返回的数据结构一致（dataType: "dfcData"）']
];

// 五、设备调度控制类
const dispatchSheet = [
  ['API 接口', '功能说明', '支持的指令类型'],
  ['/oauth2/deviceDispatch', '下发控制指令', '见"调度指令详细"工作表'],
  ['/oauth2/readDeviceDispatch', '回读调度参数', '读取所有 setType 对应的当前设置值']
];

// 六、调度指令详细分类
const setTypeSheet = [
  ['setType', '指令名称', '控制内容', 'value 结构', '说明'],
  ['time_slot_charge_discharge', '分时段充放电', '设置多个时间段的充放电计划', '数组：[{percentage, startTime, endTime}]', 'percentage 范围 [-100,100]，正值充电、负值放电；最多16个时段'],
  ['duration_and_power_charge_discharge', '按时长与功率充放电', '设置充放电时长、功率和模式', '对象：{duration, percentage, type}', '需拆解 type 参数（见"充放电指令类型"工作表）'],
  ['export_limit', '防逆流控制', '控制逆流/顺流限制', '对象：{exportLimitEnabled, percentage}', 'percentage 范围 [-100,100]，正值逆流限制、负值顺流控制'],
  ['enable_control', 'VPP 控制开关', '启用/关闭 VPP 控制', '数值：1 或 0', '1=开启，0=关闭'],
  ['active_power_derating_percentage', '有功功率降额', '设置有功功率降额百分比', '数值：[0,100]', '例如 50 表示降额到 50%'],
  ['active_power_percentage', '有功功率百分比', '设置有功功率输出百分比', '数值：[0,100]', '例如 60 表示输出 60%'],
  ['remote_charge_discharge_power', '远程充放电功率', '设置远程充放电功率', '数值：[-100,100]', '正值充电、负值放电']
];

// 七、时长功率充放电指令类型
const typeSheet = [
  ['type 值', '指令名称', '功能说明', '功率控制特点'],
  ['selfConsumptionCommand', '自发自用模式', '光伏优先供负载，余量充电；不足时电池放电或从电网取电', '系统自动控制最大功率，percentage 参数无效'],
  ['chargeOnlySelfConsumptionCommand', '只充不放自发自用', '光伏充足时充电，光伏不足时电池不充不放，负载从市电取电', '系统自动控制最大功率，percentage 参数无效'],
  ['chargeCommand', '强制充电', '从可用电源（光伏和/或市电）以指定功率充电', '遵循 percentage 设定'],
  ['dischargeCommand', '强制放电', '以指定功率放电，供给负载或向电网输出', '遵循 percentage 设定']
];

// 八、频率限制说明
const rateLimitSheet = [
  ['接口类型', 'API 路径', '频率限制', '说明'],
  ['设备调度下发', '/oauth2/deviceDispatch', '1 request / 5 sec / device', '每个设备每5秒最多1次请求（12 RPM）'],
  ['读取调度参数', '/oauth2/readDeviceDispatch', '1 request / 5 sec / device', '每个设备每5秒最多1次请求（12 RPM）'],
  ['设备数据查询', '/oauth2/getDeviceData', '1 request / min / device', '每个设备每分钟最多1次请求']
];

// 创建工作簿
const wb = XLSX.utils.book_new();

// 添加工作表
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(authSheet), '1-认证授权');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(deviceInfoSheet), '2-设备信息查询');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(deviceDataSheet), '3-设备数据查询');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pushSheet), '4-设备数据推送');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dispatchSheet), '5-设备调度控制');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(setTypeSheet), '6-调度指令详细');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(typeSheet), '7-充放电指令类型');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rateLimitSheet), '8-频率限制');

// 输出文件 - 添加时间戳避免文件占用
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputPath = `Growatt_OpenAPI_功能清单_完整版_${timestamp}.xlsx`;
XLSX.writeFile(wb, outputPath);

console.log(`✅ Excel 文件已生成：${outputPath}`);
