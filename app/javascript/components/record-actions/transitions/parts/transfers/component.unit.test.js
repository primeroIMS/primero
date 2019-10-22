import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Button
} from "@material-ui/core";
import { SearchableSelect } from "components/searchable-select";
import TransferForm from "./component";

describe("<TransferForm />", () => {
  let component;
  const defaultState = Map({
    application: Map({
      agencies: List([Map({ unique_id: "agency-unicef", name: "UNICEF" })])
    }),
    transitions: Map({
      transfer: Map({
        users: [{ id: 13, user_name: "primero_cp_ar" }]
      }),
      reassign: Map({
        users: [{ id: 13, user_name: "primero_cp_ar" }]
      })
    })
  });
  const props = {
    providedConsent: false,
    isBulkTransfer: false,
    userPermissions: Map({ cases: ["manage"] }),
    handleClose: () => {},
    transitionType: "transfer",
    record: Map({ id: "123abc" })
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferForm, props, defaultState));
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
