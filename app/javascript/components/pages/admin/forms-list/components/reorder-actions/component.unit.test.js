import { fromJS } from "immutable";
import { Button, Dialog } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";

import ReorderActions from "./component";

describe("<FormsList />/components/<ReorderActions />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            reorderedForms: {
              loading: false,
              errors: [],
              pending: []
            }
          }
        }
      }
    });

    ({ component } = setupMountedComponent(
      ReorderActions,
      {
        handleCancel: () => {},
        handleSuccess: () => {},
        open: true
      },
      initialState
    ));
  });

  it("renders <Dialog/>", () => {
    expect(component.find(Dialog)).to.have.lengthOf(1);
  });

  it("renders the dialog buttons", () => {
    expect(component.find(Button)).to.have.lengthOf(2);
  });
});
