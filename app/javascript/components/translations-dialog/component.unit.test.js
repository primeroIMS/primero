import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../test";

import ReportTranslationsDialog from "./component";
import { NAME } from "./constants";

describe("<ReportsForm />/components/<TranslationsDialog/> - Container", () => {
  const state = fromJS({
    ui: { dialogs: { dialog: NAME, open: true } },
    application: { primero: { locales: ["en", "fr", "ar"] } }
  });

  it("should render <TranslationsDialog /> with fields for the selected locale", () => {
    const { component } = setupMockFormComponent(ReportTranslationsDialog, {
      props: { mode: "edit" },
      state,
      includeFormMethods: true
    });

    const dialog = component.find(ReportTranslationsDialog);
    const autoComplete = dialog.find(Autocomplete);
    const textFields = dialog.find(TextField);

    expect(component.find(ReportTranslationsDialog)).to.have.lengthOf(1);
    expect(autoComplete).to.have.lengthOf(1);
    expect(autoComplete.props().value).to.equal("fr");
    expect(textFields.at(1).props().name).to.equal("name.fr");
    expect(textFields.at(2).props().name).to.equal("description.fr");
  });
});
