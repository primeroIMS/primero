import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import FamilyRecordForm from "./component";

describe("<FamilyRecordForm />", () => {
  const props = {
    handleCancel: () => {},
    record: fromJS({
      id: "family-001",
      family_id_display: "f-001",
      family_number: "001",
      family_name: "Name of the family"
    })
  };

  it("renders the family record form", async () => {
    mountedComponent(<FamilyRecordForm {...props} />, {});
    const familyIdLink = screen.getByText("f-001");
    const familyNumber = screen.getByDisplayValue("001");
    const familyName = screen.getByDisplayValue("Name of the family");

    expect(familyIdLink).toBeInTheDocument();
    expect(familyIdLink).toHaveAttribute("href", "/families/family-001");
    expect(familyNumber).toBeInTheDocument();
    expect(familyName).toBeInTheDocument();
  });
});
