import { fromJS } from "immutable";

import * as helpers from "./utils";

describe("Verifying utils", () => {
  it("should have known utils", () => {
    const clonedHelpers = { ...helpers };

    ["valuesWithDisplayConditions", "fieldsToRender"].forEach(property => {
      expect(clonedHelpers).to.have.property(property);
      delete clonedHelpers[property];
    });

    expect(clonedHelpers).to.deep.equal({});
  });
});

describe("valuesWithDisplayConditions", () => {
  it("should append the agency if not present in the agencies list", () => {
    const values = [
      {
        relation: "father",
        unique_id: "948329b8-b501-47d5-9b3d-64f371e7b9bd",
        relation_name: "Brady",
        relation_is_alive: "alive",
        relation_language: [],
        relation_religion: [],
        relation_telephone: 333,
        relation_nationality: []
      },
      {
        relation: "other_family",
        unique_id: "b5981626-989c-4b29-aba9-8dca9b63a346",
        relation_name: "r willson",
        relation_language: [],
        relation_religion: [],
        relation_telephone: 333,
        relation_nationality: [],
        relation_address_current: "test current address"
      }
    ];
    const displayConditions = [
      {
        relation: ["father", "mother"]
      },
      {
        relation_is_caregiver: true
      }
    ];

    const expected = [
      {
        relation: "father",
        relation_is_alive: "alive",
        relation_language: [],
        relation_name: "Brady",
        relation_nationality: [],
        relation_religion: [],
        relation_telephone: 333,
        unique_id: "948329b8-b501-47d5-9b3d-64f371e7b9bd"
      }
    ];

    const options = helpers.valuesWithDisplayConditions(
      values,
      displayConditions
    );

    expect(options).to.deep.equal(expected);
  });
});

describe("fieldsToRender", () => {
  it("should return list of filds", () => {
    const listFields = ["relation_name", "relation"];
    const fields = [
      {
        name: "relation_name",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        display_name: {
          en: "Name"
        }
      },
      {
        name: "relation_other_field",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        display_name: {
          en: "Name"
        }
      }
    ];

    const expected = [
      {
        name: "relation_name",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        display_name: {
          en: "Name"
        }
      }
    ];
    const options = helpers.fieldsToRender(listFields, fields);

    expect(options).to.deep.equal(expected);
  });
});
