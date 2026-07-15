import type {
  PagesFunctionContext,
} from "./cloudflare-access";

export interface ShineToolsCloudflareAccessEnv {
  SHINETOOLS_ALLOW_UNPROTECTED?: string;
}

const ACCESS_JWT_HEADER = "Cf-Access-Jwt-Assertion";

function isUnprotectedBypassEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

function forbiddenResponse(): Response {
  return new Response(
    "ShineTools Settings requires Cloudflare Access. Configure the shinetools-settings-docs Access application for /shinetools*.",
    {
      status: 403,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    },
  );
}

export async function requireShineToolsCloudflareAccess(
  context: PagesFunctionContext<ShineToolsCloudflareAccessEnv>,
): Promise<Response> {
  const hasAccessJwt = Boolean(context.request.headers.get(ACCESS_JWT_HEADER));
  const allowUnprotected = isUnprotectedBypassEnabled(
    context.env.SHINETOOLS_ALLOW_UNPROTECTED,
  );

  if (!hasAccessJwt && !allowUnprotected) {
    return forbiddenResponse();
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
