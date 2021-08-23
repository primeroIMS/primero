import { Route } from "react-router-dom";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";
import NavGroup from "../nav-group";
import NavItem from "../nav-item";
import { SHOW_APPROVALS, VIEW_INCIDENTS_FROM_CASE } from "../../../../../libs/permissions";

import RecordInformation from "./component";

describe("<RecordInformation />", () => {
  let component;

  const props = {
    open: "record_information",
    handleClick: () => {},
    selectedForm: "",
    formGroupLookup: []
  };

  const initialState = fromJS({
    user: {
      permissions: {
        cases: [...SHOW_APPROVALS, ...VIEW_INCIDENTS_FROM_CASE]
      }
    }
  });

  beforeEach(() => {
    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)/:id"
          component={propsRoute => <RecordInformation {...{ ...propsRoute, ...initialProps }} />}
        />
      );
    };

    ({ component } = setupMountedComponent(routedComponent, props, initialState, [
      "/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"
    ]));
  });

  it("renders a RecordInformation component />", () => {
    expect(component.find(RecordInformation)).to.have.lengthOf(1);
  });

  it("renders a NavGroup component />", () => {
    expect(component.find(NavGroup)).to.have.lengthOf(1);
  });

  it("renders a NavItem component />", () => {
    expect(component.find(NavGroup).find("ul").find(NavItem)).to.have.lengthOf(6);
  });

  it("renders component with valid props", () => {
    const componentsProps = { ...component.find(RecordInformation).props() };

    ["open", "handleClick", "selectedForm", "formGroupLookup", "match", "history", "location", "staticContext"].forEach(
      property => {
        expect(componentsProps).to.have.property(property);
        delete componentsProps[property];
      }
    );
    expect(componentsProps).to.be.empty;
  });
});
