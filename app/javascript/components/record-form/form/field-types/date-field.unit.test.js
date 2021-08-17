import { Formik } from "formik";
import { TextField } from "@material-ui/core";
import { isEqual, parseISO } from "date-fns";

import { DEFAULT_DATE_VALUES } from "../../../../config";
import { setupMountedComponent, useFakeTimers } from "../../../../test";
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

  context("when is date field with a default value", () => {
    let clock = null;

    const props = {
      field: FieldRecord({
        name: "date_of_interview",
        type: DATE_FIELD,
        display_name_en: "Date of Interview",
        selected_value: DEFAULT_DATE_VALUES.TODAY
      }),
      formik: {
        values: []
      },
      label: "Date of Interview",
      name: "date_of_interview"
    };

    const formProps = { initialValues: {} };

    beforeEach(() => {
      const today = parseISO("2010-01-05T18:30:00Z");

      clock = useFakeTimers(today);
    });

    afterEach(() => {
      clock.restore();
    });

    it("should set the default value if the mode is new", () => {
      const { component } = setupMountedComponent(
        DateField,
        {
          ...props,
          mode: { isNew: true }
        },
        {},
        [],
        formProps
      );

      expect(isEqual(component.find(Formik).state().values.date_of_interview, new Date())).to.be.true;
    });

    it("should clear the current value if the mode is new and the clear button is clicked", () => {
      const { component } = setupMountedComponent(
        DateField,
        {
          ...props,
          mode: { isNew: true }
        },
        {},
        [],
        formProps
      );

      component.find(TextField).simulate("click");

      component
        .find(".MuiButton-text")
        .findWhere(node => node.text() === "buttons.clear")
        .first()
        .simulate("click");

      expect(component.find(Formik).state().values.date_of_interview).to.be.null;
    });

    it("should not set the default value if the mode is not new", () => {
      const { component } = setupMountedComponent(
        DateField,
        {
          ...props,
          mode: { isEdit: true }
        },
        {},
        [],
        formProps
      );

      expect(component.find(Formik).state().values).to.not.have.property("date_of_interview");
    });
  });
});
