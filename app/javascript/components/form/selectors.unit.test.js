import { fromJS } from "immutable";

import { OPTION_TYPES } from "./constants";
import * as selectors from "./selectors";

describe("Forms - Selectors", () => {
  const i18n = {
    t: value => value,
    locale: "en"
  };

  const stateWithLookups = fromJS({
    forms: {
      options: {
        lookups: {
          data: [
            {
              unique_id: "lookup-1",
              name: { en: "Lookup 1" }
            },
            {
              unique_id: "lookup-2",
              name: { en: "Lookup 2" }
            }
          ]
        }
      }
    }
  });

  describe("getOptions", () => {
    it("should return all lookup types including customs", () => {
      const options = selectors.getOptions(
        stateWithLookups,
        OPTION_TYPES.LOOKUPS,
        i18n
      );

      expect(options).to.deep.equal(
        fromJS([
          {
            id: "lookup lookup-1",
            display_text: "Lookup 1"
          },
          {
            id: "lookup lookup-2",
            display_text: "Lookup 2"
          },
          {
            id: "Agency",
            display_text: "agency.label"
          },
          {
            id: "Location",
            display_text: "location.label"
          },
          {
            id: "User",
            display_text: "user.label"
          }
        ])
      );
    });
  });
});
