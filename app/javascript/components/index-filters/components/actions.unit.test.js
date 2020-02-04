import { setupMockFormComponent, expect, spy } from "../../../test";

import Actions from "./actions";

describe("<IndexFilters />/<Actions />", () => {
  let props;

  beforeEach(() => {
    props = {
      handleSave: spy(),
      handleClear: spy()
    };
  });

  it("renders 3 action buttons", () => {
    const { component } = setupMockFormComponent(Actions, props);

    expect(component.find("button")).to.be.lengthOf(3);
  });

  it("triggers handleSave()", () => {
    const { component } = setupMockFormComponent(Actions, props);

    component
      .find("button")
      .at(1)
      .simulate("click");
    expect(props.handleSave).to.have.been.calledOnce;
  });

  it("triggers handleClear()", () => {
    const { component } = setupMockFormComponent(Actions, props);

    component
      .find("button")
      .at(2)
      .simulate("click");
    expect(props.handleClear).to.have.been.calledOnce;
  });
});
