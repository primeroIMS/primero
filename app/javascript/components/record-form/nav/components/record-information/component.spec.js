import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import { SHOW_APPROVALS, VIEW_INCIDENTS_FROM_CASE } from "../../../../permissions";

import RecordInformation from "./component";

describe("<RecordInformation />", () => {

  const props = {
    open: "record_information",
    handleClick: () => { },
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

  it("renders a RecordInformation component />", () => {
    mountedComponent(<RecordInformation {...props} />, initialState, ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]);
    expect(screen.getByTestId("list-item")).toBeInTheDocument();
  });

  it("renders a NavGroup component />", () => {
    mountedComponent(<RecordInformation {...props} />, initialState, ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]);
    expect(screen.getByText("forms.record_types.record_information")).toBeInTheDocument();
  });

  it("renders a NavItem component />", () => {
    mountedComponent(<RecordInformation {...props} />, initialState, ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]);
    expect(screen.queryByTestId("nav-item")).toBeNull();
  });
});
