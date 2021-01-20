import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FormSectionField } from "../record-form";
import ActionButton from "../action-button";

import { MatchesForm } from "./components";
import Summary from "./component";

describe("<Summary />", () => {
  let component;
  const props = {
    record: fromJS({}),
    recordType: "case",
    mobileDisplay: false,
    handleToggleNav: () => {},
    form: {},
    mode: { isNew: false }
  };
  const formProps = {
    initialValues: {
      name: ""
    }
  };
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(Summary, props, initialState, [], formProps));
  });

  it("should render a <RecordFormTitle /> component", () => {
    expect(component.find(RecordFormTitle)).to.have.lengthOf(1);
  });

  it("should render a <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(3);
  });

  it("should render 5 <FormSectionField /> components", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(5);
  });

  it("should render 1 <MatchesForm /> components", () => {
    expect(component.find(MatchesForm)).to.have.lengthOf(1);
  });
});
