import { expect } from "chai";
import { Map, fromJS } from "immutable";
import { FormGroup, FormControlLabel } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import CheckBox from "./component";

describe("<CheckBox /> - Component", () => {
  const mockedData = {
    name: "cases.filter_by.flag",
    field_name: "flagged",
    type: "checkbox",
    options: {
      en: [
        {
          id: "true",
          display_name: "Flagged?"
        }
      ],
      es: [
        {
          id: "true",
          display_name: "Marcado?"
        }
      ]
    }
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      CheckBox,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              flagged: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the FormGroup", () => {
    expect(component.find(FormGroup)).to.have.lengthOf(1);
  });

  it("renders the FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.lengthOf(1);
  });

  describe("with multiple languague support", () => {
    const state = fromJS({
      forms: {
        options: {
          lookups: [
            {
              id: 1,
              unique_id: "lookup-status-type",
              name: { en: "Status" },
              values: [
                { id: "open", display_text: { en: "Open", es: "Abierto" } },
                { id: "close", display_text: { en: "Close", es: "Cerrado" } }
              ]
            }
          ]
        }
      }
    });

    const props = {
      recordType: "cases",
      props: {
        field_name: "flagged",
        option_strings_source: "lookup lookup-status-type"
      }
    };

    it("should render checkboxes values with 'en' locale", () => {
      const { component: componentWithLocaleEN } = setupMountedComponent(
        CheckBox,
        props,
        state
      );
      const formControlLabelComponent = componentWithLocaleEN.find(
        FormControlLabel
      );

      expect(formControlLabelComponent).to.have.lengthOf(2);
      expect(formControlLabelComponent.first().text()).to.be.equal("Open");
      expect(formControlLabelComponent.last().text()).to.be.equal("Close");
    });

    it("should render checkboxes values with 'es' locale", () => {
      global.window.I18n = { locale: "es" };

      const { component: componentWithLocaleES } = setupMountedComponent(
        CheckBox,
        props,
        state
      );
      const formControlLabelComponent = componentWithLocaleES.find(
        FormControlLabel
      );

      expect(formControlLabelComponent).to.have.lengthOf(2);
      expect(formControlLabelComponent.first().text()).to.be.equal("Abierto");
      expect(formControlLabelComponent.last().text()).to.be.equal("Cerrado");
    });

    after(() => {
      global.window.I18n = {
        defaultLocale: "en",
        locale: "en",
        t: path => path
      };
    });
  });
});
