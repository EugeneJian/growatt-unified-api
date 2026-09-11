import "./api-endpoint-header.css";

interface ApiEndpointHeaderProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  status?: "stable" | "beta" | "deprecated";
}

const METHOD_COLORS = {
  GET: "blue",
  POST: "green",
  PUT: "orange",
  DELETE: "red",
  PATCH: "purple",
} as const;

const STATUS_LABELS = {
  stable: { zh: "生产环境", color: "green" },
  beta: { zh: "Beta", color: "orange" },
  deprecated: { zh: "即将弃用", color: "red" },
} as const;

export function ApiEndpointHeader({
  method,
  path,
  status = "stable",
}: ApiEndpointHeaderProps) {
  const methodColor = METHOD_COLORS[method];
  const statusInfo = STATUS_LABELS[status];

  return (
    <div className="api-endpoint-header">
      <div className="api-endpoint-main">
        <span className={`api-method method-${methodColor}`}>{method}</span>
        <code className="api-path">{path}</code>
      </div>
      <span className={`api-status status-${statusInfo.color}`}>
        {statusInfo.zh}
      </span>
    </div>
  );
}
