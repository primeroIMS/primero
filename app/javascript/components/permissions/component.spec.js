import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import Permission from "./component";

import { ACTIONS, RESOURCES } from ".";
import { ROUTES } from "../../config";

describe("<Permission />", () => {

  const props = {
    resources: RESOURCES.cases,
    actions: ACTIONS.READ,
    children: <div data-testid="child-node" />,
    match: {
      isExact: true,
      params: { recordType: RESOURCES.cases },
      path: "/:recordType(cases|incidents|tracing_requests)",
      url: ROUTES.cases
    }
  };

  const initialState = fromJS({
    user: {
      permissions: {
        cases: [ACTIONS.READ]
      }
    }
  });

  describe("When User have permission", () => {

    it("renders Permission", () => {
        mountedComponent(<Permission {...props} />,initialState)
      expect(screen.getByTestId('child-node')).toBeInTheDocument()
    });

    it("renders div", () => {
        mountedComponent(<Permission {...props} />,initialState)
        expect(screen.getByTestId('child-node')).toBeInTheDocument()
    });
  });

  describe("When User doesn't have permission", () => {
    const actions = "write";

    const userProps = {
        ...props,
        actions
    }

    it("renders Permission", () => {
        mountedComponent(<Permission {...userProps} />,initialState)
        expect(screen.queryByTestId('child-node')).toBeNull()
    });

    it("doesn't render children", () => {
        mountedComponent(<Permission {...userProps} />,initialState)
        expect(screen.queryByTestId('child-node')).toBeNull()
    });
  });

  describe("When url is present", () => {
    const urlProps ={
        actions: ACTIONS.READ,
        children: <div  />,
        match: {
          url: ROUTES.cases
        }
      };

    it("doesn't render children", () => {
        mountedComponent(<Permission {...urlProps} />,initialState)
        expect(screen.queryByTestId('child-node')).toBeNull()
    });
  });

  describe("When having multiple resources", () => {

    const multipleProps = {
        resources: [RESOURCES.cases, RESOURCES.incidents],
        actions: [ACTIONS.READ, ACTIONS.EXPORT_EXCEL],
        children: <div data-testid="child-node" />,
        match: {
          url: "/cases"
        }
      }

    it("renders children", () => {
          mountedComponent(<Permission {...multipleProps} />,initialState)
        expect(screen.getByTestId('child-node')).toBeInTheDocument()
    
    });
  });

  describe("When doesn't has the exact permissions", () => {
    const wrongPermissionsProps = {
      resources: RESOURCES.dashboards,
      actions: ACTIONS.DASH_WORKFLOW_TEAM,
      children: <h1 data-testid="child-node">Test</h1>
    };
    const initialStateDashboad = fromJS({
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_WORKFLOW, ACTIONS.DASH_CASE_RISK]
        }
      }
    });

    it("doesn't render children", () => {
        mountedComponent(<Permission {...wrongPermissionsProps} />, initialStateDashboad)
        expect(screen.queryByTestId('child-node')).toBeNull()
    });
  });
});
