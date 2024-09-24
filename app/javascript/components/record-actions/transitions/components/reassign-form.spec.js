// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, List, fromJS } from "immutable";

// import { getUsersByTransitionType } from "../selectors";
import { mountedComponent, screen } from "../../../../test-utils";

import ReassignForm from "./reassign-form";

describe("<ReassignForm />", () => {
  const record = Map({ id: "123abc" });
  const initialState = Map({
    transitions: Map({
      reassign: Map({
        users: List([{ user_name: "primero" }])
      })
    })
  });
  const props = {
    recordType: "cases",
    record,
    handleClose: () => {}
  };

  beforeEach(() => {
    mountedComponent(<ReassignForm {...props} />, initialState);
  });

  it("renders SearchableSelect", () => {
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument();
  });

  it("renders Field", () => {
    expect(document.querySelectorAll(".field")).toHaveLength(2);
  });

  describe("with getUsersByTransitionType", () => {
    describe("when mounting component", () => {
      const state = fromJS({
        records: {
          transitions: {
            reassign: {
              users: [{ user_name: "primero" }, { user_name: "primero_cp" }]
            }
          }
        }
      });
      // const values = getUsersByTransitionType(state, "reassign");

      beforeEach(() => {
        mountedComponent(
          <ReassignForm
            {...{
              record,
              handleClose: () => {},
              recordType: "cases"
            }}
          />,

          state
        );
      });
      // Unit test was skipped pre migration to jest.
      it.skip("should have same no. of users", () => {
        // component.find(ReassignForm).find("input").first().simulate("keyDown", {
        //   key: "ArrowDown",
        //   keyCode: keydown.DOM_VK_DOWN
        // });
        // expect(component.find("div.MuiButtonBase-root.MuiListItem-root")).to.have.lengthOf(values.size);
      });
    });
  });
});
