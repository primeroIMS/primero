import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("<FormsBuilder /> - Selectors", () => {
  it("should know the selectors", () => {
    const clonedSelectors = { ...selectors };

    [
      "getSavingRecord",
      "getSelectedField",
      "getSelectedFields",
      "getSelectedForm",
      "getSelectedSubform",
      "getSelectedSubforms",
      "getServerErrors",
      "getUpdatedFormIds"
    ].forEach(property => {
      expect(clonedSelectors).to.have.property(property);
      delete clonedSelectors[property];
    });
    expect(clonedSelectors).to.be.empty;
  });

  describe("getSavingRecord", () => {
    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            saving: true
          }
        }
      }
    });

    it("should return the correct value", () => {
      expect(selectors.getSavingRecord(initialState)).to.be.true;
    });
  });

  describe("getSelectedForm", () => {
    const selectedForm = fromJS({ id: 1, name: { en: "Form ID 1" } });
    const initialState = fromJS({
      records: { admin: { forms: { selectedForm } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedForm(initialState)).to.deep.equal(
        selectedForm
      );
    });
  });
});
