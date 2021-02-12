import { setupMockFormComponent } from "../../../../../../test";
import FieldsList from "../fields-list";

import FieldsTab from "./component";

describe("<FieldsTab />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(FieldsTab, {
      props: { index: 1, tab: 1, formContextFields: {}, fieldDialogMode: "new" }
    }));
  });

  it("should render <FieldsTab />", () => {
    expect(component.find(FieldsTab)).to.have.lengthOf(1);
  });

  it("should render <FieldsList />", () => {
    expect(component.find(FieldsList)).to.have.lengthOf(1);
  });
});
