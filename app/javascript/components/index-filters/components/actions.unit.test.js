import { Button } from "@material-ui/core";

import { setupMockFormComponent, expect, spy } from "../../../test";

import Actions from "./actions";

describe("<IndexFilters />/<Actions />", () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      handleSave: spy(),
      handleClear: spy()
    };

    state = {
      application: { online: true }
    };
  });

  it("renders 3 action buttons", () => {
    const { component } = setupMockFormComponent(Actions, props);

    expect(component.find("button")).to.be.lengthOf(3);
  });

  it("triggers handleSave()", () => {
    const { component } = setupMockFormComponent(Actions, props, {}, state);

    component.find("button").at(1).simulate("click");
    expect(props.handleSave).to.have.been.calledOnce;
  });

  it("triggers handleClear()", () => {
    const { component } = setupMockFormComponent(Actions, props, {}, state);

    component.find("button").at(2).simulate("click");
    expect(props.handleClear).to.have.been.calledOnce;
  });

  it("renders 'Apply' button", () => {
    const { component } = setupMockFormComponent(Actions, props, {}, state);

    expect(component.find("button").at(0).text()).to.be.equal(
      "filters.apply_filters"
    );
  });

  describe("when handleSave is not part of the props", () => {
    const newProps = {
      handleClear: () => {}
    };

    it("should render two buttons", () => {
      const { component } = setupMockFormComponent(
        Actions,
        newProps,
        {},
        state
      );

      expect(component.find(Button)).to.have.lengthOf(2);
    });
    it("should render 'Apply' button", () => {
      const { component } = setupMockFormComponent(
        Actions,
        newProps,
        {},
        state
      );

      expect(component.find("button").at(0).text()).to.be.equal(
        "filters.apply_filters"
      );
    });
    it("should render 'Clear' button", () => {
      const { component } = setupMockFormComponent(
        Actions,
        newProps,
        {},
        state
      );

      expect(component.find("button").at(1).text()).to.be.equal(
        "filters.clear_filters"
      );
    });
    it("should not render 'Save' button", () => {
      const { component } = setupMockFormComponent(
        Actions,
        newProps,
        {},
        state
      );

      expect(component.find("button").at(0).text()).to.not.be.equal(
        "filters.save_filters"
      );
    });
  });
});
