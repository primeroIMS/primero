import { fromJS } from "immutable";

import { getIdentityProviders } from "./selectors";

const stateWithNoRecords = fromJS({});
const stateWithProviders = fromJS({
  user: {
    modules: ["primeromodule-cp", "primeromodule-gbv"],
    agency: "unicef",
    isAuthenticated: true,
    messages: null
  },
  idp: {
    use_identity_provider: true,
    identity_providers: [
      {
        name: "unicef",
        type: "b2c",
        domain_hint: "unicef",
        authority: "authority",
        client_id: "clientid",
        scope: ["scope"],
        redirect_uri: "redirect"
      },
      {
        name: "primero",
        type: "b2c",
        domain_hint: "primero",
        authority: "authority",
        client_id: "clientid",
        scope: ["scope"],
        redirect_uri: "redirect"
      }
    ]
  }
});

describe("<LoginSelection /> - Selectors", () => {
  describe("getIdentityProviders", () => {
    it("should return identity providers", () => {
      const providers = getIdentityProviders(stateWithProviders);
      const expected = fromJS([
        {
          name: "unicef",
          type: "b2c",
          domain_hint: "unicef",
          authority: "authority",
          client_id: "clientid",
          scope: ["scope"],
          redirect_uri: "redirect"
        },
        {
          name: "primero",
          type: "b2c",
          domain_hint: "primero",
          authority: "authority",
          client_id: "clientid",
          scope: ["scope"],
          redirect_uri: "redirect"
        }
      ]);

      expect(providers).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const providers = getIdentityProviders(stateWithNoRecords);

      expect(providers).to.be.undefined;
    });
  });
});
