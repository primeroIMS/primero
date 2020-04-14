import { fromJS } from "immutable";

import { selectUseIdentityProvider } from "./selectors";

const stateWithProviders = fromJS({
  idp: {
    use_identity_provider: true
  }
});

describe("<Login /> - Selectors", () => {
  describe("selectUseIdentityProvider", () => {
    it("should return identity providers", () => {
      const useProviders = selectUseIdentityProvider(stateWithProviders);

      expect(useProviders).to.equal(true);
    });
  });
});
