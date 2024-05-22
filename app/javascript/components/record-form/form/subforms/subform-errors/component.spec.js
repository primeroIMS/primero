import { mountedComponent, screen } from "../../../../../test-utils";

import SubformErrors from "./component";

describe("<SubformErrors />", () => {
  const setters = { setErrors: () => {}, setTouched: () => {} };

  it("should render an InternalAlert if there are initialErrors", () => {
    const initialErrorsProps = { initialErrors: { field_1: "required" }, ...setters };

    mountedComponent(<SubformErrors {...initialErrorsProps} />, {});
    expect(screen.getByTestId("internal-alert")).toBeInTheDocument();
  });

  it("should render an InternalAlert if there are errors", () => {
    const errorsProps = { errors: { field_1: "required" }, ...setters };

    mountedComponent(<SubformErrors {...errorsProps} />, {});
    expect(screen.getByTestId("internal-alert")).toBeInTheDocument();
  });
});
