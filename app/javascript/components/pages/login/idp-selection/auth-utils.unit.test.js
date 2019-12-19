import { fromJS } from "immutable";

import { setMsalConfig } from "./auth-utils";

describe.only("auth-utils", () => {
  let idp;

  before(() => {
    idp = fromJS({
      name: "UNICEF",
      unique_id: "unicef",
      provider_type: "b2c",
      configuration: {
        client_id: "123",
        authorization_url: "authorization",
        identity_scope: ["123"],
        verification_url: "verification"
      }
    });
  });

  it("renders login buttons for providers", () => {
    const expected = {
      auth: {
        clientId: "123",
        authority: "authorization",
        validateAuthority: false,
        redirectUri: `${window.location.host}/v2/login/b2c`
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    };

    expect(setMsalConfig(idp)).to.deep.equal(expected);
  });
});