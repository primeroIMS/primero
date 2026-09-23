import { mountedComponent, screen, fireEvent } from "test-utils";

import PendingTransitionMessage from "./component";

describe("<PendingTransitionMessage />", () => {
  const translations = {
    "case.messages.case_referral_pending_alert": "A Case referral is pending. %{link} before proceeding.",
    "case.messages.case_transfer_pending_alert": "A Case transfer is pending. %{link} before proceeding.",
    "case.messages.pending_transition_link": "Accept it here"
  };
  const originalTranslate = window.I18n.t;

  const translate = (key, options) =>
    (translations[key] || key).replace(/%{(\w+)}/g, (_match, name) => options?.[name] ?? `[missing ${name} value]`);

  beforeEach(() => {
    window.I18n.t = translate;
  });

  afterEach(() => {
    window.I18n.t = originalTranslate;
  });

  it("renders the link in place of the translation placeholder", () => {
    const { container } = mountedComponent(<PendingTransitionMessage transitionType="referral" />);

    expect(container.textContent).toBe("A Case referral is pending. Accept it here before proceeding.");
  });

  it("renders the transfer message and links to the transfers form", () => {
    const { container, store } = mountedComponent(<PendingTransitionMessage transitionType="transfer" />);

    expect(container.textContent).toBe("A Case transfer is pending. Accept it here before proceeding.");

    fireEvent.click(screen.getByRole("button", { name: "Accept it here" }));

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "transfers_assignments" }])
    );
  });

  it("selects the transition form when the link is clicked", () => {
    const { store } = mountedComponent(<PendingTransitionMessage transitionType="referral" />);

    fireEvent.click(screen.getByRole("button", { name: "Accept it here" }));

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "referral" }])
    );
  });

  it("selects the transition form when the link is activated with the keyboard", () => {
    const { store } = mountedComponent(<PendingTransitionMessage transitionType="referral" />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Accept it here" }), { key: "Enter" });

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "referral" }])
    );
  });

  it("renders the link after the message when the translation has no placeholder", () => {
    window.I18n.t = key => (key === "case.messages.pending_transition_link" ? "Accept it here" : "Referral pending");

    const { container } = mountedComponent(<PendingTransitionMessage transitionType="referral" />);

    expect(container.textContent).toBe("Referral pending Accept it here");
  });
});
