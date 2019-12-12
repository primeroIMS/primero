import { expect } from "chai";
import { fromJS } from "immutable";

import { reducers } from "./reducers";

describe("<Login /> - Reducers", () => {
  const defaultState = fromJS({});

  it("should handle LOGIN", () => {
    const expected = fromJS({
      default_locale: "en",
      locales: ["en", "fr"],
      agency_icons: [],
      branding: "primero",
      use_identity_provider: true,
      identity_providers: [
        {name: "unicef"},
        {name: "primero"}
      ]
    });

    const action = {
      type: "idp/LOGIN",
      payload: {
        default_locale: "en",
        locales: ["en", "fr"],
        agency_icons: [],
        branding: "primero",
        use_identity_provider: true,
        identity_providers: [
          {name: "unicef"},
          {name: "primero"}
        ]
      }
    };
    const newState = reducers.idp(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
