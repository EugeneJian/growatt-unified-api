import {
  requireProtocolMappingCloudflareAccess,
  type PagesFunctionContext,
} from "../functions/_lib/cloudflare-access";

function createContext(options?: {
  accessJwt?: string | null;
  allowUnprotected?: string;
  url?: string;
}) {
  let nextCallCount = 0;
  const headers = new Headers();
  if (options?.accessJwt) {
    headers.set("Cf-Access-Jwt-Assertion", options.accessJwt);
  }

  const context: PagesFunctionContext<{
    PROTOCOL_MAPPING_ALLOW_UNPROTECTED?: string;
  }> = {
    request: new Request(
      options?.url ?? "https://example.com/protocol-mapping/register_map_visual.html",
      { headers },
    ),
    env: {
      PROTOCOL_MAPPING_ALLOW_UNPROTECTED: options?.allowUnprotected,
    },
    next: async () => {
      nextCallCount += 1;
      return new Response("ok", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      });
    },
  };

  return { context, getNextCallCount: () => nextCallCount };
}

describe("protocol mapping Cloudflare Access guard", () => {
  it("fails closed when Cloudflare Access has not authenticated the request", async () => {
    const { context, getNextCallCount } = createContext();

    const response = await requireProtocolMappingCloudflareAccess(context);

    expect(response.status).toBe(403);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(getNextCallCount()).toBe(0);
  });

  it("allows requests carrying a Cloudflare Access JWT", async () => {
    const { context, getNextCallCount } = createContext({
      accessJwt: "access.jwt",
    });

    const response = await requireProtocolMappingCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await response.text()).toBe("ok");
    expect(getNextCallCount()).toBe(1);
  });

  it("uses the same guard for the legacy OpenAPI subpath compatibility entry", async () => {
    const { context, getNextCallCount } = createContext({
      accessJwt: "access.jwt",
      url: "https://example.com/growatt-openapi/protocol-mapping/register_map_visual.html",
    });

    const response = await requireProtocolMappingCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(getNextCallCount()).toBe(1);
  });

  it("allows an explicit unprotected bypass for controlled environments", async () => {
    const { context, getNextCallCount } = createContext({
      allowUnprotected: "true",
    });

    const response = await requireProtocolMappingCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(getNextCallCount()).toBe(1);
  });
});
