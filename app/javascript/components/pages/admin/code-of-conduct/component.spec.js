import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { MODES } from "../../../../config";
import { ACTIONS } from "../../../permissions";

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
      mountedComponent(<CodeOfConductForm {...props} />, initialState);
      expect(screen.getByLabelText("code_of_conduct.field.created_by")).toHaveValue("test_user");
      expect(screen.getByLabelText("code_of_conduct.field.title *")).toHaveValue("Some Title");
      expect(screen.getByText("Some Content")).toBeInTheDocument();
      expect(screen.getByLabelText("code_of_conduct.field.created_on")).toHaveValue("14-t-2021 19:22");
    });
  });
});
