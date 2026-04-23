import { mountedComponent, screen } from "test-utils";

import CaseFamily from "./component";

describe("<CaseFamily />", () => {
  const props = {
    values: {},
    primeroModule: "primeromodule-cp",
    mobileDisplay: true,
    handleToggleNav: () => {},
    mode: { isEdit: false },
    recordType: "case",
    setFieldValue: () => {},
    record: {}
  };

  it("renders an empty subform", async () => {
    const initialState = {
      forms: { formSections: {} },
      records: { families: { data: [] } },
      user: {
        permissions: { cases: ["link_family_record"] }
      }
    };

    mountedComponent(<CaseFamily {...props} />, initialState);
    const postItemNode = await screen.findByText("forms.subform_not_found");

    expect(postItemNode).toBeInTheDocument();
  });

  it("renders the family subform header", async () => {
    const initialState = {
      forms: { formSections: {} },
      records: {
        families: {
          data: [
            {
              id: "2bece164-7eff-451b-a150-7dfd8905ee7b",
              family_id_display: "2bece164",
              family_number: "0001",
              family_name: "Some name"
            }
          ],
          loading: false
        }
      },
      user: {
        permissions: { cases: ["link_family_record"] }
      }
    };

    mountedComponent(
      <CaseFamily {...{ ...props, values: { family_id: "2bece164-7eff-451b-a150-7dfd8905ee7b" } }} />,
      initialState
    );

    const familyDisplayId = await screen.findByText("2bece164");
    const familyNumber = await screen.findByText("0001");
    const familyName = await screen.findByText("Some name");

    expect(familyDisplayId).toBeInTheDocument();
    expect(familyNumber).toBeInTheDocument();
    expect(familyName).toBeInTheDocument();
  });
});
