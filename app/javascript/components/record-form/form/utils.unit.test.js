import { fromJS, List } from "immutable";

import { mock } from "../../../test";
import { SERVICE_SECTION_FIELDS } from "../../record-actions/transitions/components/referrals";
import { CODE_FIELD, NAME_FIELD, UNIQUE_ID_FIELD } from "../../../config";

import { CUSTOM_STRINGS_SOURCE } from "./constants";
import * as helpers from "./utils";

describe("Verifying utils", () => {
  it("should have known utils", () => {
    const clonedHelpers = { ...helpers };

    [
      "appendDisabledUser",
      "buildCustomLookupsConfig",
      "findOptionDisplayText",
      "getConnectedFields",
      "getRecordInformationForms",
      "getSubformValues",
      "handleChangeOnServiceUser",
      "isFormDirty",
      "serviceHasReferFields",
      "serviceIsReferrable",
      "translatedText",
      "withStickyOption"
    ].forEach(property => {
      expect(clonedHelpers).to.have.property(property);
      delete clonedHelpers[property];
    });

    expect(clonedHelpers).to.deep.equal({});
  });
});

describe("withStickyOption", () => {
  const options = fromJS([
    { unique_id: "option_1", display_text: "Option 1" },
    { unique_id: "option_2", display_text: "Option 2" },
    { unique_id: "option_3", display_text: "Option 3", disabled: true }
  ]);

  it("should append a disabled option if sticky", () => {
    expect(helpers.withStickyOption(options, "option_3")).to.have.sizeOf(3);
  });

  it("should not append a disabled option if it is not sticky", () => {
    expect(helpers.withStickyOption(options)).to.have.sizeOf(2);
  });
});

describe("appendDisabledUser", () => {
  it("should append the user if not present in the users list", () => {
    const users = fromJS([{ user_name: "user-1" }, { user_name: "user-2" }]);
    const expected = users.push(fromJS({ user_name: "user-3", isDisabled: true }));
    const options = helpers.appendDisabledUser(users, "user-3");

    expect(options).to.deep.equal(expected);
  });
});

describe("getConnectedFields", () => {
  it("should know the connected fields", () => {
    const connectedFields = { ...helpers.getConnectedFields() };

    ["service", "agency", "location", "user"].forEach(property => {
      expect(connectedFields).to.have.property(property);
      delete connectedFields[property];
    });

    expect(connectedFields).to.deep.equal({});
  });

  it("should return the connected fields", () => {
    const expected = {
      service: SERVICE_SECTION_FIELDS.type,
      agency: SERVICE_SECTION_FIELDS.implementingAgency,
      location: SERVICE_SECTION_FIELDS.deliveryLocation,
      user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
    };

    const connectedFields = helpers.getConnectedFields();

    expect(connectedFields).to.deep.equal(expected);
  });

  describe("handleChangeOnServiceUser", () => {
    it("should set the connected fields when the user is changed", () => {
      const form = { setFieldValue: () => {} };
      const formMock = mock(form);
      const setFilterState = mock();
      const agencies = fromJS([{ unique_id: "agency-1" }]);
      const referralUsers = fromJS([{ user_name: "user-1", agency: "agency-1", location: "location-1" }]);
      const reportingLocations = fromJS([{ code: "location-1" }]);

      formMock.expects("setFieldValue").withArgs(helpers.getConnectedFields(0).agency, "agency-1", false);

      formMock.expects("setFieldValue").withArgs(helpers.getConnectedFields(0).location, "location-1", false);

      helpers.handleChangeOnServiceUser({
        agencies,
        data: { value: "user-1" },
        form,
        index: 0,
        referralUsers,
        reportingLocations,
        setFilterState
      });

      formMock.verify();
    });
  });

  describe("translatedText", () => {
    const i18n = { locale: "en" };

    it("should return the same displayText if not localized", () => {
      expect(helpers.translatedText("string", i18n)).to.be.equal("string");
    });

    it("should return the translated displayText for english", () => {
      expect(helpers.translatedText({ en: "string" }, i18n)).to.be.equal("string");
    });

    it("should return empty if the translation does not exist", () => {
      expect(helpers.translatedText({ fr: "string" }, i18n)).to.be.equal("");
    });
  });

  describe("findOptionDisplayText", () => {
    it("should return the display text for agency option", () => {
      const i18n = { locale: "en" };
      const agencies = fromJS([{ id: "agency-1", name: "Agency 1" }]);
      const customLookups = [CUSTOM_STRINGS_SOURCE.agency];

      const displayText = helpers.findOptionDisplayText({
        agencies,
        customLookups,
        i18n,
        option: CUSTOM_STRINGS_SOURCE.agency,
        options: [],
        value: "agency-1"
      });

      expect(displayText).to.be.equal("Agency 1");
    });
  });

  describe("buildCustomLookupsConfig", () => {
    const locations = fromJS([{ id: 1, code: "location-1", admin_level: 1 }]);
    const reportingLocations = fromJS([{ id: 1, code: "location-1", admin_level: 2 }]);
    const agencies = fromJS([{ unique_id: "agency-1", name: "Agency 1" }]);
    const referralUsers = fromJS([{ user_name: "New User " }]);
    const defaultConfig = {
      Location: {
        fieldLabel: NAME_FIELD,
        fieldValue: CODE_FIELD,
        options: locations
      },
      Agency: {
        fieldLabel: NAME_FIELD,
        fieldValue: UNIQUE_ID_FIELD,
        options: agencies
      },
      ReportingLocation: {
        fieldLabel: NAME_FIELD,
        fieldValue: CODE_FIELD,
        options: reportingLocations
      },
      User: {
        fieldLabel: "user_name",
        fieldValue: "user_name",
        options: referralUsers
      }
    };

    it("should return the config for custom lookups with disabled options", () => {
      const config = helpers.buildCustomLookupsConfig({
        agencies,
        filterState: { filtersChanged: false },
        locations,
        referralUsers,
        reportingLocations,
        stickyOptionId: "agency-2",
        name: SERVICE_SECTION_FIELDS.implementingAgency
      });

      const expected = {
        ...defaultConfig,
        Agency: {
          ...defaultConfig.Agency,
          options: defaultConfig.Agency.options.push(
            fromJS({
              unique_id: "agency-2",
              name: "agency-2",
              isDisabled: true
            })
          )
        }
      };

      expect(config).to.deep.equal(expected);
    });
  });

  describe("getSubformValues", () => {
    const index = 1;
    const field = { name: "services_section", subform_section_configuration: {} };
    const values = {
      services_section: [
        {
          response_type: "response-type-2"
        },
        {
          response_type: "response-type-1"
        }
      ]
    };

    describe("when subforms are not sorted", () => {
      it("should return the subform object from formik values", () => {
        const result = helpers.getSubformValues(field, index, values);

        expect(result).to.deep.equal({
          response_type: "response-type-1"
        });
      });
    });

    describe("when subforms are sorted", () => {
      it("should return the subform object from orderedValues values and not from formik", () => {
        const orderedValues = [
          {
            response_type: "response-type-1"
          },
          {
            response_type: "response-type-2"
          }
        ];
        const result = helpers.getSubformValues(field, index, values, orderedValues);

        expect(result).to.deep.equal({
          response_type: "response-type-2"
        });
      });
    });

    describe("isFormDirty", () => {
      it("should return false if initialValues and currentValues are equals", () => {
        const initialValues = {
          field_1: "test"
        };

        const currentValues = {
          field_1: "test"
        };

        const fields = List([
          {
            name: "field_1",
            type: "text_field"
          }
        ]);

        expect(helpers.isFormDirty(initialValues, currentValues, fields)).to.be.false;
      });

      it("should return true if initialValues and currentValues are not equals", () => {
        const initialValues = {
          field_1: "test"
        };

        const currentValues = {
          field_1: "test 1"
        };

        const fields = List([
          {
            name: "field_1",
            type: "text_field"
          }
        ]);

        expect(helpers.isFormDirty(initialValues, currentValues, fields)).to.be.true;
      });

      describe("with subforms", () => {
        it(
          "should return false if initialValues and currentValues are equals, " +
            "even if currentValues subforms are in a differente order",
          () => {
            const initialValues = {
              field_1: "test",
              subform_1: [
                {
                  subform_value: "test",
                  order_field: "a"
                },
                {
                  subform_value: "test",
                  order_field: "b"
                }
              ]
            };

            const currentValues = {
              field_1: "test",
              subform_1: [
                {
                  subform_value: "test",
                  order_field: "b"
                },
                {
                  subform_value: "test",
                  order_field: "a"
                }
              ]
            };

            const fields = List([
              {
                name: "field_1"
              },
              {
                name: "subform_1",
                type: "subform",
                subform_section_configuration: { subform_sort_by: "order_field" }
              }
            ]);

            expect(helpers.isFormDirty(initialValues, currentValues, fields)).to.be.false;
          }
        );

        it(
          "should return true if initialValues and currentValues subform values are not equals, " +
            "even if currentValues subforms are in a differente order",
          () => {
            const initialValues = {
              field_1: "test",
              subform_1: [
                {
                  subform_value: "test",
                  order_field: "a"
                },
                {
                  subform_value: "test",
                  order_field: "b"
                }
              ]
            };

            const currentValues = {
              field_1: "test",
              subform_1: [
                {
                  subform_value: "test 1",
                  order_field: "b"
                },
                {
                  subform_value: "test",
                  order_field: "a"
                }
              ]
            };

            const fields = List([
              {
                name: "field_1"
              },
              {
                name: "subform_1",
                type: "subform",
                subform_section_configuration: { subform_sort_by: "order_field" }
              }
            ]);

            expect(helpers.isFormDirty(initialValues, currentValues, fields)).to.be.true;
          }
        );
      });
    });
  });

  describe("getRecordInformationForms", () => {
    const i18n = { t: value => value };

    it("should return all the record information forms", () => {
      expect(Object.keys(helpers.getRecordInformationForms(i18n)).length).to.equal(6);
    });
  });
});
