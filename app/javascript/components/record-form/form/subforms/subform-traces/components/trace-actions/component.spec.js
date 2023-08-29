import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../../test-utils";
import { SHOW_FIND_MATCH } from "../../../../../../permissions";
import { FORMS } from "../../constants";

import TraceActions from "./component";

describe("<RecordForm>/form/subforms/<TraceActions>", () => {
  const props = { handleBack: () => {}, handleConfirm: () => {}, selectedForm: FORMS.trace, mode: { isEdit: false } };

  it("should not render find match button if user does not have permission", () => {
    mountedComponent(<TraceActions {...props} />, fromJS([]));
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByText(/tracing_request.back_to_traces/i)).toBeInTheDocument();
  });

  it("should render find match button if user has permission", () => {
    mountedComponent(
      <TraceActions {...props} />,
      fromJS({
        user: { permissions: { tracing_requests: SHOW_FIND_MATCH } }
      })
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText(/tracing_request.find_match/i)).toBeInTheDocument();
  });

  it("should render comparison actions", () => {
    mountedComponent(<TraceActions {...{ ...props, selectedForm: FORMS.comparison }} />, fromJS({}));
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText(/tracing_request.back_to_potential_matches/i)).toBeInTheDocument();
    expect(screen.getByText(/tracing_request.match/i)).toBeInTheDocument();
  });
});
