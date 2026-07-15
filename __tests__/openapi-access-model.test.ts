import routes from "../public/_routes.json";

describe("OpenAPI access model", () => {
  it("keeps Growatt Codes public", () => {
    expect(routes.include).not.toContain("/growatt-openapi/growatt-codes*");
  });

  it("routes only Zero Trust content through Pages Functions", () => {
    expect(routes.include).toEqual([
      "/growatt-openapi/protocol-mapping*",
      "/protocol-mapping*",
      "/shinetools*",
    ]);
  });
});
