import { fromJS, Map } from "immutable";
import { mountedComponent, screen, setScreenSizeToMobile } from "test-utils";

import { PrimeroModuleRecord } from "../../../application/records";

import WorkflowIndicator from "./workflow-indicator";

describe("<WorkflowIndicator />", () => {
  beforeAll(() => {
    setScreenSizeToMobile(false);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const defaultProps = {
    locale: "en",
    primeroModule: "primeromodule-cp",
    recordType: "cases"
  };

  const state = Map({
    user: fromJS({
      modules: ["primeromodule-cp"]
    }),
    application: fromJS({
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          workflows: {
            case: [
              {
                id: "new",
                display_text: { en: "New" }
              },
              {
                id: "reopened",
                display_text: { en: "Reopened" }
              },
              {
                id: "services",
                display_text: { en: "Services" }
              },
              {
                id: "closed",
                display_text: { en: "Closed" }
              }
            ]
          }
        })
      ]
    })
  });

  it("renders status reopened if case has been reopened", () => {
    const reopendProps = {
      ...defaultProps,
      record: Map({ case_status_reopened: true, workflow: "service" })
    };

    mountedComponent(<WorkflowIndicator {...reopendProps} />, state);

    expect(screen.getByText("Reopened")).toBeInTheDocument();
  });

  describe("when the mobile is displayed", () => {
    jest.spyOn(window, "matchMedia").mockReturnValue(window.defaultMediaQueryList({ matches: true }));
    const workflowProps = {
      ...defaultProps,
      record: Map({ case_status_reopened: false, workflow: "services" })
    };

    it("renders the smaller workflow indicator", () => {
      setScreenSizeToMobile(true);
      mountedComponent(<WorkflowIndicator {...workflowProps} />, state);
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.queryAllByTestId("badge")).toHaveLength(1);
      setScreenSizeToMobile(false);
    });

    it("should not render the workflow indicator if the module does not support workflows", () => {
      const notWorkflowProps = {
        ...defaultProps,
        record: Map({ case_status_reopened: false })
      };

      mountedComponent(
        <WorkflowIndicator {...notWorkflowProps} />,
        state.setIn(
          ["application", "modules"],
          fromJS([
            PrimeroModuleRecord({
              unique_id: "primeromodule-cp"
            })
          ])
        )
      );

      expect(screen.queryAllByTestId("badge")).toHaveLength(0);
      expect(screen.queryAllByTestId("step")).toHaveLength(0);
    });
  });

  describe("when case is closed", () => {
    it("renders closed step as active", () => {
      const reopenedProps = {
        ...defaultProps,
        record: Map({ status: "closed", workflow: "reopened" })
      };

      mountedComponent(<WorkflowIndicator {...reopenedProps} />, state);
      expect(screen.getByText("Closed")).toBeInTheDocument();
      expect(screen.getByText("Closed")).toHaveClass("styleLabelActive");
    });
  });
});
