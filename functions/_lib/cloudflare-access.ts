export interface ProtocolMappingCloudflareAccessEnv {
  PROTOCOL_MAPPING_ALLOW_UNPROTECTED?: string;
}

export interface PagesFunctionContext<Env> {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

export type PagesFunction<Env> = (
  context: PagesFunctionContext<Env>,
) => Response | Promise<Response>;

const ACCESS_JWT_HEADER = "Cf-Access-Jwt-Assertion";

function isUnprotectedBypassEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

function forbiddenResponse(): Response {
  return new Response(
    "Growatt Protocol Mapping requires Cloudflare Access. Configure the growatt-protocol-mapping Access application for /protocol-mapping* and /growatt-openapi/protocol-mapping*.",
    {
      status: 403,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export async function requireProtocolMappingCloudflareAccess(
  context: PagesFunctionContext<ProtocolMappingCloudflareAccessEnv>,
): Promise<Response> {
  const hasAccessJwt = Boolean(context.request.headers.get(ACCESS_JWT_HEADER));
  const allowUnprotected = isUnprotectedBypassEnabled(
    context.env.PROTOCOL_MAPPING_ALLOW_UNPROTECTED,
  );

  if (!hasAccessJwt && !allowUnprotected) {
    return forbiddenResponse();
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
