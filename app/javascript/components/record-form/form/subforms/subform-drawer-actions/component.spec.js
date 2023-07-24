import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import ActionButton from "../../../../action-button";

import SubformDrawerActions from "./component";

describe("<RecordForm>/form/subforms/subform-fields/<SubformDrawerActions>", () => {
  const props = {
    showActions: (
      <>
        <ActionButton text="Create Button" />
      </>
    ),
    editActions: (
      <>
        <ActionButton text="Save Button" />
      </>
    )
  };

  describe("when mode is show", () => {
    it("renders the show actions", () => {
      mountedComponent(<SubformDrawerActions {...props} isShow />, fromJS({}));

      expect(screen.queryByText("Create Button")).toBeTruthy();
      expect(screen.queryByText("Save Button")).toBeFalsy();
    });
  });

  describe("when mode is not show", () => {
    it("renders the edit actions", () => {
      mountedComponent(<SubformDrawerActions {...props} />, fromJS({}));

      expect(screen.queryByText("Save Button")).toBeTruthy();
      expect(screen.queryByText("Create Button")).toBeFalsy();
    });
  });
});
