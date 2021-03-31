import ContactInformation from "../../contact-information";
import NotImplemented from "../../not-implemented/component";

import { CodeOfConduct, TermOfUse } from "./components";
import { SUPPORT_FORMS } from "./constants";
import * as utils from "./utils";

describe("<Support /> - utils", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["menuList", "renderSupportForm"].forEach(property => {
      it(`should exports '${property}'`, () => {
        expect(utils).to.have.property(property);
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
        }
      ];
      const result = utils.menuList(i18n, false);

      expect(result).to.be.an("array");
      expect(result).to.deep.equals(expected);
    });
  });

  describe("renderSupportForm", () => {
    it("should return the ContactInformation form", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.contactInformation)).to.be.equal(ContactInformation);
    });

    it("should return the CodeOfConduct form", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.codeOfConduct)).to.be.equal(CodeOfConduct);
    });

    it("should return TermOfUse component", () => {
      expect(utils.renderSupportForm(SUPPORT_FORMS.termsOfUse)).to.be.equal(TermOfUse);
    });

    it("should return NotImplemented form if it's not a valid form", () => {
      expect(utils.renderSupportForm()).to.be.equal(NotImplemented);
    });
  });
});
