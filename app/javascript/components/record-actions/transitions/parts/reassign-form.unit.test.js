import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Button } from "@material-ui/core";
import { Formik, Field, Form } from "formik";
import { SearchableSelect } from "components/searchable-select";
import { Map, List } from "immutable";
import ReassignForm from "./reassign-form";
import { getUsersByTransitionType } from "../selectors";

describe("<ReassignForm />", () => {
  let component;
  const record = Map({ id: "123abc" });
  const initialState = Map({
    transitions: Map({
      reassign: Map({
        users: List([{ user_name: "primero" }])
      })
    })
  });
  const props = {
    record,
    handleClose: () => {}
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReassignForm, props, initialState));
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.length(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.length(1);
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(2);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });

  describe("with getUsersByTransitionType", () => {
    describe("when mounting component", () => {
      const state = Map({
        transitions: Map({
          reassign: Map({
            users: [{ user_name: "primero" }, { user_name: "primero_cp" }]
          })
        })
      });
      const values = getUsersByTransitionType(state, "reassign");
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          ReassignForm,
          {
            record,
            handleClose: () => {}
          },
          state
        ));
      });
      it("should have same no. of users", () => {
        component
          .find(ReassignForm)
          .find("input")
          .first()
          .simulate("mouseDown", {
            button: 0,
            menuIsOpen: true
          });
        expect(
          component.find("div.MuiButtonBase-root.MuiListItem-root").length
        ).to.equal(values.length);
      });
    });
  });
});
