import { fromJS } from "immutable";
import { InputLabel, FormHelperText } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import { RECORD_PATH } from "../../../../config";
import ActionButton from "../../../action-button";

import SearchPrompt from "./component";

describe("<SearchPrompt />", () => {
  let component;
  const props = {
    i18n: { t: value => value },
    onCloseDrawer: () => {},
    recordType: RECORD_PATH.cases,
    setOpenConsentPrompt: () => {},
    setSearchValue: () => {},
    goToNewCase: () => {},
    dataProtectionFields: [],
    onSearchCases: () => {}
  };

  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(SearchPrompt, props, initialState));
  });

  it("should render a <InputLabel /> component", () => {
    expect(component.find(InputLabel)).to.have.lengthOf(1);
  });

  it("should render a <FormHelperText /> component", () => {
    const searchHelperText = component.find(FormHelperText);

    expect(searchHelperText).to.have.lengthOf(1);
    expect(searchHelperText.text()).to.be.equals("case.search_helper_text");
  });

  it("should render a form component", () => {
    expect(component.find("form")).to.have.lengthOf(1);
  });

  it("should render a <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
