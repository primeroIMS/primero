// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectContactInformation, selectSavingContactInformation } from "./selectors";

const contactInformation = fromJS({
  name: "Primero test",
  organization: "PT",
  phone: "123456789",
  other_information: "",
  support_forum: "",
  email: "primero-support@primero.com",
  location: "",
  position: "",
  system_version: "2.0.0.10"
});

const defaultState = fromJS({
  records: {
    support: {
      data: contactInformation,
      loading: false,
      errors: false
    }
  }
});

const emptyState = fromJS({});

describe("<AgenciesForm /> - Selectors", () => {
  describe("selectContactInformation", () => {
    it("should return selected contactInformation", () => {
      const expected = contactInformation;

      expect(selectContactInformation(defaultState)).toEqual(expected);
    });

    it("should be empty", () => {
      expect(selectContactInformation(emptyState).size).toBe(0);
    });
  });

  describe("selectSavingContactInformation", () => {
    it("should return errors", () => {
      const expected = false;

      expect(selectSavingContactInformation(defaultState)).toEqual(expected);
    });
  });
});
