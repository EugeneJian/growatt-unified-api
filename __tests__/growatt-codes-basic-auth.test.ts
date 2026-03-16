import {
  parseBasicAuthorizationHeader,
  requireGrowattCodesBasicAuth,
  type PagesFunctionContext,
} from "../functions/_lib/basic-auth";

function createContext(options?: {
  authHeader?: string | null;
  password?: string;
}) {
  let nextCallCount = 0;
  const context: PagesFunctionContext<{
    GROWATT_CODES_BASIC_AUTH_PASSWORD?: string;
  }> = {
    request: new Request("https://example.com/growatt-openapi/growatt-codes", {
      headers: options?.authHeader ? { Authorization: options.authHeader } : {},
    }),
    env: {
      GROWATT_CODES_BASIC_AUTH_PASSWORD: options?.password,
    },
    next: async () => {
      nextCallCount += 1;
      return new Response("ok", {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=3600",
        },
      });
    },
  };

  return { context, getNextCallCount: () => nextCallCount };
}

describe("growatt codes basic auth", () => {
  it("parses valid basic auth headers", () => {
    expect(
      parseBasicAuthorizationHeader("Basic dXNlcjpwYXNz"),
    ).toEqual({ username: "user", password: "pass" });
  });

  it("rejects invalid basic auth headers", () => {
    expect(parseBasicAuthorizationHeader("Bearer token")).toBeNull();
    expect(parseBasicAuthorizationHeader("Basic !!!")).toBeNull();
    expect(parseBasicAuthorizationHeader(null)).toBeNull();
  });

  it("returns 503 when auth variables are missing", async () => {
    const { context, getNextCallCount } = createContext();
    const response = await requireGrowattCodesBasicAuth(context);

    expect(response.status).toBe(503);
    expect(getNextCallCount()).toBe(0);
  });

  it("returns 401 when credentials are missing or wrong", async () => {
    const missing = createContext({
      password: "secret",
    });
    const wrong = createContext({
      authHeader: "Basic Z3Jvd2F0dDp3cm9uZw==",
      password: "secret",
    });

    await expect(requireGrowattCodesBasicAuth(missing.context)).resolves.toMatchObject({
      status: 401,
    });
    await expect(requireGrowattCodesBasicAuth(wrong.context)).resolves.toMatchObject({
      status: 401,
    });
    expect(missing.getNextCallCount()).toBe(0);
    expect(wrong.getNextCallCount()).toBe(0);
  });

  it("allows valid credentials and rewrites cache headers to no-store", async () => {
    const { context, getNextCallCount } = createContext({
      authHeader: "Basic Z3Jvd2F0dDpzZWNyZXQ=",
      password: "secret",
    });

    const response = await requireGrowattCodesBasicAuth(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await response.text()).toBe("ok");
    expect(getNextCallCount()).toBe(1);
  });

  it("accepts any username when the password matches", async () => {
    const { context, getNextCallCount } = createContext({
      authHeader: "Basic YW55dGhpbmc6c2VjcmV0",
      password: "secret",
    });

    const response = await requireGrowattCodesBasicAuth(context);

    expect(response.status).toBe(200);
    expect(getNextCallCount()).toBe(1);
  });
});
