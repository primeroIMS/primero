// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { parseISO } from "date-fns";
import { fromJS } from "immutable";

import {
  APPROVALS,
  CASE_RELATIONSHIPS,
  CHANGE_LOGS,
  FAMILY_FROM_CASE,
  INCIDENT_FROM_CASE,
  INCIDENT_TRANSFERS_ASSIGNMENTS,
  RECORD_OWNER,
  REFERRAL,
  REGISTRY_FROM_CASE,
  SUMMARY,
  SUMMARY_INCIDENT_MRM,
  TRANSFERS_ASSIGNMENTS
} from "../../config";
import { SHOW_APPROVALS } from "../permissions";

import { FormSectionRecord, FieldRecord, NavRecord } from "./records";
import { DATE_FIELD, SELECT_FIELD, TICK_FIELD, SUBFORM_SECTION, TEXT_FIELD, SEPERATOR, TALLY_FIELD } from "./constants";
import * as utils from "./utils";
import { getDefaultForms } from "./form/utils";

describe("<RecordForms /> - utils", () => {
  afterAll(() => {
    jest.useRealTimers();
  });

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
        same_locations: ["loc-4", "loc-5"],
        same_relatives: [
          {
            unique_id: "123",
            name: "Name 1"
          },
          {
            unique_id: "345",
            name: "Name 2"
          }
        ],
        location_relatives: [
          {
            unique_id: "123",
            name: "Name 1",
            location: ["loc_1", "loc_2"]
          },
          {
            unique_id: "345",
            name: "Name 2",
            location: ["loc_1", "loc_2"]
          }
        ],
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
        same_locations: ["loc-4", "loc-5"],
        caregiver_number: "",
        incident_details: [
          {
            cp_incident_perpetrator_national_id_no: "",
            cp_incident_perpetrator_nationality: "",
            cp_incident_perpetrator_occupation: "",
            cp_incident_perpetrator_other_id_no: ""
          }
        ],
        same_relatives: [
          {
            unique_id: "123",
            name: "Name 1"
          },
          {
            unique_id: "345",
            name: "Name 2"
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
        ],
        location_relatives: [
          {
            unique_id: "123",
            name: "Name 1",
            location: []
          },
          {
            unique_id: "345",
            name: "Name 2",
            location: ["loc_1", "loc_2", "loc_3"]
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
        test_locations: [],
        past_locations: ["loc-3"],
        relatives: [
          {
            mother_name: "James"
          },
          {
            unique_id: "125",
            phone: "555-333-5534"
          }
        ],
        location_relatives: [
          {
            unique_id: "123",
            location: []
          },
          {
            unique_id: "345",
            location: ["loc_1", "loc_2", "loc_3"]
          }
        ]
      };

      expect(utils.compactValues(values, initialValues)).toEqual(expected);
    });

    it("returns object of values that changed for documents with id", () => {
      const initialValues = {
        other_documents: [{ id: 1, date: "2020-05-12" }]
      };

      const values = {
        other_documents: [{ id: 1, date: "2020-06-08" }]
      };

      const expected = {
        other_documents: [{ id: 1, date: "2020-06-08" }]
      };

      expect(utils.compactValues(values, initialValues)).toEqual(expected);
    });
  });

  describe("emptyValues", () => {
    it("should return true if all of the object's values are empty", () => {
      const testObject = {
        a: [],
        b: {},
        c: false
      };

      expect(utils.emptyValues(testObject)).toBe(true);
    });
    it("should return false if any of the object's values are not empty", () => {
      const testObject = {
        a: [],
        b: "Test 2"
      };

      expect(utils.emptyValues(testObject)).toBe(false);
    });
  });

  describe("getRedirectPath", () => {
    it("should return the path to the case id if there is a incidentFromCase", () => {
      expect(utils.getRedirectPath({ isNew: true }, {}, "case-id-1")).toBe("/cases/case-id-1");
    });

    it("should return the path to the incident id if is not new", () => {
      //
      expect(utils.getRedirectPath({ isEdit: true }, { recordType: "incidents", id: "incident-id-1" })).toBe(
        "/incidents/incident-id-1"
      );
    });

    it("should return the path to incidents if is new", () => {
      expect(utils.getRedirectPath({ isNew: true }, { recordType: "incidents", id: "incident-id-1" }, "")).toBe("");
    });
  });

  describe("constructInitialValues", () => {
    beforeEach(() => {
      const today = parseISO("2010-01-05T18:30:00Z");

      jest.useFakeTimers().setSystemTime(today);
    });

    it("should generate default values if they are defined", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", selected_value: "default_value_1", visible: true }),
            FieldRecord({
              name: "field_2",
              type: SELECT_FIELD,
              multi_select: true,
              selected_value: `["value_1", "value_2"]`,
              visible: true
            }),
            FieldRecord({
              name: "field_3",
              type: TICK_FIELD,
              selected_value: true,
              visible: true
            }),
            FieldRecord({
              name: "field_4",
              type: DATE_FIELD,
              selected_value: "today",
              visible: true
            }),
            FieldRecord({
              name: "field_5",
              type: SELECT_FIELD,
              multi_select: true,
              selected_value: "value_1",
              visible: true
            }),
            FieldRecord({
              name: "field_6",
              type: TALLY_FIELD,
              autosum_total: true,
              visible: true,
              tally: [
                { id: "test1", display_text: { en: "Test 1" } },
                { id: "test2", display_text: { en: "Test 2" } }
              ]
            }),
            FieldRecord({
              name: "field_7",
              type: TALLY_FIELD,
              autosum_total: false,
              visible: true,
              tally: [
                { id: "test3", display_text: { en: "Test 3" } },
                { id: "test4", display_text: { en: "Test 4" } }
              ]
            })
          ]
        })
      ];

      const expectedInitialValues = {
        field_1: "default_value_1",
        field_2: ["value_1", "value_2"],
        field_3: true,
        field_4: "2010-01-05",
        field_5: ["value_1"],
        field_6: { test1: null, test2: null, total: null },
        field_7: { test3: null, test4: null }
      };

      expect(utils.constructInitialValues(forms)).toEqual(expectedInitialValues);
    });

    it("should not generate default values if they are not defined", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", visible: true }),
            FieldRecord({
              name: "field_2",
              type: SELECT_FIELD,
              multi_select: true,
              visible: true
            }),
            FieldRecord({
              name: "field_3",
              type: TICK_FIELD,
              visible: true
            }),
            FieldRecord({
              name: "field_4",
              type: DATE_FIELD,
              visible: true
            })
          ]
        })
      ];

      const expectedInitialValues = {
        field_1: "",
        field_2: [],
        field_3: false,
        field_4: null
      };

      expect(utils.constructInitialValues(forms)).toEqual(expectedInitialValues);
    });

    it("should not generate default values for separators", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", type: SEPERATOR, visible: true }),
            FieldRecord({ name: "field_2", type: SEPERATOR, visible: true })
          ]
        })
      ];

      expect(utils.constructInitialValues(forms)).toEqual({});
    });

    it("should not generate default values for hidden fields", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", type: TEXT_FIELD }),
            FieldRecord({ name: "field_2", type: TEXT_FIELD })
          ]
        })
      ];

      expect(utils.constructInitialValues(forms)).toEqual({});
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe("sortSubformValues", () => {
    it("should return subforms with display conditions from subform_section_configuration", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", selected_value: "default_value_1" }),
            FieldRecord({
              display_name: "Test SubField",
              subform_section_id: FormSectionRecord({
                unique_id: "subform_1",
                fields: [
                  FieldRecord({
                    display_name: "Test Sub Field Allowed",
                    name: "allowed_field",
                    type: TEXT_FIELD,
                    visible: true
                  }),
                  FieldRecord({
                    display_name: "Test Sub Field Disallowed",
                    name: "disallowed_field",
                    type: TEXT_FIELD,
                    visible: true
                  })
                ]
              }),
              subform_section_configuration: {
                fields: ["allowed_field"],
                display_conditions: [
                  {
                    allowed_field: "gerald"
                  }
                ]
              },
              name: "subform_1",
              type: SUBFORM_SECTION
            })
          ]
        })
      ];

      const initialValues = {
        subform_1: [
          { allowed_field: "stanley", disallowed_field: "test disallowed", _hidden: true },
          { allowed_field: "gerald", disallowed_field: "test disallowed" }
        ],
        subform_2: [],
        subform_3: []
      };

      const expected = {
        subform_1: [
          { allowed_field: "stanley", disallowed_field: "test disallowed", _hidden: true },
          {
            allowed_field: "gerald",
            disallowed_field: "test disallowed"
          }
        ]
      };

      const result = utils.sortSubformValues(initialValues, forms);

      expect(result).toEqual(expected);
    });

    it("should return subforms sorted by subformSortBy field", () => {
      const forms = [
        FormSectionRecord({
          unique_id: "form_1",
          fields: [
            FieldRecord({ name: "field_1", selected_value: "default_value_1" }),
            FieldRecord({
              display_name: "Test SubField",
              subform_section_id: FormSectionRecord({
                unique_id: "subform_1",
                fields: [
                  FieldRecord({
                    display_name: "Test Sub Field Allowed",
                    name: "allowed_field",
                    type: TEXT_FIELD,
                    visible: true
                  })
                ]
              }),
              subform_section_configuration: {
                subform_sort_by: "allowed_field"
              },
              name: "subform_1",
              type: SUBFORM_SECTION
            })
          ]
        })
      ];

      const initialValues = {
        subform_1: [{ allowed_field: "b" }, { allowed_field: "c" }, { allowed_field: "a" }],
        subform_2: [],
        subform_3: []
      };

      const expected = {
        subform_1: [{ allowed_field: "a" }, { allowed_field: "b" }, { allowed_field: "c" }]
      };

      const result = utils.sortSubformValues(initialValues, forms);

      expect(result).toEqual(expected);
    });
  });

  describe("buildFormNav", () => {
    it("should return the nav with the permission_actions if defined", () => {
      const expected = NavRecord({
        group: "group_1",
        groupOrder: 1,
        name: "Approvals",
        order: 1,
        formId: APPROVALS,
        is_first_tab: true,
        permission_actions: SHOW_APPROVALS,
        display_conditions: []
      });

      const approvalsForm = FormSectionRecord({
        unique_id: APPROVALS,
        form_group_id: "group_1",
        name: { en: "Approvals" },
        order: 1,
        order_form_group: 1,
        is_first_tab: true
      });

      expect(utils.buildFormNav(approvalsForm).toJS()).toEqual(expected.toJS());
    });

    it("should return the nav without permission_actions if not defined", () => {
      const expected = NavRecord({
        group: "group_1",
        groupOrder: 1,
        name: "Form 1",
        order: 1,
        formId: "form_id_1",
        is_first_tab: true,
        display_conditions: []
      });

      const form = FormSectionRecord({
        unique_id: "form_id_1",
        form_group_id: "group_1",
        name: { en: "Form 1" },
        order: 1,
        order_form_group: 1,
        is_first_tab: true,
        display_conditions: []
      });

      expect(utils.buildFormNav(form).toJS()).toEqual(expected.toJS());
    });
  });

  describe("pickFromDefaultForms", () => {
    it("should return default forms for the not found in the state", () => {
      const forms = fromJS({
        [RECORD_OWNER]: FormSectionRecord({
          unique_id: RECORD_OWNER,
          form_group_id: "group_1",
          name: { en: "Record Owner in State" },
          order: 1,
          order_form_group: 1,
          is_first_tab: true
        })
      });

      const result = Object.keys(
        utils.pickFromDefaultForms(forms, getDefaultForms({ t: value => value, locale: "en" }))
      );

      expect(result).toEqual([
        SUMMARY,
        APPROVALS,
        INCIDENT_FROM_CASE,
        REFERRAL,
        TRANSFERS_ASSIGNMENTS,
        INCIDENT_TRANSFERS_ASSIGNMENTS,
        CHANGE_LOGS,
        REGISTRY_FROM_CASE,
        FAMILY_FROM_CASE,
        CASE_RELATIONSHIPS,
        SUMMARY_INCIDENT_MRM
      ]);
    });
  });

  describe("compactBlank", () => {
    it("should remove all the null, undefined and empty values from an object", () => {
      const expected = {
        name: "Name 1",
        age: 10,
        estimated: true
      };

      expect(
        utils.compactBlank({
          name: "Name 1",
          country: "",
          age: 10,
          nationality: [null],
          religion: null,
          locations: fromJS([]),
          estimated: true
        })
      ).toEqual(expected);
    });

    it("should remove all the null from subform entries", () => {
      const expected = {
        name: "Name 1",
        age: 10,
        estimated: true,
        nationality: ["country1", "country2"],
        family_details: [
          { relation: "mother", name: "Name 2", is_alive: true, age: 25 },
          { relation: "father", name: "Name 2", is_alive: false, location: ["country1"] }
        ]
      };

      expect(
        utils.compactBlank({
          name: "Name 1",
          age: 10,
          estimated: true,
          nationality: ["country1", "country2"],
          locations: fromJS([]),
          ethnicity: [],
          family_details: [
            { relation: "mother", name: "Name 2", ocupation: "", is_alive: true, age: 25, location: [null] },
            { relation: "father", name: "Name 2", current_location: "", is_alive: false, location: ["country1"] }
          ]
        })
      ).toEqual(expected);
    });

    it("should remove all the null from subform objects", () => {
      const expected = {
        name: "Name 1",
        family_details: [{ relation: "mother", tally: { boys: 1, girls: 3 } }]
      };

      expect(
        utils.compactBlank({
          name: "Name 1",
          family_details: [{ relation: "mother", tally: { boys: 1, girls: 3, unknown: "", total: null } }]
        })
      ).toEqual(expected);
    });
  });

  describe("compactReadOnlyFields", () => {
    it("removes all the readOnlyFields from the values object", () => {
      const formSections = fromJS([
        FormSectionRecord({
          unique_id: "form_1",
          userPermission: "r",
          fields: [
            FieldRecord({
              name: "field_2",
              type: TICK_FIELD,
              visible: true
            }),
            FieldRecord({
              name: "field_4",
              type: DATE_FIELD,
              visible: true
            })
          ]
        }),
        FormSectionRecord({
          unique_id: "form_2",
          userPermission: "rw",
          fields: [
            FieldRecord({ name: "field_1", visible: true }),
            FieldRecord({
              name: "field_1",
              type: SELECT_FIELD,
              multi_select: true,
              visible: true
            }),
            FieldRecord({
              name: "field_3",
              type: DATE_FIELD,
              visible: true
            })
          ]
        })
      ]);

      expect(
        utils.compactReadOnlyFields(
          {
            field_1: "value 1",
            field_2: "value 2",
            field_3: "value 3",
            field_4: "value 4"
          },
          formSections
        )
      ).toEqual({ field_1: "value 1", field_3: "value 3" });
    });

    it("keep fields from readWrite forms when field is present in readOnly Forms", () => {
      const formSections = fromJS([
        FormSectionRecord({
          unique_id: "form_1",
          userPermission: "r",
          fields: [
            FieldRecord({
              name: "field_2",
              type: TICK_FIELD,
              visible: true
            }),
            FieldRecord({
              name: "field_4",
              type: DATE_FIELD,
              visible: true
            }),
            FieldRecord({
              display_name: "Random field",
              name: "field_5",
              type: TEXT_FIELD,
              visible: true
            })
          ]
        }),
        FormSectionRecord({
          unique_id: "form_2",
          userPermission: "rw",
          fields: [
            FieldRecord({ name: "field_1", visible: true }),
            FieldRecord({
              name: "field_1",
              type: SELECT_FIELD,
              multi_select: true,
              visible: true
            }),
            FieldRecord({
              name: "field_3",
              type: DATE_FIELD,
              visible: true
            }),
            FieldRecord({
              display_name: "Random field",
              name: "field_5",
              type: TEXT_FIELD,
              visible: true
            })
          ]
        })
      ]);

      expect(
        utils.compactReadOnlyFields(
          {
            field_1: "value 1",
            field_2: "value 2",
            field_3: "value 3",
            field_4: "value 4",
            field_5: "value 5"
          },
          formSections
        )
      ).toEqual({ field_1: "value 1", field_3: "value 3", field_5: "value 5" });
    });
  });

  describe("getFieldDefaultValue", () => {
    describe("when the field type is TICK_FIELD", () => {
      it("returns true if selected_value is either true, 't' or 'true'", () => {
        expect(utils.getFieldDefaultValue({ type: TICK_FIELD, selected_value: "true" })).toBe(true);
        expect(utils.getFieldDefaultValue({ type: TICK_FIELD, selected_value: true })).toBe(true);
        expect(utils.getFieldDefaultValue({ type: TICK_FIELD, selected_value: "t" })).toBe(true);
      });

      it("returns false if selected_value is not true, 't' or 'true'", () => {
        expect(utils.getFieldDefaultValue({ type: TICK_FIELD, selected_value: "wrong" })).toBe(false);
      });
    });
  });
});
