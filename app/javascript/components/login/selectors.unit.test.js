import { fromJS } from "immutable";

import { getUseIdentityProvider } from "./selectors";

const stateWithProviders = fromJS({
  idp: {
    use_identity_provider: true
  }
});

describe("components/login/selectors.js", () => {
  describe("getUseIdentityProvider", () => {
    it("should return identity providers", () => {
      const useProviders = getUseIdentityProvider(stateWithProviders);

      expect(useProviders).to.equal(true);
    });
  });
});
