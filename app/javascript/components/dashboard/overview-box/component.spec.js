import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";
import OverviewBox from "./component";

describe("<OverviewBox />", () => {
  let component;
  const props = {
    items: fromJS({
      name: "dashboard.approvals_closure",
      type: "indicator",
      indicators: {
        approval_closure_pending: {
          count: 5,
          query: ["owned_by=primero", "record_state=true", "status=open", "approval_status_closure=pending"]
        }
      }
    }),
    sumTitle: "Closure"
  };

  beforeEach(() => {
    // ({ component } = setupMountedComponent(OverviewBox, props, {}));
    mountedComponent(<OverviewBox {...props} />);
  });

  it("renders a component/>", () => {
    // expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2)
    const sectionTitle = screen.getByText("5 Closure");
    expect(sectionTitle).toBeVisible();
    expect(sectionTitle.textContent).toContain('Closure');

  });

  describe("when withTotal props is false", () => {
    beforeEach(() => {
      // ({ component } = setupMountedComponent(OverviewBox, { ...props, withTotal: false }, {}));
      mountedComponent(<OverviewBox {...props} withTotal={false} />);
    });
    it("renders the header without total/>", () => {
        expect(screen.getAllByRole("button")).toHaveLength(4)
      const sectionTitle = screen.getByText("5 Closure");
      expect(sectionTitle).toBeVisible();
      expect(sectionTitle.textContent).toContain('Closure');
    });
  });

  describe("When data still loading", () => {
    const loadingProps = {
      items: fromJS({
        name: "dashboard.approvals_closure",
        type: "indicator",
        indicators: {}
      }),
      sumTitle: "Closure",
      loading: true
    };

    it("renders BadgedIndicator component", () => {
      mountedComponent(<OverviewBox {...loadingProps}  />)
      expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    });
    it("renders CircularProgress", () => {
      mountedComponent(<OverviewBox {...loadingProps}  />)
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("When the approvals labels entries are present", () => {
    // context("when is a Assessment approvals", () => {
    const ASSESSMENT_LABEL = "Assessment";
    const propsApprovals = {
      items: fromJS({
        name: "dashboard.approvals_closure",
        type: "indicator",
        indicators: {
          approval_assessment_pending_group: {
            count: 1,
            query: ["record_state=true", "status=open", "approval_status_assessment=pending"]
          }
        }
      }),
      sumTitle: "Pending Approvals"
    };
    const initialState = fromJS({
      application: {
        approvalsLabels: {
          assessment: {
            en: ASSESSMENT_LABEL
          }
        }
      }
    });

    beforeEach(() => {
      // ({ component } = setupMountedComponent(OverviewBox, propsApprovals, initialState));
      mountedComponent(<OverviewBox {...propsApprovals} />, { initialState });
    });

    it("renders a component with its respective label />", () => {
      expect(screen.getByRole(`1${ASSESSMENT_LABEL}`)).toBeInTheDocument();
    });
    // });

    // context("when is GBV Closure approvals", () => {
    const GBV_CLOSURE = "GBV Closure";
    const propsApprovals_ = {
      items: fromJS({
        name: "dashboard.approvals_gbv_closure",
        type: "indicator",
        indicators: {
          approval_gbv_closure_pending_group: {
            count: 1,
            query: ["record_state=true", "status=open", "approval_status_gbv_closure=pending"]
          }
        }
      }),
      sumTitle: "Pending Approvals"
    };
    const initialState_ = fromJS({
      application: {
        approvalsLabels: {
          gbv_closure: {
            en: GBV_CLOSURE
          }
        }
      }
    });

    beforeEach(() => {
      // ({ component } = setupMountedComponent(OverviewBox, propsApprovals, initialState));
      mountedComponent(<OverviewBox {...propsApprovals_} />, { initialState_ });
    });

    it("renders a component with its respective label />", () => {
      // expect(component.text()).to.contain(`1${GBV_CLOSURE}`);
      expect(screen.getByRole(`1${GBV_CLOSURE}`)).toBeInTheDocument();
    });
  });
  // });
});
