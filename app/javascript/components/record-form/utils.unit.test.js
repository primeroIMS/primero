import * as utils from "./utils";

describe("<RecordForms /> - utils", () => {
  describe("compactValues", () => {
    it("returns object of values that changed", () => {
      const initialValues = {
        name: "John",
        phone: "555-555-5555",
        sex: null,
        un_no: null,
        caregiver_name: "",
        caregiver_number: "234-323-2353",
        services: [
          {
            unique_id: "123",
            un_id: "2134"
          }
        ],
        locations: ["loc-1"],
        past_locations: ["loc-2", "loc-3"],
        test_locations: ["loc-4"],
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          },
          {
            uncle_name: "Jimmy",
            unique_id: "125",
            phone: ""
          }
        ]
      };

      const values = {
        name: "John",
        phone: "555-555-5556",
        sex: null,
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        locations: ["loc-1", "loc-2"],
        past_locations: ["loc-3"],
        future_locations: [],
        test_locations: [],
        caregiver_number: "",
        incident_details: [
          {
            cp_incident_perpetrator_national_id_no: "",
            cp_incident_perpetrator_nationality: "",
            cp_incident_perpetrator_occupation: "",
            cp_incident_perpetrator_other_id_no: ""
          }
        ],
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          },
          {
            mother_name: "James"
          },
          {
            uncle_name: "Jimmy",
            unique_id: "125",
            phone: "555-333-5534"
          }
        ]
      };

      const expected = {
        caregiver_number: "",
        phone: "555-555-5556",
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        locations: ["loc-1", "loc-2"],
        past_locations: ["loc-3"],
        relatives: [
          {
            mother_name: "James"
          },
          {
            unique_id: "125",
            phone: "555-333-5534"
          }
        ]
      };

      expect(utils.compactValues(values, initialValues)).to.deep.equal(
        expected
      );
    });
  });
});
