import { Formik } from "formik";
import { TextField } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import { DATE_FIELD } from "../../../form";
import { FieldRecord } from "../../records";

import DateField from "./date-field";

describe("<DateField />", () => {
  context("when is date of birth field", () => {
    const props = {
      field: FieldRecord({
        name: "date_of_birth",
        type: DATE_FIELD,
        display_name_en: "Text test field"
      }),
      formik: {
        values: []
      },
      label: "Date of birth",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "date_of_birth"
    };

    context("and the age field is visible", () => {
      let component;
      const formProps = { initialValues: { date_of_birth: null } };

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          DateField,
          { ...props, formSection: { fields: [{ name: "age", visible: true }] } },
          {},
          [],
          formProps
        ));
      });

      it("should set the age field", () => {
        component.find(TextField).simulate("click");
        component.find(".MuiPickersDay-day").first().simulate("click");
        component.find(".MuiButton-textPrimary").last().simulate("click");

        expect(component.find(Formik).state().values.age).to.equal(0);
      });
    });

    context("and the age field is not visible", () => {
      let component;
      const formProps = { initialValues: { date_of_birth: null } };

      beforeEach(() => {
        ({ component } = setupMountedComponent(DateField, props, {}, [], formProps));
      });

      it("should not set the age field", () => {
        component.find(TextField).simulate("click");
        component.find(".MuiPickersDay-day").first().simulate("click");
        component.find(".MuiButton-textPrimary").last().simulate("click");

        expect(component.find(Formik).state().values).to.not.have.property("age");
      });
    });
  });
});
