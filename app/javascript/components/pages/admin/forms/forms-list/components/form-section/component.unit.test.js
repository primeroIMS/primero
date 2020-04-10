import { setupMountedComponent, expect } from "../../../../../../../test";

import FormSection from "./component";

describe("<FormsList />/components/<FormSection />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormSection, { color: "error" }));
  });

  it.skip("renders <Droppable/>", () => {});

  it.skip("renders <TableRow/>", () => {});
});
