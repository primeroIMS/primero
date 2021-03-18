import { fromJS } from "immutable";
import { Tooltip } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { MODES } from "../../../../config";
import Form, { FormAction } from "../../../form";
import ActionDialog from "../../../action-dialog";
import TextInput from "../../../form/fields/text-input";
import DateInput from "../../../form/fields/date-input";

import ConfigurationsForm from "./container";

describe("<ConfigurationsForm />", () => {
  const initialState = fromJS({
    records: {
      admin: {
        configurations: {
          selectedConfiguration: {
            id: "ac3d041c-1592-4f99-8191-b38fbe448735",
            name: "SWIMS - 20200903",
            description: "September 2020 baseline",
            version: "20200826.113513.25bf89a",
            created_on: "2020-08-26T15:35:13.720Z",
            created_by: "primero_swims_admin",
            applied_on: null,
            applied_by: null,
            can_apply: true
          }
        }
      }
    },
    user: {
      permissions: {
        configurations: [ACTIONS.MANAGE]
      }
    }
  });

  describe("when isShow", () => {
    const props = {
      mode: MODES.show
    };

    const { component } = setupMountedComponent(ConfigurationsForm, props, initialState);

    it("should render Form component", () => {
      expect(component.find(Form)).to.have.lengthOf(1);
    });

    it("should render 2 FormAction components", () => {
      expect(component.find(FormAction)).to.have.lengthOf(2);
    });

    it("should render 6 TextInput components", () => {
      expect(component.find(TextInput)).to.have.lengthOf(6);
    });

    it("should render 2 DateInput components", () => {
      expect(component.find(DateInput)).to.have.lengthOf(2);
    });

    it("should render 2 ActionDialog component", () => {
      expect(component.find(ActionDialog)).to.have.lengthOf(3);
    });
  });

  describe("when the configuration can not be applied", () => {
    const props = {
      mode: MODES.show
    };

    const { component } = setupMountedComponent(
      ConfigurationsForm,
      props,
      initialState.setIn(["records", "admin", "configurations", "selectedConfiguration", "can_apply"], false)
    );

    it("should render the apply button as disabled", () => {
      expect(component.find(FormAction).last().props().disabled).to.be.true;
      expect(component.find(Tooltip)).to.have.lengthOf(1);
    });
  });

  describe("when isNew", () => {
    const props = {
      mode: MODES.new
    };
    const { component } = setupMountedComponent(ConfigurationsForm, props, initialState);

    it("should render Form component", () => {
      expect(component.find(Form)).to.have.lengthOf(1);
    });

    it("should render 1 FormAction components", () => {
      expect(component.find(FormAction)).to.have.lengthOf(1);
    });

    it("should render 2 TextInput components", () => {
      expect(component.find(TextInput)).to.have.lengthOf(2);
    });

    it("should render 2 ActionDialog component", () => {
      expect(component.find(ActionDialog)).to.have.lengthOf(3);
    });
  });
});
