import { fromJS } from "immutable";
import { screen, mountedFormComponent } from "test-utils";

import ChangePassword from "./component";

describe("<ChangePassword /> - Component", () => {
  const props = {
    formMode: fromJS({ isEdit: true }),
    i18n: { t: value => value },
    open: true,
    pending: false,
    setOpen: () => {},
    commonInputProps: {
      label: "Test label"
    },
    parentFormMethods: {
      setValue() {}
    }
  };

  beforeEach(() => {
    mountedFormComponent(<ChangePassword {...props} />);
  });

  it("should render 2 ActionDialog components", () => {
    expect(screen.getAllByTestId("action-dialog")).toHaveLength(2);
  });

  it("should render 1 form", () => {
    expect(document.querySelector("#change-password-form")).toBeInTheDocument();
  });
});
