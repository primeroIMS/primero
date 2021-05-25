import { TRACES_SUBFORM_UNIQUE_ID } from "../../../../../config";

import * as helpers from "./utils";

describe("Verifying utils", () => {
  it("should have known utils", () => {
    const clonedHelpers = { ...helpers };

    ["isTracesSubform", "valuesWithDisplayConditions", "fieldsToRender", "valuesWithHiddenAttribute"].forEach(
      property => {
        expect(clonedHelpers).to.have.property(property);
        delete clonedHelpers[property];
      }
    );

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

    const options = helpers.valuesWithDisplayConditions(values, displayConditions);

    expect(options).to.deep.equal(expected);
  });

  it("should return empty array if values is empty no matters if displayConditions is present", () => {
    const values = [];
    const displayConditions = [
      {
        relation_is_caregiver: true
      }
    ];
    const options = helpers.valuesWithDisplayConditions(values, displayConditions);

    expect(options).to.be.empty;
  });

  it("should return values if displayConditions is not present", () => {
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
      }
    ];
    const displayConditions = [];
    const options = helpers.valuesWithDisplayConditions(values, displayConditions);

    expect(options).to.deep.equal(values);
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

describe("isTracesSubform", () => {
  it("should return true if it is the traces subform", () => {
    expect(helpers.isTracesSubform("tracing_requests", { unique_id: TRACES_SUBFORM_UNIQUE_ID })).to.be.true;
  });

  it("should return false if it is not the traces subform", () => {
    expect(helpers.isTracesSubform("tracing_requests", { unique_id: "some_form_id" })).to.be.false;
  });
});

describe("valuesWithHiddenAttribute", () => {
  it("should return values with _hidden attributes if displayConditions is present", () => {
    const values = [
      {
        relation: "father",
        unique_id: "948329b8-b501-47d5-9b3d-64f371e7b9bd",
        relation_name: "Brady",
        relation_is_alive: "alive"
      },
      {
        relation: "other_family",
        unique_id: "b5981626-989c-4b29-aba9-8dca9b63a346",
        relation_name: "r willson",
        relation_address_current: "test current address"
      },
      {
        relation: "other_family",
        unique_id: "b5923590-112c-4b29-aba9-8efa9b63a123",
        relation_name: "b johnson",
        relation_is_caregiver: true
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
        unique_id: "948329b8-b501-47d5-9b3d-64f371e7b9bd",
        relation_name: "Brady",
        relation_is_alive: "alive"
      },
      {
        relation: "other_family",
        unique_id: "b5981626-989c-4b29-aba9-8dca9b63a346",
        relation_name: "r willson",
        relation_address_current: "test current address",
        _hidden: true
      },
      {
        relation: "other_family",
        unique_id: "b5923590-112c-4b29-aba9-8efa9b63a123",
        relation_name: "b johnson",
        relation_is_caregiver: true
      }
    ];

    const options = helpers.valuesWithHiddenAttribute(values, displayConditions);

    expect(options).to.deep.equal(expected);
  });
});
