import { fromJS } from "immutable";

import getLookupValue from "./get-lookup-value";

describe("<InsightsSubReport />/utils/getLookupValue", () => {
  const translateId = value => `return.sample.${value}`;

  const lookups = {
    reporting_location: [
      {
        id: "MC",
        display_text: "MyCountry"
      },
      {
        id: "MCMP1",
        display_text: "MyProvince1"
      },
      {
        id: "MCMP2",
        display_text: "MyProvince2"
      },
      {
        id: "MCMP1MD1",
        display_text: "MyDistrict1"
      },
      {
        id: "MCMP2MD2",
        display_text: "MyDistrict2"
      }
    ],
    reporting_location_detention: [
      {
        id: "MC",
        display_text: "MyCountry"
      },
      {
        id: "MCMP1",
        display_text: "MyProvince1"
      },
      {
        id: "MCMP2",
        display_text: "MyProvince2"
      },
      {
        id: "MCMP1MD1",
        display_text: "MyDistrict1"
      },
      {
        id: "MCMP2MD2",
        display_text: "MyDistrict2"
      }
    ],
    lookup_sample: [
      {
        id: "lookup_sample_1",
        display_text: "Lookup Sample 1"
      },
      {
        id: "lookup_sample_2",
        display_text: "Lookup Sample 2"
      }
    ]
  };

  context("when is lookup", () => {
    it("returns value translated", () => {
      const value = fromJS({ id: "lookup_sample_1", boys: 1, total: 2, unknown: 1 });
      const result = getLookupValue(lookups, {}, translateId, "lookup_sample", value);

      expect(result).to.equal("Lookup Sample 1");
    });
  });

  context("when is reporting_location", () => {
    it("returns Location translated", () => {
      const value = fromJS({ id: "MCMP1MD1", boys: 1, total: 2, unknown: 1 });
      const columns = getLookupValue(lookups, {}, translateId, "reporting_location", value);

      expect(columns).to.equal("MyDistrict1");
    });
  });

  context("when is reporting_location_detention", () => {
    it("returns Location translated", () => {
      const value = fromJS({ id: "MCMP2MD2", boys: 1, total: 2, unknown: 1 });
      const columns = getLookupValue(lookups, {}, translateId, "reporting_location_detention", value);

      expect(columns).to.equal("MyDistrict2");
    });
  });

  context("when there is NO lookup", () => {
    it("returns value translated", () => {
      const value = fromJS({ id: "test", total: 2 });
      const result = getLookupValue({}, {}, translateId, "random_lookup", value);

      expect(result).to.equal("return.sample.test");
    });
  });
});
