import { setupMountedComponent } from "../../../../../../test";

import FormGroup from "./component";

describe("<FormsList />/components/<FormGroup />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormGroup));
  });

  it.skip("renders <ExpansionPanel />", () => {});
  it.skip("renders <DragIndicator />", () => {});
  it.skip("renders children", () => {});
  it.skip("renders panel name", () => {});
});
