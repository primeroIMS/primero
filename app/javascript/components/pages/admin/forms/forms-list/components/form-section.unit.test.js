import { setupMountedComponent, expect } from "../../../../../../test";

import FormSection from "./form-section";

describe("<FormsList />/components/<FormSection />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormSection, { color: "error" }));
  });

  xit("renders <Droppable/>", () => {});

  xit("renders <TableRow/>", () => {});
});
