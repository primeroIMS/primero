// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      extraQueryParameters: { domain_hint: "domain" }
    };

    expect(getLoginRequest(["123"], "domain")).toEqual(expected);
  });

  it("returns token request", () => {
    const expected = {
      scopes: ["123"]
    };

    expect(getTokenRequest(["123"])).toEqual(expected);
  });
});
