import { fromJS } from "immutable";
import { mountedFormComponent, screen } from "test-utils";

import SubformFieldList from "./component";

describe("<SubformFieldList />", () => {
  const props = { formContextFields: {}, subformField: fromJS({}) };

  beforeEach(() => {
    mountedFormComponent(<SubformFieldList {...props} />);
  });

  it("should render <FieldList />", () => {
    expect(screen.getByText("forms.fields")).toBeInTheDocument();
  });
});
