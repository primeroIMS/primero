import { mountedComponent, screen } from "test-utils";

import Support from "./container";
import { ContactInformationRecord } from "./records";

describe("<Support />", () => {
  beforeEach(() => {
    mountedComponent(<Support />, {
      records: {
        Support: {
          data: ContactInformationRecord({
            name: "Simon Nehme",
            organization: "UNICEF",
            position: "Child Protection Officer - CPIMS Administrator",
            phone: "+961 70 673 187",
            email: "snehme@unicef.org",
            location: "United Nations Children’s Fund Lebanon",
            support_forum: "https://google.com",
            other_information: "",
            primeroVersion: "1.3.15"
          })
        }
      }
    });
  });

  it("renders the Support", () => {
    expect(screen.getAllByTestId("support")).toHaveLength(1);
  });
});
