import { setupMockFormComponent, expect, spy, stub } from "../../../test";

import Panel from "./panel";

describe("<IndexFilters />/<Panel />", () => {
  let props;

  beforeEach(() => {
    props = {
      filter: {
        field_name: "filter1",
        name: "filter1",
        options: [{ id: "true", display_name: "Filter 1" }],
        type: "checkbox"
      },
      getValues: stub(),
      handleReset: spy(),
      children: "Child Component"
    };
  });

  it("renders children", () => {
    const { component } = setupMockFormComponent(Panel, props);

    expect(component.contains("Child Component")).to.be.true;
  });

  it("opens if field has value", () => {
    props.getValues.returns({ filter1: "option-1" });
    const { component } = setupMockFormComponent(Panel, props);

    expect(
      component
        .find("Panel")
        .childAt(0)
        .prop("expanded")
    ).to.be.true;
  });

  it("closes if field has value on click", () => {
    props.getValues.returns({ filter1: "option-1" });
    const { component } = setupMockFormComponent(Panel, props);

    component.find("Panel button").simulate("click");
    expect(
      component
        .find("Panel")
        .childAt(0)
        .prop("expanded")
    ).to.be.false;
  });

  it("resets field value", () => {
    const { component } = setupMockFormComponent(Panel, props);

    component.find("button[aria-label='buttons.delete']").simulate("click");

    expect(props.handleReset).to.have.been.calledOnce;
  });
});
