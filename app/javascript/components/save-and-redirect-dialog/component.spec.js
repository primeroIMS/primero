import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { RECORD_TYPES } from "../../config";

import SaveAndRedirectDialog from "./component";

describe("<SaveAndRedirectDialog /> - Component", () => {
  const props = {
    handleSubmit: () => {},
    incidentPath: "",
    mode: { isShow: false, isEdit: true },
    open: true,
    recordType: RECORD_TYPES.cases,
    setFieldValue: () => {},
    setRedirectOpts: () => {}
  };

  beforeEach(() => {
    mountedComponent(<SaveAndRedirectDialog {...props} />, fromJS({}));
  });

  it("render ActionDialog component", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
