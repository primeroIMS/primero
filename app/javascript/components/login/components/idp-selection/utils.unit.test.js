import { setMsalConfig, getLoginRequest, getTokenRequest } from "./utils";

describe("auth-utils", () => {
  let idp;

  beforeAll(() => {
    idp = {
      name: "UNICEF",
      unique_id: "unicef",
      provider_type: "b2c",
      client_id: "123",
      authorization_url: "authorization",
      identity_scope: ["123"],
      verification_url: "verification",
      domain_hint: "unicef",
      redirect_uri: "http://localhost/v2/login/b2c"
    };
  });

  it("returns provider details", () => {
    const expected = {
      auth: {
        clientId: "123",
        authority: "authorization",
        validateAuthority: false,
        knownAuthorities: ["unicefpartners.b2clogin.com"],
        redirectUri: "http://localhost/v2/login/b2c"
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
      }
    };

    expect(setMsalConfig(idp)).toEqual(expected);
  });

  it("returns login request", () => {
    const expected = {
      scopes: ["123"],
      extraQueryParameters: { domain_hint: "domain" },
      prompt: "select_account"
    };

    expect(getLoginRequest({ identity_scope: ["123"], domain_hint: "domain" })).toEqual(expected);
  });

  it("does not return prompt when skip_oidc_prompt is true", () => {
    const expected = {
      scopes: ["123"],
      extraQueryParameters: { domain_hint: "domain" }
    };

    expect(getLoginRequest({ identity_scope: ["123"], domain_hint: "domain", skip_oidc_prompt: true })).toEqual(
      expected
    );
  });

  it("does not return prompt when oidc_prompt is provided", () => {
    const expected = {
      scopes: ["123"],
      extraQueryParameters: { domain_hint: "domain" },
      prompt: "none"
    };

    expect(getLoginRequest({ identity_scope: ["123"], domain_hint: "domain", oidc_prompt: "none" })).toEqual(expected);
  });

  it("returns token request", () => {
    const expected = {
      scopes: ["123"]
    };

    expect(getTokenRequest(["123"])).toEqual(expected);
  });
});
