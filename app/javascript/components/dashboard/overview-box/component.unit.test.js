import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";

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
          query: [
            "owned_by=primero",
            "record_state=true",
            "status=open",
            "approval_status_closure=pending"
          ]
        }
      }
    }),
    sumTitle: "Closure"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(OverviewBox, props, {}));
  });

  it("renders a component/>", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(1);
    expect(component.find("li")).to.have.lengthOf(2);
    expect(component.find("button")).to.have.lengthOf(1);
    expect(
      component
        .find("li")
        .first()
        .text()
    ).to.be.equal("5 Closure");
  });

  describe("when withTotal props is false", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        OverviewBox,
        { ...props, withTotal: false },
        {}
      ));
    });
    it("renders the header without total/>", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(2);
      expect(component.find("button")).to.have.lengthOf(1);
      expect(
        component
          .find("li")
          .first()
          .text()
      ).to.be.equal("Closure");
    });
  });
});
