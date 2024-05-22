import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { lookups } from "../../../../../../test";
import { LOCALE_KEYS } from "../../../../../../config";

import Form from "./component";

describe("<Form /> - components/form/component", () => {
  const props = {
    formRef: { current: { submitForm: () => {} } },
    formMode: fromJS({ isShow: true }),
    lookup: fromJS(lookups().data[0])
  };
  const initialState = fromJS({
    application: {
      primero: {
        locales: [LOCALE_KEYS.en, "ar"]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<Form {...props} />, initialState);
  });

  it("renders FormSectionField component", () => {
    expect(screen.queryAllByTestId("form-section-field")).toHaveLength(4);
  });

  it("first value of the FormSectionField should be english", () => {
    expect(screen.getAllByText("lookup.english_label")).toBeTruthy();
  });

  it("renders SwitchInput component", () => {
    expect(screen.getAllByTestId("switch-input")).toBeTruthy();
  });
});
