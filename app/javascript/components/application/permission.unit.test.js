import React from "react";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import { ACTIONS, RESOURCES } from "../../libs/permissions";
import { ROUTES } from "../../config";

import Permission from "./permission";

describe("<Permission />", () => {
  let component;
  const props = {
    resources: RESOURCES.cases,
    actions: ACTIONS.READ,
    children: <div />,
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
    beforeEach(() => {
      ({ component } = setupMountedComponent(Permission, props, initialState));
    });

    it("renders Permission", () => {
      expect(component.find(Permission)).to.have.lengthOf(1);
    });

    it("renders div", () => {
      expect(component.find("div")).to.have.lengthOf(1);
    });
  });

  describe("When User doesn't have permission", () => {
    const actions = "write";

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Permission,
        {
          ...props,
          actions
        },
        initialState
      ));
    });

    it("renders Permission", () => {
      expect(component.find(Permission)).to.have.lengthOf(1);
    });

    it("doesn't render children", () => {
      expect(component).to.be.empty;
    });
  });

  describe("When url is present", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Permission,
        {
          actions: ACTIONS.READ,
          children: <div />,
          match: {
            url: ROUTES.cases
          }
        },
        initialState
      ));
    });

    it("doesn't render children", () => {
      expect(component).to.be.empty;
    });
  });

  describe("When having multiple resources", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Permission,
        {
          resources: [RESOURCES.cases, RESOURCES.incidents],
          actions: [ACTIONS.READ, ACTIONS.EXPORT_EXCEL],
          children: <div />,
          match: {
            url: "/cases"
          }
        },
        initialState
      ));
    });

    it("renders children", () => {
      expect(component.find(Permission)).to.have.lengthOf(1);
    });
  });

  describe("When doesn't has the exact permissions", () => {
    const wrongPermissionsProps = {
      resources: RESOURCES.dashboards,
      actions: ACTIONS.DASH_WORKFLOW_TEAM,
      children: <h1>Test</h1>
    };
    const initialStateDashboad = fromJS({
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_WORKFLOW, ACTIONS.DASH_CASE_RISK]
        }
      }
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Permission,
        wrongPermissionsProps,
        initialStateDashboad
      ));
    });

    it("doesn't render children", () => {
      expect(component.find("h1")).to.be.empty;
    });
  });
});
