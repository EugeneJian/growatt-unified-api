"use client";

import { CodeTabs } from "@/components/code-tabs";
import { ApiEndpointHeader } from "@/components/api-endpoint-header";
import "./demo.css";

export default function OptimizedApiDocDemo() {
  const codeExamples = [
    {
      language: "bash",
      label: "cURL",
      code: `curl -X POST "https://openapi.growatt.com/oauth2/getDeviceInfo" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "deviceSn": "ABC12345678"
  }'`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `const response = await fetch('https://openapi.growatt.com/oauth2/getDeviceInfo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    deviceSn: 'ABC12345678',
  }),
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: "python",
      label: "Python",
      code: `import requests

url = "https://openapi.growatt.com/oauth2/getDeviceInfo"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}
payload = {
    "deviceSn": "ABC12345678"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`,
    },
    {
      language: "java",
      label: "Java",
      code: `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://openapi.growatt.com/oauth2/getDeviceInfo"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\\"deviceSn\\":\\"ABC12345678\\"}"
    ))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
    },
  ];

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>Stripe 风格 API 文档优化 Demo</h1>
        <p>
          基于 Stripe 文档架构最佳实践，重新设计的 Growatt 设备信息查询 API 文档
        </p>
      </div>

      <div className="demo-content">
        {/* 页面标题 */}
        <section className="demo-section">
          <h1 className="api-title">获取设备信息</h1>
          <div className="api-status-badge status-stable">
            <span className="status-dot"></span>
            生产环境 | 稳定
          </div>
          <p className="api-description">
            获取已授权 Growatt 设备的详细信息，包括设备型号、电池配置、站点位置等关键数据。
          </p>
          <p className="api-use-case">
            <strong>典型场景：</strong>
            在下发控制指令前,查询设备的额定功率、在线状态和电池容量，确保指令参数在设备支持范围内。
          </p>
        </section>

        {/* 快速示例 */}
        <section className="demo-section">
          <h2 className="section-title">🚀 快速示例</h2>
          <CodeTabs
            examples={codeExamples}
            highlightPlaceholders={["YOUR_ACCESS_TOKEN", "ABC12345678"]}
          />

          <div className="response-preview">
            <h3>响应</h3>
            <pre className="response-code">{`{
  "code": 0,
  "message": "SUCCESSFUL_OPERATION",
  "data": {
    "deviceSn": "ABC12345678",
    "model": "BDCBAT",
    "nominalPower": 6000,
    "existBattery": true,
    "batteryCapacity": 5000,
    "authFlag": true,
    "siteName": "深圳示范站点"
  }
}`}</pre>
          </div>
        </section>

        {/* API 端点信息 */}
        <section className="demo-section">
          <h2 className="section-title">请求</h2>
          <ApiEndpointHeader method="POST" path="/oauth2/getDeviceInfo" status="stable" />

          <h3 className="subsection-title">Headers</h3>
          <table className="param-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>类型</th>
                <th>必填</th>
                <th>描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>Authorization</code>
                </td>
                <td>
                  <span className="type-badge">string</span>
                </td>
                <td>
                  <span className="required-badge">✅</span>
                </td>
                <td>
                  Bearer token，
                  <a href="#" className="inline-link">
                    获取方式
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <code>Content-Type</code>
                </td>
                <td>
                  <span className="type-badge">string</span>
                </td>
                <td>
                  <span className="required-badge">✅</span>
                </td>
                <td>
                  必须为 <code>application/json</code>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="subsection-title">Body 参数</h3>
          <table className="param-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>类型</th>
                <th>必填</th>
                <th>描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>deviceSn</code>
                </td>
                <td>
                  <span className="type-badge">string</span>
                </td>
                <td>
                  <span className="required-badge">✅</span>
                </td>
                <td>
                  <div>设备序列号（唯一标识）</div>
                  <div className="param-detail">
                    <strong>格式：</strong>10-20 位字母数字组合
                  </div>
                  <div className="param-detail">
                    <em>示例：</em> <code>ABC12345678</code>
                  </div>
                  <div className="param-detail">
                    <strong>如何获取：</strong>通过
                    <a href="#" className="inline-link">
                      设备授权接口
                    </a>
                    返回的设备列表
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 响应 */}
        <section className="demo-section">
          <h2 className="section-title">响应</h2>
          <h3 className="subsection-title">成功响应（200 OK）</h3>
          <pre className="response-code">{`{
  "code": 0,
  "message": "SUCCESSFUL_OPERATION",
  "data": {
    "deviceSn": "ABC12345678",
    "model": "BDCBAT",
    "nominalPower": 6000,
    "existBattery": true,
    "batterySn": "BAT001",
    "batteryCapacity": 5000,
    "authFlag": true,
    "siteName": "深圳示范站点",
    "latitude": "22.500753",
    "longitude": "113.898389"
  }
}`}</pre>

          <h3 className="subsection-title">响应字段说明</h3>
          <table className="param-table">
            <thead>
              <tr>
                <th>字段</th>
                <th>类型</th>
                <th>描述</th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-row">
                <td colSpan={3}>
                  <strong>🔧 设备基础信息</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <code>deviceSn</code>
                </td>
                <td>
                  <span className="type-badge">string</span>
                </td>
                <td>设备序列号（请求参数回显）</td>
              </tr>
              <tr>
                <td>
                  <code>model</code>
                </td>
                <td>
                  <span className="type-badge">string</span>
                </td>
                <td>设备型号</td>
              </tr>
              <tr>
                <td>
                  <code>nominalPower</code>
                </td>
                <td>
                  <span className="type-badge">integer</span>
                </td>
                <td>
                  <div>逆变器额定功率，单位：瓦特（W）</div>
                  <div className="param-detail">
                    <strong>用途：</strong>确定控制指令的功率上限
                  </div>
                </td>
              </tr>
              <tr className="section-row">
                <td colSpan={3}>
                  <strong>🔋 电池信息</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <code>existBattery</code>
                </td>
                <td>
                  <span className="type-badge">boolean</span>
                </td>
                <td>
                  <div>是否配置电池</div>
                  <div className="param-detail">
                    <strong>注意：</strong>
                    <code>false</code> 时，以下电池字段均为 <code>null</code>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <code>batteryCapacity</code>
                </td>
                <td>
                  <span className="type-badge">integer | null</span>
                </td>
                <td>
                  <div>电池额定容量，单位：瓦时（Wh）</div>
                  <div className="param-detail">
                    <strong>用途：</strong>VPP 调度时估算可用能量
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 错误响应 */}
        <section className="demo-section">
          <h2 className="section-title">错误响应</h2>
          <h3 className="subsection-title">常见错误</h3>
          <table className="param-table error-table">
            <thead>
              <tr>
                <th>HTTP 状态码</th>
                <th>code</th>
                <th>message</th>
                <th>原因与解决方案</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>401</td>
                <td>
                  <code>2</code>
                </td>
                <td>
                  <code>TOKEN_IS_INVALID</code>
                </td>
                <td>
                  Token 过期或无效，通过
                  <a href="#" className="inline-link">
                    刷新接口
                  </a>
                  获取新 token
                </td>
              </tr>
              <tr>
                <td>403</td>
                <td>
                  <code>12</code>
                </td>
                <td>
                  <code>DEVICE_SN_DOES_NOT_HAVE_PERMISSION</code>
                </td>
                <td>
                  设备未授权或授权过期，调用
                  <a href="#" className="inline-link">
                    设备授权接口
                  </a>
                  重新授权
                </td>
              </tr>
              <tr>
                <td>400</td>
                <td>
                  <code>1</code>
                </td>
                <td>
                  <code>DEVICE_SN_CAN_NOT_BE_NULL</code>
                </td>
                <td>请求参数缺失 deviceSn</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 最佳实践 */}
        <section className="demo-section">
          <h2 className="section-title">💡 最佳实践</h2>

          <div className="best-practice-block">
            <h3>✅ 推荐做法</h3>
            <ol>
              <li>
                <strong>控制前置查询</strong>
                <p>
                  在下发充放电指令前，务必调用此接口获取 <code>nominalPower</code> 和{" "}
                  <code>batteryCapacity</code>，确保指令参数在设备物理限制内。
                </p>
                <pre className="inline-code-block">{`// 示例：根据设备额定功率限制充电指令
const deviceInfo = await getDeviceInfo(deviceSn);
const maxChargePower = deviceInfo.data.nominalPower;
const chargeCommand = Math.min(requestedPower, maxChargePower);`}</pre>
              </li>
              <li>
                <strong>缓存设备信息</strong>
                <p>
                  设备静态信息（型号、容量、站点位置）变化极少，建议缓存 24
                  小时，避免频繁查询。
                </p>
              </li>
              <li>
                <strong>检查授权状态</strong>
                <p>
                  若 <code>authFlag</code> 为 <code>false</code>
                  ，立即提示用户重新授权，避免后续控制指令失败。
                </p>
              </li>
            </ol>
          </div>

          <div className="best-practice-block error-practices">
            <h3>❌ 常见错误</h3>
            <ol>
              <li>
                <strong>忽略 existBattery 字段</strong>
                <p>
                  直接使用 <code>batteryCapacity</code> 而不先判断 <code>existBattery</code>
                  ，导致无电池设备报错。
                </p>
                <div className="code-comparison">
                  <div className="code-wrong">
                    <div className="code-label">❌ 错误示例</div>
                    <pre>{`const capacity = deviceInfo.data.batteryCapacity; // 可能为 null`}</pre>
                  </div>
                  <div className="code-right">
                    <div className="code-label">✅ 正确示例</div>
                    <pre>{`const capacity = deviceInfo.data.existBattery
  ? deviceInfo.data.batteryCapacity
  : 0;`}</pre>
                  </div>
                </div>
              </li>
              <li>
                <strong>混淆 nominalPower 和 batteryNominalPower</strong>
                <ul>
                  <li>
                    <code>nominalPower</code>：逆变器额定功率（交流侧）
                  </li>
                  <li>
                    <code>batteryNominalPower</code>：电池额定功率（直流侧）
                  </li>
                  <li>
                    <strong>下发控制指令时应参考 nominalPower</strong>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        {/* 相关接口 */}
        <section className="demo-section">
          <h2 className="section-title">相关接口</h2>
          <div className="related-links">
            <a href="#" className="related-link-card">
              <div className="related-link-title">设备授权</div>
              <div className="related-link-desc">获取设备控制权限</div>
            </a>
            <a href="#" className="related-link-card">
              <div className="related-link-title">获取设备实时数据</div>
              <div className="related-link-desc">查询设备运行状态</div>
            </a>
            <a href="#" className="related-link-card">
              <div className="related-link-title">下发控制指令</div>
              <div className="related-link-desc">控制设备充放电</div>
            </a>
            <a href="#" className="related-link-card">
              <div className="related-link-title">刷新 Token</div>
              <div className="related-link-desc">更新访问令牌</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
