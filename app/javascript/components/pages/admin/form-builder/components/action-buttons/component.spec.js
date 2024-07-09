import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import FormBuilderActionButtons from "./component";

describe("<FormBuilderActionButtons />", () => {
  const initialState = fromJS({});
  const props = {
    formMode: fromJS({ isNew: true }),
    formRef: {},
    handleCancel: () => {}
  };

  beforeEach(() => {
    mountedComponent(<FormBuilderActionButtons {...props} />, initialState);
  });

  it("renders the FormBuilderActionButtons", () => {
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    expect(screen.getByText("buttons.save")).toBeInTheDocument();
  });
});
