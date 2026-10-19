import { fromJS } from "immutable";

import { mountedComponent, screen, fireEvent } from "../../../../../test-utils";
import { ACTIONS } from "../../../../permissions";

import ServicesReferralLink from "./component";

describe("<ServicesReferralLink />", () => {
  const props = { recordType: "cases", primeroModule: "primeromodule-cp" };

  const stateWithCasePermissions = casePermissions => fromJS({ user: { permissions: { cases: casePermissions } } });

  it("renders the services referral message", () => {
    mountedComponent(<ServicesReferralLink {...props} />, stateWithCasePermissions([ACTIONS.REFERRAL]));

    expect(screen.getByTestId("services-referral-link")).toHaveTextContent("referral.services_form_message");
  });

  it("selects the referrals form when the link is clicked", () => {
    const { store } = mountedComponent(
      <ServicesReferralLink {...props} />,
      stateWithCasePermissions([ACTIONS.REFERRAL])
    );

    fireEvent.click(screen.getByRole("button", { name: "referral.services_form_link" }));

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "referral" }])
    );
  });

  it("renders nothing when the user cannot see the referrals form", () => {
    mountedComponent(<ServicesReferralLink {...props} />, stateWithCasePermissions([ACTIONS.READ]));

    expect(screen.queryByTestId("services-referral-link")).not.toBeInTheDocument();
  });

  it("renders the message when the record grants access to the referrals form", () => {
    mountedComponent(
      <ServicesReferralLink {...props} />,
      fromJS({
        user: { permissions: { cases: [ACTIONS.READ] } },
        records: {
          cases: {
            data: [{ id: "001", permitted_form_actions: { case: [ACTIONS.RECEIVE_REFERRAL] } }],
            selectedRecord: "001"
          }
        }
      })
    );

    expect(screen.getByTestId("services-referral-link")).toBeInTheDocument();
  });
});
