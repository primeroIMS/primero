import { fromJS } from "immutable";

import { ENQUEUE_SNACKBAR } from "../../../notifier";
import { setupMountedComponent } from "../../../../test";

import ValidationErrors from "./validation-errors";

describe("<ValidationErrors />", () => {
  const initialState = fromJS({ forms: {} });

  it("dispatches a snackbar notification when the form has errors", () => {
    const { component } = setupMountedComponent(
      ValidationErrors,
      {
        forms: fromJS([{ unique_id: "form_1" }]),
        formErrors: { field_1: "This field is required" }
      },
      initialState
    );

    expect(
      component
        .props()
        .store.getActions()
        .filter(action => action.type === ENQUEUE_SNACKBAR)
    ).to.have.lengthOf(1);
  });

  it("should not dispatch a snackbar notification if subform does not have error", () => {
    const { component } = setupMountedComponent(
      ValidationErrors,
      {
        forms: fromJS([{ unique_id: "form_1" }]),
        formErrors: { subform_section_1: [] }
      },
      initialState
    );

    expect(
      component
        .props()
        .store.getActions()
        .filter(action => action.type === ENQUEUE_SNACKBAR)
    ).to.have.lengthOf(0);
  });
});
