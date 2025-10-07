// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import ContactInformation from "../../contact-information";
import NotImplemented from "../../not-implemented/component";

import { CodeOfConduct, TermOfUse } from "./components";
import { SUPPORT_FORMS } from "./constants";
import * as utils from "./utils";

describe("<Support /> - utils", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...utils };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["menuList", "renderSupportForm"].forEach(property => {
      it(`should exports '${property}'`, () => {
        expect(utils).toHaveProperty(property);
        delete clone[property];
      });
    });
  });

  describe("menuList", () => {
    it("should return list of allowed forms", () => {
      const i18n = { t: value => value };
      const expected = [
        {
          id: "contact_information",
          text: "navigation.support_menu.contact_information"
        },
        {
          id: "terms_of_use",
          text: "navigation.support_menu.terms_of_use"
        },
        {
          id: "code_of_conduct",
          text: "navigation.support_menu.code_of_conduct",
          disabled: false
        },
        {
          id: "resync",
          text: "navigation.support_menu.resync"
        }
      ];
      const result = utils.menuList(i18n, false);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(expected);
    });
  });

  describe("renderSupportForm", () => {
    it("should return the ContactInformation form", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.contactInformation)).toBe(ContactInformation);
    });

    it("should return the CodeOfConduct form", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.codeOfConduct)).toBe(CodeOfConduct);
    });

    it("should return TermOfUse component", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.termsOfUse)).toBe(TermOfUse);
    });

    it("should return NotImplemented form if it's not a valid form", () => {
      expect(utils.renderSupportForm()).toBe(NotImplemented);
    });
  });
});
