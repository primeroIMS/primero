import { mountedFormComponent, screen } from "test-utils";

import FieldsList from "../fields-list";

import FieldsTab from "./component";

describe("<FieldsTab />", () => {
  beforeEach(() => {
    const props = {
      index: 1,
      tab: 1,
      formContextFields: {},
      fieldDialogMode: "new"
    };

    mountedFormComponent(<FieldsTab {...props} />);
  });

  it("should render <FieldsTab />", () => {
    expect(screen.getByText("fields.add_field")).toBeInTheDocument();
  });

  xit("should render <FieldsList />", () => {
    expect(screen.getByText(FieldsList)).toBeInTheDocument();
  });
});
