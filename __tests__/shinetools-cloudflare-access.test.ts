import {
  requireShineToolsCloudflareAccess,
  type ShineToolsCloudflareAccessEnv,
} from "../functions/_lib/shinetools-access";
import type { PagesFunctionContext } from "../functions/_lib/cloudflare-access";

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

  const context: PagesFunctionContext<ShineToolsCloudflareAccessEnv> = {
    request: new Request(
      options?.url ?? "https://example.com/shinetools/quick-site-setup",
      { headers },
    ),
    env: {
      SHINETOOLS_ALLOW_UNPROTECTED: options?.allowUnprotected,
    },
    next: async () => {
      nextCallCount += 1;
      return new Response("ok", {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    },
  };

  return { context, getNextCallCount: () => nextCallCount };
}

describe("ShineTools Cloudflare Access guard", () => {
  it("fails closed when Cloudflare Access has not authenticated the request", async () => {
    const { context, getNextCallCount } = createContext();

    const response = await requireShineToolsCloudflareAccess(context);

    expect(response.status).toBe(403);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
    expect(await response.text()).toContain("requires Cloudflare Access");
    expect(getNextCallCount()).toBe(0);
  });

  it("allows requests carrying a Cloudflare Access JWT", async () => {
    const { context, getNextCallCount } = createContext({
      accessJwt: "access.jwt",
    });

    const response = await requireShineToolsCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, noarchive",
    );
    expect(getNextCallCount()).toBe(1);
  });

  it("protects nested source-audit pages with the same guard", async () => {
    const { context, getNextCallCount } = createContext({
      accessJwt: "access.jwt",
      url: "https://example.com/shinetools/source-market-mod-xh",
    });

    const response = await requireShineToolsCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(getNextCallCount()).toBe(1);
  });

  it("allows an explicit controlled-environment bypass", async () => {
    const { context, getNextCallCount } = createContext({
      allowUnprotected: "true",
    });

    const response = await requireShineToolsCloudflareAccess(context);

    expect(response.status).toBe(200);
    expect(getNextCallCount()).toBe(1);
  });
});
