import React from "react";
import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "./../../test";
import { PERMISSION_CONSTANTS } from "./../../libs/permissions";

import Permission from "./permission";

describe("<Permission />", () => {
  let component;
  const props = {
    permissionType: "cases",
    permission: PERMISSION_CONSTANTS.READ,
    children: <div />,
    match: {
      isExact: true,
      params: { recordType: "cases" },
      path: "/:recordType(cases|incidents|tracing_requests)",
      url: "/cases"
    }
  };

  const initialState = fromJS({
    user: {
      permissions: {
        cases: [PERMISSION_CONSTANTS.READ]
      }
    }
  });

  describe("When User have permission", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(Permission, props, initialState));
    });

    it("renders Permission", () => {
      expect(component.find(Permission)).to.have.length(1);
    });

    it("renders div", () => {
      expect(component.find("div")).to.have.length(1);
    });
  });

  describe("When User doesn't have permission", () => {
    const permission = "write";
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Permission,
        {
          ...props,
          permission
        },
        initialState
      ));
    });

    it("renders Permission", () => {
      expect(component.find(Permission)).to.have.length(1);
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
          permission: "read",
          children: <div />,
          match: {
            url: "/cases"
          }
        },
        initialState
      ));
    });

    it("doesn't render children", () => {
      expect(component).to.be.empty;
    });
  });
});
