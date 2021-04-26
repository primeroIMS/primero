import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { MODES } from "../../../../config";
import TextInput from "../../../form/fields/text-input";
import DateInput from "../../../form/fields/date-input";
import { ACTIONS } from "../../../../libs/permissions";

import CodeOfConductForm from "./component";

describe("pages/admin/<CodeOfConductForm />", () => {
  const initialState = fromJS({
    records: {
      codeOfConduct: {
        data: {
          id: 1,
          title: "Some Title",
          content: "Some Content",
          created_by: "test_user",
          created_on: "2021-03-14T13:52:38.576Z"
        }
      }
    },
    user: {
      permissions: {
        codes_of_conduct: [ACTIONS.MANAGE]
      }
    }
  });

  describe("when isShow", () => {
    const props = {
      mode: MODES.show
    };

    it("should render the code of conduct if present", () => {
      const { component } = setupMountedComponent(CodeOfConductForm, props, initialState);

      const textInputs = component.find(TextInput);
      const { title, content, created_by: createdBy, created_on: createdOn } = textInputs
        .at(0)
        .props()
        .formMethods.getValues();

      expect(textInputs).to.have.lengthOf(3);
      expect(component.find(DateInput)).to.have.lengthOf(1);
      expect(title).to.equal("Some Title");
      expect(content).to.equal("Some Content");
      expect(createdBy).to.equal("test_user");
      expect(createdOn).to.equal("2021-03-14T13:52:38.576Z");
    });

    it("should render an empty form if code of conduct is not present", () => {
      const { component } = setupMountedComponent(
        CodeOfConductForm,
        props,
        fromJS({
          user: {
            permissions: {
              codes_of_conduct: [ACTIONS.MANAGE]
            }
          }
        })
      );

      const textInputs = component.find(TextInput);

      const { title, content, created_by: createdBy, created_on: createdOn } = textInputs
        .at(0)
        .props()
        .formMethods.getValues();

      expect(textInputs).to.have.lengthOf(3);
      expect(component.find(DateInput)).to.have.lengthOf(1);
      expect(title).to.equal("");
      expect(content).to.equal("");
      expect(createdBy).to.equal("");
      expect(createdOn).to.equal("");
    });
  });
});
