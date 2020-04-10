import { fromJS } from "immutable";

import { expect, mock } from "../../../test";
import { SERVICE_SECTION_FIELDS } from "../../record-actions/transitions/components/referrals";
import { CODE_FIELD, NAME_FIELD, UNIQUE_ID_FIELD } from "../../../config";

import { CUSTOM_STRINGS_SOURCE } from "./constants";
import * as helpers from "./utils";

describe("Verifying utils", () => {
  it("should have known utils", () => {
    const clonedHelpers = { ...helpers };

    [
      "appendDisabledAgency",
      "appendDisabledUser",
      "buildCustomLookupsConfig",
      "findOptionDisplayText",
      "getConnectedFields",
      "handleChangeOnServiceUser",
      "translatedText",
      "serviceHasReferFields",
      "serviceIsReferrable"
    ].forEach(property => {
      expect(clonedHelpers).to.have.property(property);
      delete clonedHelpers[property];
    });

    expect(clonedHelpers).to.deep.equal({});
  });
})

describe("appendDisabledAgency", () => {
  it("should append the agency if not present in the agencies list", () => {
    const agencies = fromJS([
      {
        unique_id: "agency-test-1",
        agency_code: "test1",
        disabled: false,
        services: ["service_test_1"]
      },
      {
        unique_id: "agency-test-2",
        agency_code: "test2",
        disabled: false,
        services: ["service_test_1", "service_test_2"]
      }
    ]);
    const expected = agencies.push(
      fromJS({
        unique_id: "agency-test-3",
        name: "agency-test-3",
        isDisabled: true
      })
    );
    const options = helpers.appendDisabledAgency(agencies, "agency-test-3");

    expect(options).to.deep.equal(expected);
  });
});

describe("appendDisabledUser", () => {
  it("should append the user if not present in the users list", () => {
    const users = fromJS([{ user_name: "user-1" }, { user_name: "user-2" }]);
    const expected = users.push(
      fromJS({ user_name: "user-3", isDisabled: true })
    );
    const options = helpers.appendDisabledUser(users, "user-3");

    expect(options).to.deep.equal(expected);
  });
});

describe("getConnectedFields", () => {
  it("should return the connected fields for the service_section index", () => {
    const expected = {
      service: `services_section[0]${SERVICE_SECTION_FIELDS.type}`,
      agency: `services_section[0]${SERVICE_SECTION_FIELDS.implementingAgency}`,
      location: `services_section[0]${SERVICE_SECTION_FIELDS.deliveryLocation}`,
      user: `services_section[0]${SERVICE_SECTION_FIELDS.implementingAgencyIndividual}`
    };

    const connectedFields = helpers.getConnectedFields(0);

    expect(connectedFields).to.deep.equal(expected);
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
      const referralUsers = fromJS([
        { user_name: "user-1", agency: "agency-1", location: "location-1" }
      ]);
      const reportingLocations = fromJS([{ code: "location-1" }]);

      formMock
        .expects("setFieldValue")
        .withArgs(helpers.getConnectedFields(0).agency, "agency-1", false);

      formMock
        .expects("setFieldValue")
        .withArgs(helpers.getConnectedFields(0).location, "location-1", false);

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
      expect(helpers.translatedText({ en: "string" }, i18n)).to.be.equal(
        "string"
      );
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
    const reportingLocations = fromJS([
      { id: 1, code: "location-1", admin_level: 2 }
    ]);
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
        value: "agency-2",
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
});
