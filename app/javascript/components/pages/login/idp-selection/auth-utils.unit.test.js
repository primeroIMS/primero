import { expect } from "chai";
import { fromJS } from "immutable";

import {
  setMsalConfig,
  getLoginRequest,
  getTokenRequest
} from "./auth-utils";

describe("auth-utils", () => {
  let idp;

  before(() => {
    idp = fromJS({
      name: "UNICEF",
      unique_id: "unicef",
      provider_type: "b2c",
      client_id: "123",
      authorization_url: "authorization",
      identity_scope: ["123"],
      verification_url: "verification"

    });
  });

  it("returns provider details", () => {
    const expected = {
      auth: {
        clientId: "123",
        authority: "authorization",
        validateAuthority: false,
        redirectUri: `http://${window.location.host}/v2/login/b2c`
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    };

    expect(setMsalConfig(idp)).to.deep.equal(expected);
  });

  it("returns login request", () => {
    const expected = {
      scopes: ["123"],
      extraQueryParameters: {domain_hint: "domain"}
    };

    expect(getLoginRequest(["123"], "domain")).to.deep.equal(expected);
  });

  it("returns token request", () => {
    const expected = {
      scopes: ["123"]
    };

    expect(getTokenRequest(["123"])).to.deep.equal(expected);
  });
});