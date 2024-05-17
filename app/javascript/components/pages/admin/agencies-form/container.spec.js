import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";

import AgenciesForm from "./container";

describe("<AgencyForm />", () => {
  beforeEach(() => {
    const initialState = fromJS({
      records: {
        agencies: {
          data: [
            {
              id: "1",
              name: {
                en: "Agency 1"
              }
            },
            {
              id: "2",
              name: {
                en: "Agency 2"
              }
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          agencies: [ACTIONS.MANAGE]
        }
      }
    });

    mountedComponent(<AgenciesForm mode="new" />, initialState, ["/admin/agencies"]);
  });

  it("renders record form", () => {
    expect(document.querySelector("#agency-form")).toBeInTheDocument();
  });

  it("renders heading with action buttons", () => {
    expect(screen.getByRole("heading", { name: /agencies\.label/i })).toBeInTheDocument();
    expect(screen.getByText("agencies.translations.manage")).toBeInTheDocument();
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    expect(screen.getByText("buttons.save")).toBeInTheDocument();
  });
});
