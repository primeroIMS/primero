import { TextField as MuiTextField } from "formik-material-ui";
import { ButtonBase } from "@material-ui/core";
import { Route } from "react-router-dom";

import { setupMountedComponent, stub } from "../../../../test";
import { NUMERIC_FIELD } from "../../../form";
import { TEXT_FIELD_NAME } from "../constants";
import { generate } from "../../../notifier";

import TextField from "./text-field";

describe("<TextField />", () => {
  describe("when is a normal text-field", () => {
    const props = {
      field: {
        name: "text_test",
        type: TEXT_FIELD_NAME,
        display_name_en: "Text test field"
      },
      formik: {
        values: []
      },
      label: "Test",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "text_test"
    };

    const formProps = {
      initialValues: {
        text_test: "test2"
      }
    };

    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(TextField, props, {}, [], formProps));
    });

    it("should render the TextField", () => {
      expect(component.find(TextField)).lengthOf(1);
      expect(component.find(MuiTextField)).lengthOf(1);
    });
  });

  describe("when is a numeric text-field", () => {
    const props = {
      field: {
        name: "test_number",
        type: NUMERIC_FIELD,
        display_name_en: "Number test field"
      },
      formik: {
        values: []
      },
      label: "Test Number",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "test_number"
    };

    const formProps = { initialValues: { test_number: "" } };

    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(TextField, props, {}, [], formProps));
    });

    it("should set the value as a number", () => {
      component.find("input").simulate("change", { target: { value: "10" } });

      expect(component.find(MuiTextField).props().form.values.test_number).to.equal(10);
    });
  });

  describe("when the text-field has a name prop equals to name", () => {
    const props = {
      field: {
        name: "name",
        type: TEXT_FIELD_NAME,
        display_name_en: "Text test field"
      },
      formik: {
        values: []
      },
      label: "Test",
      mode: {
        isShow: false,
        isEdit: true
      },
      recordType: "cases",
      name: "name"
    };

    const formProps = {
      initialValues: {
        name: "testname"
      }
    };

    let component;

    beforeEach(() => {
      const routedComponent = initialProps => {
        return (
          <Route
            path="/:recordType(cases|incidents|tracing_requests)/:id"
            component={routeProps => <TextField {...{ ...props, ...initialProps, ...routeProps }} />}
          />
        );
      };

      ({ component } = setupMountedComponent(routedComponent, props, {}, ["/cases/1234abc/edit"], formProps));
    });

    it("should render the TextField", () => {
      expect(component.find(TextField)).lengthOf(1);
      expect(component.find(MuiTextField)).lengthOf(1);
    });

    it("should render the ButtonBase", () => {
      expect(component.find(ButtonBase)).lengthOf(1);
    });

    it("should trigger the save record action", () => {
      stub(generate, "messageKey").returns(1);
      const button = component.find(ButtonBase);
      const expected = {
        type: "cases/SAVE_RECORD",
        api: {
          id: "1234abc",
          recordType: "cases",
          path: "cases/1234abc",
          method: "PATCH",
          queueOffline: true,
          body: {
            data: {
              hidden_name: true
            }
          },
          successCallback: [
            {
              action: "notifications/ENQUEUE_SNACKBAR",
              payload: {
                message: false,
                messageFromQueue: false,
                options: {
                  variant: "success",
                  key: 1
                }
              },
              incidentPath: "",
              moduleID: undefined,
              preventSyncAfterRedirect: true,
              redirectWithIdFromResponse: false,
              setCaseIncidentData: "",
              redirect: false
            },
            {
              action: "cases/FETCH_RECORD_ALERTS",
              api: {
                path: "cases/1234abc/alerts",
                performFromQueue: true,
                skipDB: true
              }
            }
          ],
          db: {
            collection: "records",
            recordType: "cases"
          },
          queueAttachments: true
        }
      };

      button.simulate("click");
      const { store } = component.props();

      expect(store.getActions()).to.have.lengthOf(1);
      expect(store.getActions()[0]).to.deep.equal(expected);
    });

    afterEach(() => {
      if (generate.messageKey.restore) {
        generate.messageKey.restore();
      }
    });
  });
});
