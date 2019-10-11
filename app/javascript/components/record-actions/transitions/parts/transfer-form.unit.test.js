import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Button
} from "@material-ui/core";
import { SearchableSelect } from "components/searchable-select";
import TransferForm from "./transfer-form";

describe("<TransferForm />", () => {
  let component;
  const props = {
    providedConsent: false,
    isBulkTransfer: false,
    userPermissions: Map({ cases: ["manage"] }),
    handleClose: () => {}
  }
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferForm, props));
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(2);
  });

  it("renders Checkbox", () => {
    expect(component.find(Checkbox)).to.have.length(2);
  });

  it("renders TextField", () => {
    expect(component.find(TextField)).to.have.length(4);
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(3);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });
});
