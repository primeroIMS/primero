import { mountedComponent, screen } from "test-utils";

import { MODES } from "../../../../config";
import { ACTIONS } from "../../../permissions";

import CodeOfConductForm from "./component";

describe("pages/admin/<CodeOfConductForm />", () => {
  beforeAll(() => {
    // eslint-disable-next-line no-extend-native
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  const userPermissions = {
    user: {
      permissions: {
        codes_of_conduct: [ACTIONS.MANAGE]
      }
    }
  };

  const initialState = {
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
    ...userPermissions
  };

  describe("when isShow", () => {
    const props = {
      mode: MODES.show
    };

    it("should render the code of conduct if present", () => {
      mountedComponent(<CodeOfConductForm {...props} />, initialState);
      expect(screen.getByLabelText("code_of_conduct.field.created_by")).toHaveValue("test_user");
      expect(screen.getByLabelText("code_of_conduct.field.title *")).toHaveValue("Some Title");
      expect(screen.getByLabelText("code_of_conduct.field.content *")).toHaveValue("Some Content");
      // Month is translated to t, due to i18n mocks in jest
      expect(screen.getByLabelText("code_of_conduct.field.created_on")).toHaveValue("14-t-2021 13:52");
    });

    it("should render an empty form if code of conduct is not present", () => {
      mountedComponent(<CodeOfConductForm {...props} />, { ...userPermissions });
      expect(screen.getByLabelText("code_of_conduct.field.created_by")).toHaveValue("");
      expect(screen.getByLabelText("code_of_conduct.field.title *")).toHaveValue("");
      expect(screen.getByLabelText("code_of_conduct.field.content *")).toHaveValue("");
      expect(screen.getByLabelText("code_of_conduct.field.created_on")).toHaveValue("");
    });
  });
});
