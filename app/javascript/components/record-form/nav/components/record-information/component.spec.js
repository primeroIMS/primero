import { fromJS } from "immutable";
import { Route } from "react-router-dom";

import { mountedComponent, screen, setScreenSizeToMobile } from "../../../../../test-utils";
import { SHOW_APPROVALS, VIEW_INCIDENTS_FROM_CASE } from "../../../../permissions";

import RecordInformation from "./component";

describe("<RecordInformation />", () => {
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
    setScreenSizeToMobile(false);
    // eslint-disable-next-line react/display-name
    function RoutedComponent(initialProps) {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)/:id"
          component={propsRoute => <RecordInformation {...{ ...propsRoute, ...initialProps }} />}
        />
      );
    }

    mountedComponent(<RoutedComponent {...props} />, initialState, {}, ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]);
  });

  it("renders a RecordInformation component />", () => {
    expect(screen.getByTestId("record-information")).toBeInTheDocument();
  });

  it("renders a NavItem component />", () => {
    expect(screen.getAllByRole("button")).toHaveLength(8);
  });
});
