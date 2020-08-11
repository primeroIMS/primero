import InternalAlert from "../../../../internal-alert";
import { setupMountedComponent } from "../../../../../test";

import SubformErrors from "./component";

describe("<SubformErrors />", () => {
  const setters = { setErrors: () => {}, setTouched: () => {} };

  it("should render an InternalAlert if there are initialErrors", () => {
    const { component } = setupMountedComponent(
      SubformErrors,
      { initialErrors: { field_1: "required" }, ...setters },
      {}
    );

    expect(component.find(InternalAlert)).lengthOf(1);
  });

  it("should render an InternalAlert if there are errors", () => {
    const { component } = setupMountedComponent(SubformErrors, { errors: { field_1: "required" }, ...setters }, {});

    expect(component.find(InternalAlert)).lengthOf(1);
  });
});
