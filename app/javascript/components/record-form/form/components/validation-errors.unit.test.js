import { fromJS } from "immutable";

import { ENQUEUE_SNACKBAR } from "../../../notifier";
import { setupMountedComponent } from "../../../../test";

import ValidationErrors from "./validation-errors";

describe("<ValidationErrors />", () => {
  let component;
  const initialState = fromJS({ forms: {} });

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      ValidationErrors,
      {
        forms: fromJS([{ unique_id: "form_1" }]),
        formErrors: { field_1: "This field is required" }
      },
      initialState
    ));
  });

  it("dispatches a snackbar notification when the form has errors", () => {
    expect(
      component
        .props()
        .store.getActions()
        .filter(action => action.type === ENQUEUE_SNACKBAR)
    ).to.have.lengthOf(1);
  });
});
