import { fromJS } from "immutable";

import { spy, fake } from "../../test";

import { getCustomFormTitle } from "./selectors";

describe("<PdfExporter /> - Selectors", () => {
  describe("getCustomFormTitle", () => {
    const watch = spy();
    const state = fromJS({
      application: {
        managedRoles: [
          {
            id: 1,
            name: "Test",
            referral: true
          }
        ]
      }
    });

    describe("when title is a string", () => {
      it("should return that same string", () => {
        expect(getCustomFormTitle(state, "Referral", watch)).to.be.equals("Referral");
      });
    });

    describe("when title is an object", () => {
      const title = {
        watchedId: "test",
        selector: fake.returns(fromJS({ id: 1, name: "Test" })),
        selectorNameProp: "name"
      };

      it("should have 3 keys", () => {
        expect(title).to.have.keys("watchedId", "selector", "selectorNameProp");
      });

      it("should call selector and return name prop from state", () => {
        const result = getCustomFormTitle(state, title, watch);

        expect(title.selector).to.be.calledOnce;
        expect(watch).to.be.calledOnce;
        expect(result).to.be.equals("Test");
      });
    });
  });
});
