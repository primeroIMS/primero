import { fromJS } from "immutable";
import { Tooltip } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FormSectionField } from "../record-form";
import ActionButton from "../action-button";
import SubformDrawer from "../record-form/form/subforms/subform-drawer";

import { FIELD_NAMES } from "./constants";
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

  it("should render 3 <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(3);
  });

  it("should render 5 <FormSectionField /> components", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(5);
  });

  it("should render 2 <SubformDrawer /> components", () => {
    expect(component.find(SubformDrawer)).to.have.lengthOf(2);
  });

  context("when consent_for_tracing is not set", () => {
    let comp;

    beforeEach(() => {
      ({ component: comp } = setupMountedComponent(Summary, props, initialState, [], formProps));
    });

    it("should render a tooltip for the find match button", () => {
      expect(comp.find(ActionButton).find(Tooltip)).to.have.lengthOf(1);
    });

    it("should disable the find match button", () => {
      const findMatchButton = comp
        .find(ActionButton)
        .findWhere(elem => elem.text() === "cases.summary.find_match")
        .first();

      expect(findMatchButton.props().rest.disabled).to.be.true;
    });
  });

  context("when consent_for_tracing is set to true", () => {
    let comp;

    beforeEach(() => {
      ({ component: comp } = setupMountedComponent(
        Summary,
        { ...props, values: { [FIELD_NAMES.consent_for_tracing]: true } },
        initialState,
        [],
        formProps
      ));
    });

    it("should not render a tooltip for the find match button", () => {
      expect(comp.find(ActionButton).find(Tooltip)).to.have.lengthOf(0);
    });

    it("should enable the find match button", () => {
      const findMatchButton = comp
        .find(ActionButton)
        .findWhere(elem => elem.text() === "cases.summary.find_match")
        .first();

      expect(findMatchButton.props().rest.disabled).to.be.false;
    });
  });

  context("when is new record", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Summary,
        { ...props, mode: { isNew: true } },
        initialState,
        [],
        formProps
      ));
    });

    it("should not dispatch fetchmatchedTraces", () => {
      const calls = component.props().store.getActions();

      expect(calls).to.have.lengthOf(0);
    });
  });
});
