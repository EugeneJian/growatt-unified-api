export interface GrowattCodesBasicAuthEnv {
  GROWATT_CODES_BASIC_AUTH_PASSWORD?: string;
}

export interface PagesFunctionContext<Env> {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

export type PagesFunction<Env> = (
  context: PagesFunctionContext<Env>,
) => Response | Promise<Response>;

interface BasicCredentials {
  username: string;
  password: string;
}

const AUTH_REALM = "Growatt Codes";

function unauthorizedResponse(): Response {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${AUTH_REALM}", charset="UTF-8"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function serviceUnavailableResponse(): Response {
  return new Response("Growatt Codes protection is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

export function parseBasicAuthorizationHeader(
  headerValue: string | null,
): BasicCredentials | null {
  if (!headerValue) {
    return null;
  }

  const match = headerValue.match(/^Basic\s+(.+)$/i);
  if (!match) {
    return null;
  }

  try {
    const decoded = atob(match[1]);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export async function requireGrowattCodesBasicAuth(
  context: PagesFunctionContext<GrowattCodesBasicAuthEnv>,
): Promise<Response> {
  const expectedPassword = context.env.GROWATT_CODES_BASIC_AUTH_PASSWORD;

  if (!expectedPassword) {
    return serviceUnavailableResponse();
  }

  const credentials = parseBasicAuthorizationHeader(
    context.request.headers.get("Authorization"),
  );

  if (!credentials || credentials.password !== expectedPassword) {
    return unauthorizedResponse();
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
