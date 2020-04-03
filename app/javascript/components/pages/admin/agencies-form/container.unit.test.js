import { fromJS } from "immutable";

import { setupMountedComponent, expect } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import AgenciesForm from "./container";

describe("<AgenciesList />", () => {
  let component;

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

    ({ component } = setupMountedComponent(
      AgenciesForm,
      { mode: "new" },
      initialState,
      ["/admin/agencies"]
    ));
  });

  it("renders record form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("header h1").contains("agencies.label")).to.be.true;
    expect(component.find("header button").at(0).contains("buttons.cancel")).to
      .be.true;
    expect(component.find("header button").at(1).contains("buttons.save")).to.be
      .true;
  });

  it("renders submit button with valid props", () => {
    const saveButtonProps = { ...component.find(FormAction).at(1).props() };

    expect(component.find(saveButtonProps)).to.have.lengthOf(1);
    ["actionHandler", "text", "savingRecord"].forEach(property => {
      expect(saveButtonProps).to.have.property(property);
      delete saveButtonProps[property];
    });
    expect(saveButtonProps).to.be.empty;
  });
});
